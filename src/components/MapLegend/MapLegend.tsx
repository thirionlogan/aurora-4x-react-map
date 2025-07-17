import React from 'react';
import { MapLegendProps } from './MapLegend.types';

const MapLegend: React.FC<MapLegendProps> = ({ capitalNode, alienRaces }) => {
  return (
    <div className='absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 text-white text-xs p-2 rounded-lg'>
      <div className='mb-1 font-semibold text-sm'>Legend:</div>
      <div className='flex items-center mb-1'>
        <div
          className='w-3 h-3 rounded-full mr-2'
          style={{ backgroundColor: '#FFD700' }}
        ></div>
        <span>
          {capitalNode
            ? `${capitalNode.name} (${capitalNode.population.toFixed(
                2
              )} million)`
            : 'Capital System'}
        </span>
      </div>
      {/* Alien race entries */}
      {alienRaces && alienRaces.size > 0 ? (
        Array.from(alienRaces.entries()).map(([raceName, color]) => (
          <div key={raceName} className='flex items-center mb-1'>
            <div
              className='w-3 h-3 rounded-full mr-2'
              style={{ backgroundColor: color }}
            ></div>
            <span>{raceName} Colony</span>
          </div>
        ))
      ) : (
        <div className='flex items-center mb-1'>
          <div
            className='w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: '#FF00FF' }}
          ></div>
          <span>Alien-Controlled Colony</span>
        </div>
      )}
      <div className='flex items-center mb-1'>
        <div
          className='w-3 h-3 rounded-full mr-2'
          style={{ backgroundColor: '#FF5733' }}
        ></div>
        <span>Large Colony (&gt;100 million)</span>
      </div>
      <div className='flex items-center mb-1'>
        <div
          className='w-3 h-3 rounded-full mr-2'
          style={{ backgroundColor: '#FFC300' }}
        ></div>
        <span>Medium Colony (10-100 million)</span>
      </div>
      <div className='flex items-center mb-1'>
        <div
          className='w-3 h-3 rounded-full mr-2'
          style={{ backgroundColor: '#33A8FF' }}
        ></div>
        <span>Small Colony (1-10 million)</span>
      </div>
      <div className='flex items-center mb-1'>
        <div
          className='w-3 h-3 rounded-full mr-2'
          style={{ backgroundColor: '#85C1E9' }}
        ></div>
        <span>Minor Colony (&lt;1 million)</span>
      </div>
      <div className='flex items-center mb-1'>
        <div
          className='w-3 h-3 rounded-full mr-2'
          style={{ backgroundColor: '#9BA5B7' }}
        ></div>
        <span>Uninhabited System</span>
      </div>

      {/* Jump gate connection legend entries */}
      <div className='mt-2 mb-1 font-semibold text-sm'>Connections:</div>
      <div className='flex items-center mb-1'>
        <div className='w-12 h-0.5 mr-2 bg-[#FFA500]'></div>
        <span>Jump Gate Connection</span>
      </div>
      <div className='flex items-center mb-1'>
        <div
          className='w-12 h-0.5 mr-2'
          style={{
            background: 'linear-gradient(to right, #FFA500 45%, #8B95A5 55%)',
          }}
        ></div>
        <span>Single Jump Gate</span>
      </div>
      <div className='flex items-center mb-1'>
        <div className='w-12 h-0.5 mr-2 bg-[#8B95A5]'></div>
        <span>Unstabilized Connection</span>
      </div>
    </div>
  );
};

export default MapLegend;
