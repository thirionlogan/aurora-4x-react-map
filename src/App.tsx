import React, { useEffect, useState } from 'react';
import StarNetworkVisualization from './StarNetworkVisualization';
import SetupModal from './SetupModal';
import {
  extractSystemConnections,
  extractPopulationData,
  SystemConnection,
  PopulationData,
} from './dataExtraction';

const DB_PRESENT_FLAG = 'aurora-db-present';
const SELECTED_GAME_ID = 'aurora-selected-game-id';
const SELECTED_RACE_ID = 'aurora-selected-race-id';

function App() {
  const [dbPresent, setDbPresent] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [systemConnections, setSystemConnections] = useState<
    SystemConnection[]
  >([]);
  const [populationData, setPopulationData] = useState<PopulationData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    const dbPresent = localStorage.getItem(DB_PRESENT_FLAG) === 'true';
    const savedGameId = localStorage.getItem(SELECTED_GAME_ID);
    const savedRaceId = localStorage.getItem(SELECTED_RACE_ID);

    setDbPresent(dbPresent);

    if (dbPresent && savedGameId && savedRaceId) {
      const gameId = Number(savedGameId);
      const raceId = Number(savedRaceId);
      setSelectedGameId(gameId);
      setSelectedRaceId(raceId);

      // Automatically load the map with saved data
      loadMapData(gameId, raceId);
    }
  }, []);

  const loadMapData = async (gameId: number, raceId: number) => {
    setLoading(true);
    setError(null);

    try {
      const [connections, population] = await Promise.all([
        extractSystemConnections(gameId, raceId),
        extractPopulationData(gameId, raceId),
      ]);

      setSystemConnections(connections);
      setPopulationData(population);
      setSetupComplete(true);
    } catch (e) {
      console.error('Error loading map data:', e);
      setError('Failed to extract data from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = async (gameId: number, raceId: number) => {
    setSelectedGameId(gameId);
    setSelectedRaceId(raceId);
    setDbPresent(true);

    // Persist the selections
    localStorage.setItem(SELECTED_GAME_ID, gameId.toString());
    localStorage.setItem(SELECTED_RACE_ID, raceId.toString());

    await loadMapData(gameId, raceId);
    setShowSetupModal(false);
  };

  const handleOpenSetupModal = () => {
    setShowSetupModal(true);
  };

  // Show setup modal if setup is not complete or if explicitly requested
  if (
    showSetupModal ||
    (!setupComplete &&
      (!dbPresent || selectedGameId === null || selectedRaceId === null))
  ) {
    return <SetupModal onSetupComplete={handleSetupComplete} />;
  }

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: 'white',
            padding: 32,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <h2>Loading Data...</h2>
          <p>
            Extracting system connections and population data from database...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: 'white',
            padding: 32,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <h2>Error</h2>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }

  return (
    <StarNetworkVisualization
      systemConnections={systemConnections}
      populationData={populationData}
      onOpenSetup={handleOpenSetupModal}
    />
  );
}

export default App;
