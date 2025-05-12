import React from 'react';

const ChambreStats = ({ stats }) => {
  return (
    <div className="p-4 bg-white/20 backdrop-blur-md rounded-xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="flex flex-col justify-between p-4 bg-white/30 backdrop-blur-md rounded-lg">
          <div className="text-xs font-medium uppercase tracking-wider text-blue-100/70">Total chambres</div>
          <div className="mt-1 flex items-baseline">
            <div className="text-2xl font-semibold text-white">{stats.total}</div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between p-4 bg-white/30 backdrop-blur-md rounded-lg">
          <div className="text-xs font-medium uppercase tracking-wider text-blue-100/70">Chambres occupées</div>
          <div className="mt-1 flex items-baseline">
            <div className="text-2xl font-semibold text-white">{stats.occupees}</div>
            <div className="ml-2 text-sm text-blue-100/70">({stats.occupees > 0 ? Math.round((stats.occupees / stats.total) * 100) : 0}%)</div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between p-4 bg-white/30 backdrop-blur-md rounded-lg">
          <div className="text-xs font-medium uppercase tracking-wider text-blue-100/70">Chambres libres</div>
          <div className="mt-1 flex items-baseline">
            <div className="text-2xl font-semibold text-white">{stats.libres}</div>
            <div className="ml-2 text-sm text-blue-100/70">({stats.libres > 0 ? Math.round((stats.libres / stats.total) * 100) : 0}%)</div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between p-4 bg-white/30 backdrop-blur-md rounded-lg">
          <div className="text-xs font-medium uppercase tracking-wider text-blue-100/70">Taux d'occupation</div>
          <div className="mt-1 flex items-center">
            <div className="text-2xl font-semibold text-white">{stats.tauxOccupation}%</div>
            <div className="flex-1 ml-4 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${stats.tauxOccupation}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChambreStats;