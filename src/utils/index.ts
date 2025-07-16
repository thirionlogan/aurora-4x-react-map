// Re-export all data extraction functions and types for backward compatibility
export * from './database.types';
export { extractSystemConnections } from './systemConnections';
export { extractPopulationData } from './populationData';
export { getCapitalSystemId } from './capitalSystem';
export { executeQuery, databaseExists } from './database';
