import React, { useState } from 'react';
import { mockTachesCuisine, mockEtudiants, mockStagiaires } from '../utils/mockData';
import { PlusIcon, PencilAltIcon, TrashIcon, CalendarIcon } from '@heroicons/react/outline';

const Cuisine = () => {
  const [taches, setTaches] = useState(mockTachesCuisine);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTache, setCurrentTache] = useState(null);
  const [currentView, setCurrentView] = useState('liste'); // 'liste' ou 'planning'

  const creneaux = ['Matin', 'Soir'];
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const handleOpenModal = (tache = null) => {
    setCurrentTache(tache || { 
      date: new Date().toISOString().split('T')[0], 
      creneau: 'Matin', 
      responsable: '', 
      tache: 'Préparation petit-déjeuner' 
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      setTaches(taches.filter(tache => tache.id !== id));
    }
  };

  const getResponsableName = (id) => {
    const etudiant = mockEtudiants.find(e => e.id === id);
    const stagiaire = mockStagiaires.find(s => s.id === id);
    return etudiant ? etudiant.nom : (stagiaire ? stagiaire.nom : 'Non assigné');
  };

  const getPersonnes = () => {
    return [...mockEtudiants, ...mockStagiaires].map(p => ({
      id: p.id,
      nom: p.nom
    }));
  };

  // Organiser les tâches par jour de la semaine pour le planning
  const getTachesByJour = () => {
    const currentDate = new Date();
    const tachesByDay = {};
    
    // Initialiser la structure avec les 7 prochains jours
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      tachesByDay[dateStr] = { date: dateStr, jour: jours[date.getDay()], taches: [] };
    }
    
    // Remplir avec les tâches existantes
    taches.forEach(tache => {
      if (tachesByDay[tache.date]) {
        tachesByDay[tache.date].taches.push(tache);
      }
    });
    
    return Object.values(tachesByDay);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion de la Cuisine</h1>
        <div className="space-x-3">
          <button 
            onClick={() => setCurrentView('planning')}
            className={`btn ${currentView === 'planning' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <CalendarIcon className="h-5 w-5 mr-1 inline" />
            Planning
          </button>
          <button 
            onClick={() => setCurrentView('liste')}
            className={`btn ${currentView === 'liste' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Liste
          </button>
          <button 
            onClick={() => handleOpenModal()} 
            className="btn btn-primary flex items-center inline-flex"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Ajouter une Tâche
          </button>
        </div>
      </div>

      {currentView === 'liste' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créneau
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tâche
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {taches.map((tache) => (
                <tr key={tache.id}>
                  <td className="py-3 px-4 text-sm">{new Date(tache.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm">{tache.creneau}</td>
                  <td className="py-3 px-4 text-sm">{getResponsableName(tache.responsable)}</td>
                  <td className="py-3 px-4 text-sm">{tache.tache}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenModal(tache)} 
                      className="text-green-600 hover:text-green-800"
                      title="Modifier"
                    >
                      <PencilAltIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(tache.id)} 
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {getTachesByJour().map((jourData) => (
            <div key={jourData.date} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-center font-semibold mb-2">{jourData.jour}</h3>
              <p className="text-center text-sm text-gray-500 mb-3">
                {new Date(jourData.date).toLocaleDateString('fr-FR')}
              </p>
              <div className="space-y-2">
                {jourData.taches.length > 0 ? (
                  jourData.taches.map((tache) => (
                    <div key={tache.id} className="border border-gray-200 rounded p-2 text-sm">
                      <p className="font-semibold">{tache.creneau}</p>
                      <p>{tache.tache}</p>
                      <p className="text-gray-600">{getResponsableName(tache.responsable)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500 py-2">Aucune tâche</p>
                )}
                <button 
                  onClick={() => handleOpenModal({ date: jourData.date, creneau: 'Matin', responsable: '', tache: '' })} 
                  className="w-full text-center text-primary text-sm py-1 hover:bg-gray-100 rounded"
                >
                  + Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal would be implemented here */}
    </div>
  );
};

export default Cuisine;