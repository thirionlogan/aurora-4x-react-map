import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';

declare global {
  interface Window {
    initSqlJs: any;
  }
}

interface RaceSelectModalProps {
  selectedGameId: number;
  onRaceSelected: (raceId: number) => void;
}

interface Race {
  RaceID: number;
  RaceName: string;
}

const DB_KEY = 'aurora-db';

const RaceSelectModal: React.FC<RaceSelectModalProps> = ({
  selectedGameId,
  onRaceSelected,
}) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRaces = async () => {
      try {
        const dbArrayBuffer = await get(DB_KEY);
        if (!dbArrayBuffer) {
          setError('No database found.');
          setLoading(false);
          return;
        }
        // Use the CDN approach
        const SQL = await window.initSqlJs({
          locateFile: (file: string) =>
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`,
        });
        const db = new SQL.Database(new Uint8Array(dbArrayBuffer));
        const result = db.exec(
          'SELECT RaceID, RaceName FROM FCT_Race WHERE GameID = ?',
          [selectedGameId]
        );
        if (result.length === 0) {
          setRaces([]);
        } else {
          const values = result[0].values as [number, string][];
          setRaces(values.map(([RaceID, RaceName]) => ({ RaceID, RaceName })));
        }
        setLoading(false);
      } catch (e) {
        setError('Failed to load races from database.');
        setLoading(false);
      }
    };
    loadRaces();
  }, [selectedGameId]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRaceId(Number(e.target.value));
  };

  const handleConfirm = () => {
    if (selectedRaceId !== null) {
      onRaceSelected(selectedRaceId);
    }
  };

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
          minWidth: 300,
          textAlign: 'center',
        }}
      >
        <h2>Select a Race</h2>
        {loading && <p>Loading races...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <>
            <select
              value={selectedRaceId ?? ''}
              onChange={handleSelect}
              style={{ width: '100%', marginBottom: 16 }}
            >
              <option value='' disabled>
                Select a race...
              </option>
              {races.map((race) => (
                <option key={race.RaceID} value={race.RaceID}>
                  {race.RaceName}
                </option>
              ))}
            </select>
            <button onClick={handleConfirm} disabled={selectedRaceId === null}>
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RaceSelectModal;
