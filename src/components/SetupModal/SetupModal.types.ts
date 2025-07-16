export interface SetupModalProps {
  onSetupComplete: (gameId: number, raceId: number) => void;
}

export interface Game {
  GameID: number;
  GameName: string;
}

export interface Race {
  RaceID: number;
  RaceName: string;
}
