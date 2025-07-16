import { executeQuery } from './database';
import { SystemConnection } from './database.types';

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
