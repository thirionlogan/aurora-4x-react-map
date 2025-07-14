import React, { useCallback, useRef, useState } from 'react';
import { set } from 'idb-keyval';

interface DbUploadModalProps {
  onDbLoaded: () => void;
}

const DB_KEY = 'aurora-db';
const DB_PRESENT_FLAG = 'aurora-db-present';

const DbUploadModal: React.FC<DbUploadModalProps> = ({ onDbLoaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const arrayBuffer = await file.arrayBuffer();
      await set(DB_KEY, arrayBuffer);
      localStorage.setItem(DB_PRESENT_FLAG, 'true');
      onDbLoaded();
    },
    [onDbLoaded]
  );

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
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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
        <p>Drag and drop your AuroraDB.db file here</p>
        <p>or</p>
        <input
          type='file'
          accept='.db'
          ref={inputRef}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default DbUploadModal;
