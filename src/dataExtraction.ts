import { executeQuery } from './utils/database';

export interface SystemConnection {
  systemId: number;
  systemName: string;
  connectedTo: Array<{
    systemId: number;
    systemName: string;
    jumpGateRaceId: number;
  }>;
  connectionCount: number;
}

export interface PopulationStats {
  RaceName: string;
  ColonyCount: number;
  TotalPopulation: number;
}

export interface ColonyDetails {
  PopulationID: number;
  PopulationName: string;
  Population: number;
  SystemName: string;
  BodyName: string;
}

export interface SystemDistribution {
  SystemName: string;
  ColonyCount: number;
  TotalPopulation: number;
  Colonies: string[];
}

export interface PopulationData {
  raceName: string;
  summary: {
    colonyCount: number;
    totalPopulation: number;
  };
  colonies: ColonyDetails[];
  systemDistribution: SystemDistribution[];
}

export const extractSystemConnections = async (
  gameId: number,
  raceId: number
): Promise<SystemConnection[]> => {
  const query = `
    WITH SystemNames AS (
        -- Get system names from FCT_RaceSysSurvey and FCT_System
        -- Only include systems that have been surveyed by the specified race
        SELECT DISTINCT
            s.SystemID,
            rs.Name as SystemName
        FROM FCT_System s
        LEFT JOIN FCT_RaceSysSurvey rs ON s.SystemID = rs.SystemID
            AND s.GameID = rs.GameID
            AND rs.RaceID = ?
            AND rs.GameID = ?
        WHERE s.GameID = ?
        AND rs.RaceID = ?  -- Only include surveyed systems
    ),
    ConnectedSystems AS (
        -- First get the source system and the destination warp point ID
        -- Only include systems that are in SystemNames
        SELECT
            s1.SystemID as SourceSystemID,
            sn1.SystemName as SourceSystemName,
            jp1.WPLink as DestinationWarpPointID,
            jp1.JumpGateRaceID
        FROM FCT_System s1
        JOIN FCT_JumpPoint jp1 ON s1.SystemID = jp1.SystemID
        JOIN SystemNames sn1 ON s1.SystemID = sn1.SystemID
        WHERE s1.GameID = ?
        AND jp1.WPLink > 0
    ),
    SystemLinks AS (
        -- Then join with destination system information
        -- Only include connections where both systems are known
        SELECT
            cs.SourceSystemID,
            cs.SourceSystemName,
            s2.SystemID as DestinationSystemID,
            sn2.SystemName as DestinationSystemName,
            cs.JumpGateRaceID
        FROM ConnectedSystems cs
        JOIN FCT_JumpPoint jp2 ON cs.DestinationWarpPointID = jp2.WarpPointID
        JOIN FCT_System s2 ON jp2.SystemID = s2.SystemID
        JOIN SystemNames sn2 ON s2.SystemID = sn2.SystemID  -- This ensures destination is also known
    )
    SELECT
        SourceSystemID as systemId,
        SourceSystemName as systemName,
        json_group_array(
            json_object(
                'systemId', DestinationSystemID,
                'systemName', DestinationSystemName,
                'jumpGateRaceId', JumpGateRaceID
            )
        ) as connectedTo,
        COUNT(DISTINCT DestinationSystemID) as connectionCount
    FROM SystemLinks
    GROUP BY SourceSystemID, SourceSystemName
    ORDER BY
        SourceSystemName;
  `;

  const results = (await executeQuery(query, [
    raceId,
    gameId,
    gameId,
    raceId,
    gameId,
  ])) as Array<{
    columns: string[];
    values: [number, string, string, number][];
  }>;

  if (results.length === 0) {
    // Fallback query for single-system games or when no connections are found
    const fallbackQuery = `
      SELECT 
        s.SystemID as systemId,
        rs.Name as systemName,
        '[]' as connectedTo,
        0 as connectionCount
      FROM FCT_System s
      LEFT JOIN FCT_RaceSysSurvey rs ON s.SystemID = rs.SystemID 
        AND s.GameID = rs.GameID 
        AND rs.RaceID = ? 
        AND rs.GameID = ?
      WHERE s.GameID = ?
      AND rs.RaceID = ?
      ORDER BY systemName
    `;

    const fallbackResults = (await executeQuery(fallbackQuery, [
      raceId,
      gameId,
      gameId,
      raceId,
    ])) as Array<{
      columns: string[];
      values: [number, string, string, number][];
    }>;

    if (fallbackResults.length === 0) {
      return [];
    }

    const fallbackConnections = fallbackResults[0].values.map((row) => ({
      systemId: row[0],
      systemName: row[1],
      connectedTo: JSON.parse(row[2]),
      connectionCount: row[3],
    }));

    return fallbackConnections;
  }

  const connections = results[0].values.map((row) => ({
    systemId: row[0],
    systemName: row[1],
    connectedTo: JSON.parse(row[2]),
    connectionCount: row[3],
  }));

  return connections;
};

export const extractPopulationData = async (
  gameId: number,
  raceId: number
): Promise<PopulationData> => {
  // Get basic population statistics
  const popStatsQuery = `
    SELECT 
      r.RaceName,
      COUNT(CASE WHEN p.Population > 0 THEN 1 END) as ColonyCount, 
      SUM(p.Population) as TotalPopulation
    FROM FCT_Population p
    JOIN FCT_Race r ON p.RaceID = r.RaceID AND p.GameID = r.GameID
    WHERE p.RaceID = ? AND p.GameID = ?
  `;

  const popStatsResult = (await executeQuery(popStatsQuery, [
    raceId,
    gameId,
  ])) as Array<{
    columns: string[];
    values: [string, number, number][];
  }>;

  if (popStatsResult.length === 0 || popStatsResult[0].values.length === 0) {
    throw new Error(
      `No population data found for RaceID ${raceId} in game ${gameId}`
    );
  }

  const popStats = popStatsResult[0].values[0];
  const populationStats: PopulationStats = {
    RaceName: popStats[0],
    ColonyCount: popStats[1],
    TotalPopulation: popStats[2],
  };

  // Get detailed colony information
  const coloniesQuery = `
    SELECT 
      p.PopulationID,
      p.PopName as PopulationName,
      p.Population,
      rss.Name as SystemName,
      COALESCE(sb.Name, '') as BodyName
    FROM FCT_Population p
    JOIN FCT_RaceSysSurvey rss ON p.SystemID = rss.SystemID AND p.GameID = rss.GameID AND p.RaceID = rss.RaceID
    LEFT JOIN FCT_SystemBody sb ON p.SystemBodyID = sb.SystemBodyID AND p.GameID = sb.GameID
    WHERE p.RaceID = ? AND p.GameID = ? AND p.Population > 0
    ORDER BY p.Population DESC
  `;

  const coloniesResult = (await executeQuery(coloniesQuery, [
    raceId,
    gameId,
  ])) as Array<{
    columns: string[];
    values: [number, string, number, string, string][];
  }>;

  const colonies: ColonyDetails[] =
    coloniesResult.length > 0
      ? coloniesResult[0].values.map((row) => ({
          PopulationID: row[0],
          PopulationName: row[1],
          Population: row[2],
          SystemName: row[3],
          BodyName: row[4],
        }))
      : [];

  // Get population distribution by system
  const systemDistributionQuery = `
    SELECT 
      rss.Name as SystemName,
      COUNT(*) as ColonyCount,
      SUM(p.Population) as TotalPopulation,
      GROUP_CONCAT(p.PopName) as Colonies
    FROM FCT_Population p
    JOIN FCT_RaceSysSurvey rss ON p.SystemID = rss.SystemID AND p.GameID = rss.GameID AND p.RaceID = rss.RaceID
    WHERE p.RaceID = ? AND p.GameID = ? AND p.Population > 0
    GROUP BY rss.SystemID, rss.Name
    ORDER BY TotalPopulation DESC
  `;

  const systemDistributionResult = (await executeQuery(
    systemDistributionQuery,
    [raceId, gameId]
  )) as Array<{
    columns: string[];
    values: [string, number, number, string][];
  }>;

  const systemDistribution: SystemDistribution[] =
    systemDistributionResult.length > 0
      ? systemDistributionResult[0].values.map((row) => ({
          SystemName: row[0],
          ColonyCount: row[1],
          TotalPopulation: row[2],
          Colonies: row[3].split(','),
        }))
      : [];

  return {
    raceName: populationStats.RaceName,
    summary: {
      colonyCount: populationStats.ColonyCount,
      totalPopulation: populationStats.TotalPopulation,
    },
    colonies: colonies,
    systemDistribution: systemDistribution,
  };
};

export const getCapitalSystemId = async (
  gameId: number,
  raceId: number
): Promise<number | null> => {
  const result = await executeQuery(
    `SELECT SystemID FROM FCT_Population WHERE GameID = ? AND RaceID = ? AND Capital = 1 LIMIT 1`,
    [gameId, raceId]
  );
  if (result.length > 0 && result[0].values.length > 0) {
    return result[0].values[0][0] as number;
  }
  return null;
};
