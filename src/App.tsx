import React, { useEffect, useState } from 'react';
import StarNetworkVisualization from './StarNetworkVisualization';
import DbUploadModal from './DbUploadModal';
import GameSelectModal from './GameSelectModal';
import RaceSelectModal from './RaceSelectModal';
import {
  extractSystemConnections,
  extractPopulationData,
  SystemConnection,
  PopulationData,
} from './dataExtraction';

const DB_PRESENT_FLAG = 'aurora-db-present';

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

  useEffect(() => {
    setDbPresent(localStorage.getItem(DB_PRESENT_FLAG) === 'true');
  }, []);

  const handleDbLoaded = () => {
    setDbPresent(true);
  };

  const handleGameSelected = (gameId: number) => {
    setSelectedGameId(gameId);
  };

  const handleRaceSelected = async (raceId: number) => {
    setSelectedRaceId(raceId);
    setLoading(true);
    setError(null);

    try {
      // Extract both system connections and population data
      const [connections, population] = await Promise.all([
        extractSystemConnections(selectedGameId!, raceId),
        extractPopulationData(selectedGameId!, raceId),
      ]);

      setSystemConnections(connections);
      setPopulationData(population);
    } catch (e) {
      setError('Failed to extract data from database.');
    } finally {
      setLoading(false);
    }
  };

  if (!dbPresent) {
    return <DbUploadModal onDbLoaded={handleDbLoaded} />;
  }

  if (selectedGameId === null) {
    return <GameSelectModal onGameSelected={handleGameSelected} />;
  }

  if (selectedRaceId === null) {
    return (
      <RaceSelectModal
        selectedGameId={selectedGameId}
        onRaceSelected={handleRaceSelected}
      />
    );
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
    />
  );
}

export default App;
