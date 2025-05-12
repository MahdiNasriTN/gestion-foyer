import React from 'react';

const StatusSelector = ({ status, onSelect }) => {
  // Status options
  const statusOptions = ['en attente', 'en cours', 'terminé', 'annulé'];
  
  // Status-specific styling
  const statusColors = {
    'en attente': 'bg-amber-50 text-amber-700 border-amber-200',
    'en cours': 'bg-blue-50 text-blue-700 border-blue-200',
    'terminé': 'bg-green-50 text-green-700 border-green-200',
    'annulé': 'bg-red-50 text-red-700 border-red-200'
  };
  
  // Status icons
  const getStatusIcon = (status) => {
    switch (status) {
      case 'en attente':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'en cours':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'terminé':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'annulé':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Statut
      </label>
      <div className="grid grid-cols-4 gap-2">
        {statusOptions.map(statusOption => (
          <button
            key={statusOption}
            type="button"
            onClick={() => onSelect(statusOption)}
            className={`py-2.5 px-2 rounded-lg flex flex-col items-center justify-center border ${
              status === statusOption 
                ? `${statusColors[statusOption]} ring-2 ring-offset-2 focus:outline-none` 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              {getStatusIcon(statusOption)}
            </div>
            <span className="text-xs font-medium mt-1 truncate">
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusSelector;