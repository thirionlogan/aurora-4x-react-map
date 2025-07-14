import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';

declare global {
  interface Window {
    initSqlJs: any;
  }
}

interface GameSelectModalProps {
  onGameSelected: (gameId: number) => void;
}

interface Game {
  GameID: number;
  GameName: string;
}

const DB_KEY = 'aurora-db';

const GameSelectModal: React.FC<GameSelectModalProps> = ({
  onGameSelected,
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
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
        const result = db.exec('SELECT GameID, GameName FROM FCT_Game');
        if (result.length === 0) {
          setGames([]);
        } else {
          const values = result[0].values as [number, string][];
          setGames(values.map(([GameID, GameName]) => ({ GameID, GameName })));
        }
        setLoading(false);
      } catch (e) {
        setError('Failed to load games from database.');
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGameId(Number(e.target.value));
  };

  const handleConfirm = () => {
    if (selectedGameId !== null) {
      onGameSelected(selectedGameId);
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
        <h2>Select a Game</h2>
        {loading && <p>Loading games...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <>
            <select
              value={selectedGameId ?? ''}
              onChange={handleSelect}
              style={{ width: '100%', marginBottom: 16 }}
            >
              <option value='' disabled>
                Select a game...
              </option>
              {games.map((game) => (
                <option key={game.GameID} value={game.GameID}>
                  {game.GameName}
                </option>
              ))}
            </select>
            <button onClick={handleConfirm} disabled={selectedGameId === null}>
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameSelectModal;
