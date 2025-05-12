import React, { useState, useEffect } from 'react';
import { mockChambres, mockEtudiants, mockStagiaires, mockTachesCuisine } from '../utils/mockData';
import { 
  UserIcon, 
  OfficeBuildingIcon, 
  UserGroupIcon, 
  CakeIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarIcon,
  RefreshIcon,
  PlusIcon,
  DotsVerticalIcon
} from '@heroicons/react/outline';

// Composant de carte statistique amélioré
const StatCard = ({ title, value, icon, color, change, changeType, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300
        hover:shadow-xl hover:scale-[1.02] cursor-pointer relative group
      `}
    >
      {/* Barre supérieure colorée */}
      <div className={`h-1 w-full ${color.barColor}`}></div>
      
      <div className="p-6">
        <div className="flex items-center">
          <div className={`rounded-lg p-3 ${color.bgColor}`}>
            {icon}
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              {change && (
                <span className={`
                  text-xs font-medium px-2 py-1 rounded-full flex items-center
                  ${changeType === 'increase' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}
                `}>
                  {changeType === 'increase' ? '↑' : '↓'} {change}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Bouton d'action qui apparaît au survol */}
        <div className="mt-4 flex justify-end">
          <button className="text-xs text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            Voir détails <ChevronRightIcon className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
      
      {/* Effet de lumière au survol */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white via-primary-light/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};

// Composant de carte informative
const InfoCard = ({ title, children, icon, actionLabel, onAction, className }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-primary mr-2">
              {icon}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {actionLabel && (
              <button 
                onClick={onAction}
                className="text-xs bg-primary-light/10 text-primary px-2 py-1 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                {actionLabel}
              </button>
            )}
            <button className="text-gray-400 hover:text-primary">
              <DotsVerticalIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

// Nouveau composant pour afficher les chambres
const ChambresOverview = ({ chambres }) => {
  const chambresLibres = chambres.filter(chambre => chambre.statut === 'libre');
  const chambresOccupees = chambres.filter(chambre => chambre.statut === 'occupée');
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Chambres disponibles</p>
            <p className="text-2xl font-bold text-green-600">{chambresLibres.length}</p>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xs text-gray-500">
            Numéros: {chambresLibres.map(c => c.numero).join(', ')}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Chambres occupées</p>
            <p className="text-2xl font-bold text-blue-600">{chambresOccupees.length}</p>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg">
            <OfficeBuildingIcon className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xs text-gray-500">
            Taux d'occupation: {Math.round((chambresOccupees.length / chambres.length) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour la liste des prochaines tâches
const TasksList = ({ tasks, getResponsableName }) => {
  return (
    <div className="overflow-x-auto -mx-6">
      <div className="inline-block min-w-full align-middle px-6">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tâche
                </th>
                <th scope="col" className="py-3.5 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map(tache => (
                <tr key={tache.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(tache.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tache.creneau}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-light/20 flex items-center justify-center mr-2">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {getResponsableName(tache.responsable)}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-900">{tache.tache}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      À venir
                    </span>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <CakeIcon className="h-10 w-10 text-gray-300 mb-2" />
                      <p>Aucune tâche planifiée pour les prochains jours</p>
                      <button className="mt-3 text-primary text-sm flex items-center">
                        <PlusIcon className="h-4 w-4 mr-1" /> Ajouter une tâche
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Composant pour le graphique d'activité
const ActivityChart = () => {
  // Dans un vrai projet, utilisez une bibliothèque comme Chart.js ou recharts
  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <div className="flex items-end h-32 space-x-2">
        <div className="w-8 bg-gradient-to-t from-primary to-primary-light rounded-t-lg h-10"></div>
        <div className="w-8 bg-gradient-to-t from-primary to-primary-light rounded-t-lg h-20"></div>
        <div className="w-8 bg-gradient-to-t from-primary to-primary-light rounded-t-lg h-16"></div>
        <div className="w-8 bg-gradient-to-t from-primary to-primary-light rounded-t-lg h-24"></div>
        <div className="w-8 bg-gradient-to-t from-primary to-primary-light rounded-t-lg h-28"></div>
        <div className="w-8 bg-gradient-to-t from-primary to-primary-light rounded-t-lg h-14"></div>
        <div className="w-8 bg-gradient-to-t from-primary to-primary-light rounded-t-lg h-20"></div>
      </div>
      <div className="w-full flex justify-around mt-2">
        <span className="text-xs text-gray-500">Lun</span>
        <span className="text-xs text-gray-500">Mar</span>
        <span className="text-xs text-gray-500">Mer</span>
        <span className="text-xs text-gray-500">Jeu</span>
        <span className="text-xs text-gray-500">Ven</span>
        <span className="text-xs text-gray-500">Sam</span>
        <span className="text-xs text-gray-500">Dim</span>
      </div>
    </div>
  );
};

// Composant pour afficher les alertes récentes
const AlertsPanel = () => {
  const alerts = [
    { id: 1, message: "Chambre 203 - Maintenance requise", type: "warning", time: "Il y a 2h" },
    { id: 2, message: "Nouvelle réservation à confirmer", type: "info", time: "Il y a 5h" },
  ];
  
  return (
    <div className="space-y-3">
      {alerts.map(alert => (
        <div 
          key={alert.id} 
          className={`
            rounded-lg p-3 flex items-start
            ${alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}
            ${alert.type === 'info' ? 'bg-blue-50 border-l-4 border-blue-400' : ''}
          `}
        >
          <div className={`
            rounded-full p-1 flex-shrink-0
            ${alert.type === 'warning' ? 'text-yellow-500' : ''}
            ${alert.type === 'info' ? 'text-blue-500' : ''}
          `}>
            <ExclamationCircleIcon className="h-5 w-5" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-800">{alert.message}</p>
            <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <DotsVerticalIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Composant pour afficher un calendrier simplifié
const SimpleCalendar = () => {
  // Dans un vrai projet, utilisez une bibliothèque comme react-calendar
  const currentDate = new Date();
  const dayOfMonth = currentDate.getDate();
  
  // Générer un tableau pour les jours du calendrier
  const daysInMonth = new Array(31).fill(0).map((_, i) => i + 1);
  
  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate)}</h3>
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-xs text-center">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div key={i} className="py-1 text-gray-500 font-medium">{day}</div>
        ))}
        
        {daysInMonth.map(day => (
          <div 
            key={day}
            className={`
              py-1 rounded-full 
              ${day === dayOfMonth ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100 cursor-pointer'}
            `}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-xs">
          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
          <span className="text-gray-700">Réunion d'équipe - 14:00</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-gray-700">Inspection chambres - 10:00</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Données pour le dashboard
  const totalChambres = mockChambres.length;
  const chambresOccupees = mockChambres.filter(chambre => chambre.statut === 'occupée').length;
  const totalEtudiants = mockEtudiants.length;
  const totalStagiaires = mockStagiaires.length;
  
  // Filtrer les tâches pour aujourd'hui et demain
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const prochaineTaches = mockTachesCuisine.filter(
    tache => tache.date === today || tache.date === tomorrow
  );

  // Format de la date et heure
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateString = currentTime.toLocaleDateString('fr-FR', dateOptions);
  const timeString = currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  // Obtenir le nom d'un responsable
  const getResponsableName = (id) => {
    const etudiant = mockEtudiants.find(e => e.id === id);
    const stagiaire = mockStagiaires.find(s => s.id === id);
    return etudiant ? etudiant.nom : (stagiaire ? stagiaire.nom : 'Non assigné');
  };
  
  // Simuler un chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Fonction pour simuler une actualisation
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 min-h-[400px]">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête du dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-lg border-b-2 border-primary">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord</h1>
            <span className="ml-3 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">Admin</span>
          </div>
          <div className="mt-1 flex items-center text-gray-500 text-sm">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{dateString} - {timeString}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshIcon className="h-4 w-4 mr-2" />
            Actualiser
          </button>
          <button className="px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors">
            Télécharger le rapport
          </button>
        </div>
      </div>
      
      {/* Message d'accueil (peut être fermé) */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-primary-light to-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <button 
            className="absolute top-2 right-2 text-white/80 hover:text-white"
            onClick={() => setShowWelcome(false)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl pointer-events-none"></div>
          
          <div className="relative">
            <h2 className="text-xl font-bold mb-2">Bienvenue dans le système de gestion du foyer</h2>
            <p className="text-blue-100 mb-4 max-w-lg">
              Suivez facilement les résidents, gérez les chambres et organisez les tâches quotidiennes. 
              Les dernières informations sont mises à jour en temps réel.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Guide rapide
              </button>
              <button className="px-4 py-2 bg-primary-dark/30 text-white rounded-lg font-medium hover:bg-primary-dark/50 backdrop-blur transition-colors">
                Voir les tutoriels
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Chambres" 
          value={totalChambres} 
          icon={<OfficeBuildingIcon className="h-6 w-6 text-white" />}
          color={{ 
            bgColor: "bg-gradient-to-r from-primary to-primary-dark", 
            barColor: "bg-primary" 
          }}
          change="5%"
          changeType="increase"
        />
        <StatCard 
          title="Taux d'occupation" 
          value={`${Math.round((chambresOccupees / totalChambres) * 100)}%`}
          icon={<OfficeBuildingIcon className="h-6 w-6 text-white" />}
          color={{ 
            bgColor: "bg-gradient-to-r from-green-500 to-green-600", 
            barColor: "bg-green-500" 
          }}
        />
        <StatCard 
          title="Étudiants" 
          value={totalEtudiants} 
          icon={<UserIcon className="h-6 w-6 text-white" />}
          color={{ 
            bgColor: "bg-gradient-to-r from-blue-400 to-blue-500", 
            barColor: "bg-blue-400" 
          }}
          change="2"
          changeType="increase"
        />
        <StatCard 
          title="Stagiaires" 
          value={totalStagiaires} 
          icon={<UserGroupIcon className="h-6 w-6 text-white" />}
          color={{ 
            bgColor: "bg-gradient-to-r from-indigo-500 to-indigo-600", 
            barColor: "bg-indigo-500" 
          }}
          change="1"
          changeType="decrease"
        />
      </div>
      
      {/* Section principale avec grid responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section principale (2/3 sur desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vue d'ensemble des chambres */}
          <InfoCard 
            title="Vue d'ensemble des chambres" 
            icon={<OfficeBuildingIcon className="h-5 w-5" />}
            actionLabel="Gérer"
          >
            <ChambresOverview chambres={mockChambres} />
          </InfoCard>
          
          {/* Tâches en cuisine */}
          <InfoCard 
            title="Prochaines tâches en cuisine" 
            icon={<CakeIcon className="h-5 w-5" />}
            actionLabel="Ajouter"
          >
            <TasksList 
              tasks={prochaineTaches} 
              getResponsableName={getResponsableName} 
            />
          </InfoCard>
          
          {/* Activité récente */}
          <InfoCard 
            title="Activité hebdomadaire" 
            icon={<ChartBarIcon className="h-5 w-5" />}
            actionLabel="Voir rapports"
          >
            <ActivityChart />
          </InfoCard>
        </div>
        
        {/* Sidebar latérale (1/3 sur desktop) */}
        <div className="space-y-6">
          {/* Calendrier */}
          <InfoCard 
            title="Calendrier" 
            icon={<CalendarIcon className="h-5 w-5" />}
            className="h-auto"
          >
            <SimpleCalendar />
          </InfoCard>
          
          {/* Alertes et notifications */}
          <InfoCard 
            title="Alertes récentes" 
            icon={<ExclamationCircleIcon className="h-5 w-5" />}
            actionLabel="Tout voir"
          >
            <AlertsPanel />
          </InfoCard>
        </div>
      </div>
      
      {/* Footer avec informations supplémentaires */}
      <div className="mt-12 border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500">
          <div>
            <p>© 2025 Gestion du Foyer - Version 2.1.0</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <button className="text-primary hover:underline">Centre d'aide</button>
            <span className="mx-2">•</span>
            <button className="text-primary hover:underline">Signaler un problème</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;