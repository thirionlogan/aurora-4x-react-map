import { SystemConnection, PopulationData } from '../../utils';

export interface StarNetworkVisualizationProps {
  systemConnections: SystemConnection[];
  populationData: PopulationData | null;
  capitalSystemId?: number | null;
  onOpenSetup?: () => void;
}
