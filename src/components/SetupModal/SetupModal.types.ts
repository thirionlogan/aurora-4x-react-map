export interface SetupModalProps {
  onSetupComplete: (gameId: number, raceId: number) => void;
  onCancel?: () => void;
  selectedGameId?: number | null;
  selectedRaceId?: number | null;
}

export interface Game {
  GameID: number;
  GameName: string;
}

export interface Race {
  RaceID: number;
  RaceName: string;
}
