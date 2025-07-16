import React, { useCallback, useEffect, useRef, useState } from 'react';
import { set } from 'idb-keyval';
import { executeQuery, databaseExists } from '../../utils';
import { SetupModalProps, Game, Race } from './SetupModal.types';

const DB_KEY = 'aurora-db';
const DB_PRESENT_FLAG = 'aurora-db-present';

const SetupModal: React.FC<SetupModalProps> = ({
  onSetupComplete,
  onCancel,
  selectedGameId: initialGameId = null,
  selectedRaceId: initialRaceId = null,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [databaseFileName, setDatabaseFileName] = useState<string>('');
  const [games, setGames] = useState<Game[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(
    initialGameId
  );
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(
    initialRaceId
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Track original selections to determine if we can cancel
  const [originalGameId] = useState<number | null>(initialGameId);
  const [originalRaceId] = useState<number | null>(initialRaceId);

  const loadGames = async () => {
    try {
      const result = await executeQuery(
        'SELECT GameID, GameName FROM FCT_Game'
      );
      if (result.length === 0) {
        setGames([]);
      } else {
        const values = result[0].values as [number, string][];
        setGames(values.map(([GameID, GameName]) => ({ GameID, GameName })));
      }
    } catch (e) {
      setError('Failed to load games from database.');
    }
  };

  const loadRaces = async (gameId: number) => {
    try {
      const result = await executeQuery(
        'SELECT RaceID, RaceName FROM FCT_Race WHERE GameID = ?',
        [gameId]
      );
      if (result.length === 0) {
        setRaces([]);
      } else {
        const values = result[0].values as [number, string][];
        setRaces(values.map(([RaceID, RaceName]) => ({ RaceID, RaceName })));
      }
    } catch (e) {
      setError('Failed to load races from database.');
    }
  };

  // Check if database is already present on mount
  useEffect(() => {
    const checkExistingDb = async () => {
      try {
        if (await databaseExists()) {
          // Database exists, set a placeholder filename and load games
          setDatabaseFileName('AuroraDB.db (uploaded)');
          await loadGames();

          // If we have a pre-selected game, load its races
          if (initialGameId) {
            await loadRaces(initialGameId);
          }
        }
      } catch (e) {
        // Database doesn't exist or is invalid
      }
    };
    checkExistingDb();
  }, [initialGameId]);

  const handleFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    setDatabaseFileName(file.name);
    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      await set(DB_KEY, arrayBuffer);
      localStorage.setItem(DB_PRESENT_FLAG, 'true');

      // Load games after database is uploaded
      await loadGames();
    } catch (e) {
      setError('Failed to upload database file.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleGameSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gameId = Number(e.target.value);
    setSelectedGameId(gameId);
    setSelectedRaceId(null); // Reset race selection when game changes
    if (gameId) {
      loadRaces(gameId);
    } else {
      setRaces([]);
    }
  };

  const handleRaceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRaceId(Number(e.target.value));
  };

  const handleGenerateMap = () => {
    if (selectedGameId !== null && selectedRaceId !== null) {
      onSetupComplete(selectedGameId, selectedRaceId);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const canProceed = () => {
    return selectedGameId !== null && selectedRaceId !== null;
  };

  const canCancel = () => {
    // Show cancel button if we have original selections to revert to
    return originalGameId !== null && originalRaceId !== null;
  };

  return (
    <div className='setup-modal-backdrop'>
      <div className='setup-modal'>
        <div className='setup-modal-header'>
          <h2 className='setup-modal-title'>Create Solar System Map</h2>
          <p className='setup-modal-subtitle'>
            Upload your game database and select parameters
          </p>
        </div>

        <div className='setup-modal-body'>
          {error && (
            <div className='setup-error-message'>
              <p>{error}</p>
            </div>
          )}

          <div className='setup-form-group'>
            <label className='setup-form-label' htmlFor='database-file'>
              Database File
            </label>
            <div
              className={`setup-file-upload-area ${
                dragActive ? 'setup-drag-over' : ''
              }`}
              id='file-upload-area'
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type='file'
                id='database-file'
                className='setup-file-input'
                accept='.db,.sqlite,.sql'
                ref={inputRef}
                onChange={handleInputChange}
              />
              <svg
                className='setup-upload-icon'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                ></path>
              </svg>
              <div className='setup-upload-text'>
                {databaseFileName || selectedFile
                  ? selectedFile?.name || databaseFileName
                  : 'Drop your database file here'}
              </div>
              <div className='setup-upload-subtext'>
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : databaseFileName
                  ? 'Database already uploaded'
                  : 'or click to browse (.db, .sqlite, .sql)'}
              </div>
            </div>
          </div>

          <div className='setup-dropdown-container'>
            <div className='setup-form-group'>
              <label className='setup-form-label' htmlFor='game-select'>
                Game
              </label>
              <div className='setup-select-wrapper'>
                <select
                  id='game-select'
                  className='setup-form-select'
                  value={selectedGameId ?? ''}
                  onChange={handleGameSelect}
                  disabled={games.length === 0}
                >
                  <option value=''>Select a game...</option>
                  {games.map((game) => (
                    <option key={game.GameID} value={game.GameID}>
                      {game.GameName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='setup-form-group'>
              <label className='setup-form-label' htmlFor='race-select'>
                Race/Faction
              </label>
              <div className='setup-select-wrapper'>
                <select
                  id='race-select'
                  className='setup-form-select'
                  value={selectedRaceId ?? ''}
                  onChange={handleRaceSelect}
                  disabled={races.length === 0 || selectedGameId === null}
                >
                  <option value=''>Select a race...</option>
                  {races.map((race) => (
                    <option key={race.RaceID} value={race.RaceID}>
                      {race.RaceName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className='setup-modal-footer'>
          {canCancel() && (
            <button
              type='button'
              className='setup-button setup-button-secondary'
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          <button
            type='button'
            className='setup-button setup-button-primary'
            disabled={!canProceed() || loading}
            onClick={handleGenerateMap}
          >
            {loading ? 'Loading...' : 'Generate Map'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupModal;
