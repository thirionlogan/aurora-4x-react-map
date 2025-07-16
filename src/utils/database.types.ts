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
