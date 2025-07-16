import { get } from 'idb-keyval';

declare global {
  interface Window {
    initSqlJs: any;
  }
}

const DB_KEY = 'aurora-db';

export interface DatabaseConnection {
  db: any; // SQL.js Database instance
  close: () => void;
}

/**
 * Get a database connection with proper initialization
 * @returns Promise<DatabaseConnection> - Object with database instance and close method
 */
export const getDatabaseConnection = async (): Promise<DatabaseConnection> => {
  const dbArrayBuffer = await get(DB_KEY);
  if (!dbArrayBuffer) {
    throw new Error('No database found.');
  }

  const SQL = await window.initSqlJs({
    locateFile: (file: string) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`,
  });

  const db = new SQL.Database(new Uint8Array(dbArrayBuffer));

  return {
    db,
    close: () => db.close(),
  };
};

/**
 * Execute a database query with automatic connection management
 * @param query - SQL query string
 * @param params - Query parameters (optional)
 * @returns Promise<any[]> - Query results
 */
export const executeQuery = async (
  query: string,
  params: any[] = []
): Promise<any[]> => {
  const connection = await getDatabaseConnection();

  try {
    const result = connection.db.exec(query, params);
    return result;
  } finally {
    connection.close();
  }
};

/**
 * Check if database exists in IndexedDB
 * @returns Promise<boolean>
 */
export const databaseExists = async (): Promise<boolean> => {
  try {
    const dbArrayBuffer = await get(DB_KEY);
    return !!dbArrayBuffer;
  } catch {
    return false;
  }
};
