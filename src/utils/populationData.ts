import { executeQuery } from './database';
import {
  PopulationData,
  PopulationStats,
  ColonyDetails,
  SystemDistribution,
} from './database.types';

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

  // Get detailed colony information (including alien colonies in surveyed systems)
  const coloniesQuery = `
    SELECT 
      p.PopulationID,
      p.PopName as PopulationName,
      p.Population,
      rss.Name as SystemName,
      COALESCE(sb.Name, '') as BodyName,
      p.RaceID as ControllingRaceID,
      r.RaceName as ControllingRaceName
    FROM FCT_Population p
    JOIN FCT_RaceSysSurvey rss ON p.SystemID = rss.SystemID AND p.GameID = rss.GameID
    LEFT JOIN FCT_SystemBody sb ON p.SystemBodyID = sb.SystemBodyID AND p.GameID = sb.GameID
    JOIN FCT_Race r ON p.RaceID = r.RaceID AND p.GameID = r.GameID
    WHERE rss.RaceID = ? AND rss.GameID = ? AND p.Population > 0
    ORDER BY p.Population DESC
  `;

  const coloniesResult = (await executeQuery(coloniesQuery, [
    raceId,
    gameId,
  ])) as Array<{
    columns: string[];
    values: [number, string, number, string, string, number, string][];
  }>;

  const colonies: ColonyDetails[] =
    coloniesResult.length > 0
      ? coloniesResult[0].values.map((row) => ({
          PopulationID: row[0],
          PopulationName: row[1],
          Population: row[2],
          SystemName: row[3],
          BodyName: row[4],
          ControllingRaceID: row[5],
          ControllingRaceName: row[6],
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
