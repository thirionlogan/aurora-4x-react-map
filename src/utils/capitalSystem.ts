import { executeQuery } from './database';

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
