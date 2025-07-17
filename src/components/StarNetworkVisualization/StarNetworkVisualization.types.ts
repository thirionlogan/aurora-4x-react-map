import { SystemConnection, PopulationData } from '../../utils';

export interface StarNetworkVisualizationProps {
  systemConnections: SystemConnection[];
  populationData: PopulationData | null;
  capitalSystemId?: number | null;
  onOpenSetup?: () => void;
  selectedRaceId?: number | null;
}

export interface NodesMap {
  [key: string]: {
    id: number;
    name: string;
    connections: number;
    connected: number[];
    population: number;
    colonies: Colony[];
    hasColony: boolean;
  };
}

export interface Colony {
  name: string;
  bodyName: string;
  population: number;
  controlledBy?: string;
}

export interface Node {
  x: number;
  y: number;
  depth: number;
  id: number;
  name: string;
  connections: number;
  connected: number[];
  population: number;
  colonies: Colony[];
  hasColony: boolean;
}
