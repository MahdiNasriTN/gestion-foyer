import React from 'react';
import { PencilAltIcon, TrashIcon, UserAddIcon } from '@heroicons/react/outline';

const ChambreCard = ({ chambre, onEdit, onDelete, onAssign, residents }) => {
  const getOccupantNames = () => {
    if (!chambre.occupants || chambre.occupants.length === 0) {
      return [];
    }
    
    return chambre.occupants.map(id => {
      const resident = residents.find(r => r.id === id);
      return resident || { id, nom: 'Inconnu' };
    });
  };
  
  const occupants = getOccupantNames();
  const remainingSpots = chambre.capacite - (chambre.occupants?.length || 0);

  // Cette fonction convertit en string de façon sécurisée n'importe quel type d'ID
  const formatId = (id) => {
    if (id === undefined || id === null) return "N/A";
    const strId = String(id); // Convertit en string de façon sûre
    return strId.length > 8 ? `${strId.substring(0, 8)}...` : strId;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group border border-gray-100">
      {/* En-tête avec statut et actions */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${chambre.statut === 'occupée' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className={`text-xs font-medium ${chambre.statut === 'occupée' ? 'text-green-700' : 'text-yellow-700'}`}>
            {chambre.statut.charAt(0).toUpperCase() + chambre.statut.slice(1)}
          </span>
        </div>
        <div className="hidden group-hover:flex space-x-2 transition-all duration-200">
          <button
            onClick={onAssign}
            className="p-1 rounded hover:bg-gray-100 text-blue-600"
            title="Assigner des résidents"
          >
            <UserAddIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-gray-100 text-indigo-600"
            title="Modifier"
          >
            <PencilAltIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
                onDelete();
              }
            }}
            className="p-1 rounded hover:bg-gray-100 text-red-600"
            title="Supprimer"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Corps de la carte */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Chambre {chambre.numero}</h3>
            <p className="text-sm text-gray-500">Étage {chambre.etage || '1'}</p>
          </div>
          <div className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
            {chambre.capacite} {chambre.capacite > 1 ? 'lits' : 'lit'}
          </div>
        </div>
        
        {/* Type et équipements */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {chambre.type && (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                {chambre.type.charAt(0).toUpperCase() + chambre.type.slice(1)}
              </span>
            )}
            {chambre.equipements && chambre.equipements.map(equip => (
              <span key={equip} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                {equip}
              </span>
            ))}
          </div>
        </div>
        
        {/* Occupants */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Occupants</h4>
            <span className="text-xs text-gray-500">{occupants.length}/{chambre.capacite}</span>
          </div>
          
          {occupants.length > 0 ? (
            <div className="space-y-2">
              {occupants.map((occupant) => (
                <div key={occupant.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {occupant.nom.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">{occupant.nom}</p>
                    <p className="text-xs text-gray-500">{occupant.type || 'Résident'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm text-gray-400 text-center">Aucun occupant</p>
              <button 
                onClick={onAssign} 
                className="mt-2 text-xs text-primary hover:text-primary-dark font-medium flex items-center"
              >
                <UserAddIcon className="h-3 w-3 mr-1" />
                Assigner
              </button>
            </div>
          )}
          
          {/* Places restantes */}
          {remainingSpots > 0 && occupants.length > 0 && (
            <div 
              onClick={onAssign}
              className="mt-2 p-2 border border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-primary/30 group/add"
            >
              <UserAddIcon className="h-4 w-4 text-gray-400 group-hover/add:text-primary mr-2" />
              <span className="text-sm text-gray-500 group-hover/add:text-primary">
                {remainingSpots} {remainingSpots > 1 ? 'places disponibles' : 'place disponible'}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Pied de carte */}
      <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500">
        ID: {formatId(chambre.id)}
      </div>
    </div>
  );
};

export default ChambreCard;