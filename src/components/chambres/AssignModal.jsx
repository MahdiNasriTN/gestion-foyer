import React, { useState, useEffect } from 'react';
import { XIcon, SearchIcon } from '@heroicons/react/outline';

const AssignModal = ({ isOpen, onClose, chambre, onAssign, residents }) => {
  const [selectedResidents, setSelectedResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResidents, setFilteredResidents] = useState([]);
  
  useEffect(() => {
    if (chambre) {
      setSelectedResidents(chambre.occupants || []);
    }
  }, [chambre]);
  
  useEffect(() => {
    if (!residents) return;
    
    const filtered = residents.filter(resident => 
      resident.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resident.prenom && resident.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredResidents(filtered);
  }, [residents, searchTerm]);
  
  const toggleResident = (id) => {
    if (selectedResidents.includes(id)) {
      setSelectedResidents(selectedResidents.filter(resId => resId !== id));
    } else {
      if (selectedResidents.length < chambre.capacite) {
        setSelectedResidents([...selectedResidents, id]);
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(selectedResidents);
  };
  
  if (!isOpen || !chambre) return null;

  const maxOccupantsReached = selectedResidents.length >= chambre.capacite;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute right-4 top-4 z-10">
            <button
              type="button"
              className="text-gray-400 bg-white rounded-full p-1 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* En-tête */}
          <div className="bg-primary text-white px-6 py-5">
            <h3 className="text-lg leading-6 font-medium">
              Assigner des résidents à la chambre
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Chambre {chambre.numero} - Capacité: {chambre.capacite}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6">
            <div className="relative mb-5">
              <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un résident..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <span>Occupants sélectionnés: {selectedResidents.length}/{chambre.capacite}</span>
              {selectedResidents.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedResidents([])}
                  className="text-primary hover:text-primary-dark"
                >
                  Tout désélectionner
                </button>
              )}
            </div>
            
            <div className="max-h-60 overflow-y-auto mb-6 bg-gray-50 rounded-lg border border-gray-200">
              {filteredResidents.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredResidents.map((resident) => {
                    const isSelected = selectedResidents.includes(resident.id);
                    
                    return (
                      <li key={resident.id}>
                        <button
                          type="button"
                          onClick={() => toggleResident(resident.id)}
                          disabled={maxOccupantsReached && !isSelected}
                          className={`w-full flex items-center py-2 px-3 hover:bg-gray-100 transition-colors ${
                            isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                          } ${maxOccupantsReached && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {/* Avatar */}
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {resident.nom.charAt(0)}
                          </div>
                          
                          {/* Infos résident */}
                          <div className="ml-3 flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">{resident.nom} {resident.prenom}</p>
                            <p className="text-xs text-gray-500">{resident.type || 'Résident'}</p>
                          </div>
                          
                          {/* Case à cocher */}
                          <div className={`h-5 w-5 border rounded ${
                            isSelected 
                              ? 'bg-primary border-primary text-white' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Aucun résident trouvé</p>
                  <p className="text-sm text-gray-400">Essayez une autre recherche</p>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Confirmer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;