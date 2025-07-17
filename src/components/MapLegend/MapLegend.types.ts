export interface MapLegendProps {
  capitalNode?: {
    name: string;
    population: number;
  } | null;
  alienRaces?: Map<string, string>; // Map of race name to color
}
