import React, { useState } from 'react';
import { 
  PencilAltIcon, 
  TrashIcon, 
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FilterIcon,
  CheckCircleIcon,
  ExclamationIcon,
  MailIcon,
  PhoneIcon,
  ClockIcon,
  OfficeBuildingIcon,
  BriefcaseIcon,
  CalendarIcon
} from '@heroicons/react/outline';

const StagiairesList = ({ 
  stagiaires, 
  currentPage, 
  totalPages, 
  sortBy, 
  sortOrder,
  onView,
  onEdit,
  onDelete,
  onSort,
  onChangePage,
  selectedFilter,
  onChangeFilter,
  viewMode = 'list'
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilterTab, setActiveFilterTab] = useState('status');
  const [filters, setFilters] = useState({
    status: 'all',
    room: 'all',
    gender: 'all',
    session: 'all',
    startDate: '',
    endDate: '',
    specificRoom: ''
  });
  const [showDateFilters, setShowDateFilters] = useState(false);

  const availableRooms = ['101', '102', '103', '104', '105']; // Example room numbers

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      room: 'all',
      gender: 'all',
      session: 'all',
      startDate: '',
      endDate: '',
      specificRoom: ''
    });
    // Immediately apply the reset filters
    onChangeFilter({
      status: 'all',
      room: 'all',
      gender: 'all',
      session: 'all',
      startDate: '',
      endDate: '',
      specificRoom: ''
    });
  };

  const applyFilters = () => {
    // Send all filters to parent component for backend filtering
    onChangeFilter(filters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(filters).forEach((value) => {
      if (value && value !== 'all') count++;
    });
    return count;
  };

  const getFilterCount = (filterType) => {
    // Example logic to get the count of items matching the filter
    return stagiaires.filter((stagiaire) => {
      if (filterType === 'active') return isStagiaireActif(stagiaire);
      if (filterType === 'inactive') return !isStagiaireActif(stagiaire);
      if (filterType === 'withRoom') return stagiaire.chambre;
      if (filterType === 'withoutRoom') return !stagiaire.chambre;
      return false;
    }).length;
  };

  // Indicateur de tri
  const SortIndicator = ({ field }) => {
    if (sortBy !== field) return null;
    
    return (
      <span className="ml-1 inline-flex items-center">
        {sortOrder === 'asc' ? (
          <ChevronUpIcon className="h-4 w-4 text-cyan-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-cyan-500" />
        )}
      </span>
    );
  };
  
  // Style pour les cellules d'en-tête de colonne
  const getHeaderCellClass = (field) => `
    py-4 px-6 text-left text-xs font-medium uppercase tracking-wider cursor-pointer
    transition-colors duration-200 select-none
    ${sortBy === field ? 'text-cyan-600' : 'text-gray-500'}
    hover:text-cyan-600
  `;

  // Style pour les lignes
  const getRowClass = (id) => `
    transition-all duration-300 group
    ${hoveredRow === id ? 'bg-blue-50' : 'hover:bg-blue-50/70'}
    ${id % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
  `;

  // Style pour les boutons d'action
  const getActionButtonClass = (color) => `
    p-1.5 rounded-lg transition-all duration-200
    ${color === 'blue' ? 'text-blue-600 hover:bg-blue-100' : ''}
    ${color === 'green' ? 'text-emerald-600 hover:bg-emerald-100' : ''}
    ${color === 'red' ? 'text-rose-600 hover:bg-rose-100' : ''}
    group-hover:scale-105
  `;

  // Calcule si un stagiaire est actif (période actuelle)
  const isStagiaireActif = (stagiaire) => {
    const now = new Date();
    const arrivee = new Date(stagiaire.dateArrivee);
    const depart = new Date(stagiaire.dateDepart);
    return now >= arrivee && now <= depart;
  };

  // Rendu de la vue en grille
  const renderStagiaireCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
        {stagiaires.map((stagiaire) => (
          <div 
            key={stagiaire.id}
            className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-300
              ${hoveredCard === stagiaire.id ? 'shadow-md transform scale-[1.02] border-cyan-200' : 'hover:shadow-md hover:border-blue-200'}
            `}
            onMouseEnter={() => setHoveredCard(stagiaire.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="p-1">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-200 border-2 border-white flex items-center justify-center shadow-sm mb-3">
                  {stagiaire.avatar ? (
                    <img src={stagiaire.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-medium text-cyan-600">{stagiaire.nom.charAt(0)}</span>
                  )}
                </div>
                <h3 className="text-base font-medium text-gray-800">{stagiaire.nom}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{stagiaire.email}</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                    ${stagiaire.type === 'externe' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {stagiaire.type === 'externe' ? 'Externe' : 'Interne'}
                  </span>
                </div>
                <div className="mt-2">
                  {isStagiaireActif(stagiaire) ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                      Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
                      Inactif
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <div className="text-sm text-gray-700 flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>Entreprise</span>
                </div>
                <span className="font-medium text-gray-700 text-sm">{stagiaire.entreprise}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <div className="text-sm text-gray-700 flex items-center">
                  <OfficeBuildingIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>Chambre</span>
                </div>
                {stagiaire.chambre ? (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-medium">
                    {stagiaire.chambre}
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-medium">
                    Non assignée
                  </span>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                <div>
                  <div>Du {new Date(stagiaire.dateArrivee).toLocaleDateString('fr-FR')}</div>
                  <div>Au {new Date(stagiaire.dateDepart).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-100">
              <button 
                onClick={() => onView(stagiaire.id)}
                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <UserIcon className="h-3.5 w-3.5 mr-1" />
                Profil
              </button>

              <div className="flex gap-1">
                <button 
                  onClick={() => onEdit(stagiaire)} 
                  className={getActionButtonClass('green')}
                  title="Modifier"
                >
                  <PencilAltIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => onDelete(stagiaire.id)} 
                  className={getActionButtonClass('red')}
                  title="Supprimer"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Rendu de la vue en liste
  const renderStagiairesTable = () => {
    return (
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th 
                className={getHeaderCellClass('nom')}
                onClick={() => onSort('nom')}
              >
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>Nom</span>
                  <SortIndicator field="nom" />
                </div>
              </th>
              <th 
                className={getHeaderCellClass('entreprise')}
                onClick={() => onSort('entreprise')}
              >
                <div className="flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>Entreprise</span>
                  <SortIndicator field="entreprise" />
                </div>
              </th>
              <th 
                className={getHeaderCellClass('chambre')}
                onClick={() => onSort('chambre')}
              >
                <div className="flex items-center">
                  <OfficeBuildingIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>Chambre</span>
                  <SortIndicator field="chambre" />
                </div>
              </th>
              <th 
                className={getHeaderCellClass('dateArrivee')}
                onClick={() => onSort('dateArrivee')}
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>Période</span>
                  <SortIndicator field="dateArrivee" />
                </div>
              </th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {stagiaires.map((stagiaire) => (
              <tr 
                key={stagiaire.id} 
                className={getRowClass(stagiaire.id)}
                onMouseEnter={() => setHoveredRow(stagiaire.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="py-3 px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-50 to-cyan-100 border border-gray-200 flex items-center justify-center mr-3 shadow-sm">
                      {stagiaire.avatar ? (
                        <img src={stagiaire.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-cyan-600">{stagiaire.nom.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 group-hover:text-cyan-600 transition-colors">
                        {stagiaire.nom}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{stagiaire.email}</span>
                        {/* Badge de type de stagiaire */}
                        <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium 
                          ${stagiaire.type === 'externe' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {stagiaire.type === 'externe' ? 'Externe' : 'Interne'}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="py-3 px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-700">{stagiaire.entreprise}</span>
                  </div>
                </td>
                
                <td className="py-3 px-6 whitespace-nowrap">
                  {stagiaire.chambre ? (
                    <div className="flex items-center">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-medium inline-flex items-center">
                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                        Chambre {stagiaire.chambre}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-medium inline-flex items-center">
                        <ExclamationIcon className="h-3.5 w-3.5 mr-1" />
                        Non assignée
                      </span>
                    </div>
                  )}
                </td>
                
                <td className="py-3 px-6 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-gray-700 flex items-center">
                      <span className="font-medium text-xs mr-2">Du</span>
                      {new Date(stagiaire.dateArrivee).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-gray-700 flex items-center mt-1">
                      <span className="font-medium text-xs mr-2">Au</span>
                      {new Date(stagiaire.dateDepart).toLocaleDateString('fr-FR')}
                    </div>
                    {isStagiaireActif(stagiaire) ? (
                      <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></div>
                        Inactif
                      </span>
                    )}
                  </div>
                </td>
                
                <td className="py-3 px-6 text-right space-x-1">
                  <div className="flex items-center justify-end space-x-1">
                    <button 
                      onClick={() => onView(stagiaire.id)} 
                      className={getActionButtonClass('blue')}
                      title="Voir profil"
                    >
                      <UserIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(stagiaire)} 
                      className={getActionButtonClass('green')}
                      title="Modifier"
                    >
                      <PencilAltIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(stagiaire.id)} 
                      className={getActionButtonClass('red')}
                      title="Supprimer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-xl border border-gray-200">
      {/* En-tête avec titre de section */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-100 text-cyan-600">
            <BriefcaseIcon className="h-4 w-4" />
          </span>
          Liste des stagiaires
        </h3>
        
        {/* Filtre et info de tri */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500 hidden sm:block">
            <span className="text-gray-700 font-medium">{stagiaires.length}</span> résultats
            {sortBy && <span> • Trié par <span className="text-cyan-600 font-medium">{sortBy}</span></span>}
          </div>
          
          <div className="relative group">
            <div className="flex items-center gap-1.5 bg-white py-2 px-3.5 rounded-lg text-sm text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
              <FilterIcon className="h-4 w-4 text-cyan-500" />
              <span>{getActiveFilterCount() > 0 ? `Filtres (${getActiveFilterCount()})` : 'Filtrer'}</span>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </div>
            
            {/* Enhanced dropdown with tabs */}
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden transform origin-top-right opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-200 z-20">
              <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setActiveFilterTab('status')}
                  className={`flex-1 py-2.5 px-3 text-sm font-medium ${activeFilterTab === 'status' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Statut
                </button>
                <button 
                  onClick={() => setActiveFilterTab('profile')}
                  className={`flex-1 py-2.5 px-3 text-sm font-medium ${activeFilterTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Profil
                </button>
                <button 
                  onClick={() => setActiveFilterTab('dates')}
                  className={`flex-1 py-2.5 px-3 text-sm font-medium ${activeFilterTab === 'dates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Dates
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {/* Status filters */}
                {activeFilterTab === 'status' && (
                  <>
                    <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase">Par activité</div>
                    
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${filters.status === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => handleFilterChange('status', 'all')}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        {filters.status === 'all' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                      </span>
                      <span>Tous</span>
                    </button>
                    
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${filters.status === 'active' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => handleFilterChange('status', 'active')}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        {filters.status === 'active' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                      </span>
                      <span>Actifs</span>
                      <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        {getFilterCount('active')}
                      </span>
                    </button>
                    
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${filters.status === 'inactive' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => handleFilterChange('status', 'inactive')}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        {filters.status === 'inactive' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                      </span>
                      <span>Inactifs</span>
                      <span className="ml-auto bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                        {getFilterCount('inactive')}
                      </span>
                    </button>

                    <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase mt-3">Par chambre</div>
                    
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${filters.room === 'withRoom' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => handleFilterChange('room', 'withRoom')}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        {filters.room === 'withRoom' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                      </span>
                      <span>Avec chambre</span>
                      <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full">
                        {getFilterCount('withRoom')}
                      </span>
                    </button>
                    
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${filters.room === 'withoutRoom' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => handleFilterChange('room', 'withoutRoom')}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        {filters.room === 'withoutRoom' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                      </span>
                      <span>Sans chambre</span>
                      <span className="ml-auto bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                        {getFilterCount('withoutRoom')}
                      </span>
                    </button>
                    
                    {/* Room number selection */}
                    {filters.room === 'withRoom' && (
                      <div className="px-3 py-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Numéro de chambre
                        </label>
                        <select
                          value={filters.specificRoom || ''}
                          onChange={(e) => handleFilterChange('specificRoom', e.target.value)}
                          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Toutes les chambres</option>
                          {availableRooms.map(room => (
                            <option key={room} value={room}>Chambre {room}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {/* Profile filters */}
                {activeFilterTab === 'profile' && (
                  <>
                    <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase">Par sexe</div>
                    
                    <div className="flex space-x-2 px-3 py-2">
                      <button
                        className={`flex-1 py-2 px-3 rounded-lg border ${filters.gender === 'all' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleFilterChange('gender', 'all')}
                      >
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Tous</span>
                        </div>
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 rounded-lg border ${filters.gender === 'homme' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleFilterChange('gender', 'homme')}
                      >
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Homme</span>
                        </div>
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 rounded-lg border ${filters.gender === 'femme' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleFilterChange('gender', 'femme')}
                      >
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Femme</span>
                        </div>
                      </button>
                    </div>

                    <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase mt-3">Par session</div>
                    
                    <div className="grid grid-cols-3 gap-2 px-3 py-2">
                      <button
                        className={`py-2 px-3 rounded-lg border text-center ${filters.session === 'septembre' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleFilterChange('session', 'septembre')}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-medium">Sep</span>
                          <span className="text-xs mt-1">2023</span>
                        </div>
                      </button>
                      <button
                        className={`py-2 px-3 rounded-lg border text-center ${filters.session === 'novembre' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleFilterChange('session', 'novembre')}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-medium">Nov</span>
                          <span className="text-xs mt-1">2023</span>
                        </div>
                      </button>
                      <button
                        className={`py-2 px-3 rounded-lg border text-center ${filters.session === 'fevrier' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleFilterChange('session', 'fevrier')}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-medium">Fév</span>
                          <span className="text-xs mt-1">2024</span>
                        </div>
                      </button>
                    </div>
                  </>
                )}

                {/* Date filters */}
                {activeFilterTab === 'dates' && (
                  <>
                    <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase">Formation - Date de début</div>
                    <div className="px-3 py-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">De</label>
                          <input 
                            type="date"
                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm"
                            value={filters.startDate || ''}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">À</label>
                          <input 
                            type="date"
                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm"
                            value={filters.endDate || ''}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase mt-2">Formation - Date de fin</div>
                    <div className="px-3 py-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">De</label>
                          <input 
                            type="date"
                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm"
                            value={filters.endDate || ''}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">À</label>
                          <input 
                            type="date"
                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm"
                            value={filters.endDate || ''}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Footer with action buttons */}
              <div className="bg-gray-50 px-3 py-3 border-t border-gray-200 flex justify-between items-center">
                <button 
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser
                </button>
                <button 
                  onClick={applyFilters}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar - Displayed at the top of the list */}
      <div className="p-4 bg-white border-b border-gray-200 flex flex-wrap gap-3">
        {/* Status Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="text-xs font-medium text-gray-500 uppercase flex items-center mr-2">
            <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
            Statut:
          </div>
          <div className="flex gap-1.5">
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.status === 'all' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('status', 'all')}
            >
              Tous
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center ${
                filters.status === 'active' 
                  ? 'bg-green-100 text-green-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('status', 'active')}
            >
              <div className={filters.status === 'active' ? "w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" : ""}></div>
              Actifs <span className="ml-1 opacity-60">({getFilterCount('active')})</span>
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center ${
                filters.status === 'inactive' 
                  ? 'bg-gray-200 text-gray-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('status', 'inactive')}
            >
              <div className={filters.status === 'inactive' ? "w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5" : ""}></div>
              Inactifs <span className="ml-1 opacity-60">({getFilterCount('inactive')})</span>
            </button>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

        {/* Room Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="text-xs font-medium text-gray-500 uppercase flex items-center mr-2">
            <OfficeBuildingIcon className="h-3.5 w-3.5 mr-1" />
            Chambre:
          </div>
          <div className="flex gap-1.5 items-center flex-wrap">
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.room === 'all' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('room', 'all')}
            >
              Toutes
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.room === 'withRoom' 
                  ? 'bg-emerald-100 text-emerald-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('room', 'withRoom')}
            >
              Avec chambre <span className="ml-1 opacity-60">({getFilterCount('withRoom')})</span>
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.room === 'withoutRoom' 
                  ? 'bg-amber-100 text-amber-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('room', 'withoutRoom')}
            >
              Sans chambre <span className="ml-1 opacity-60">({getFilterCount('withoutRoom')})</span>
            </button>
            
            {/* Room input field */}
            <div className="flex items-center ml-2">
              <span className="text-xs text-gray-500 mr-1">N°:</span>
              <input
                type="text"
                placeholder="Ex: 101"
                value={filters.specificRoom}
                onChange={(e) => handleFilterChange('specificRoom', e.target.value)}
                className="w-16 h-7 text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

        {/* Gender Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="text-xs font-medium text-gray-500 uppercase flex items-center mr-2">
            <UserIcon className="h-3.5 w-3.5 mr-1" />
            Sexe:
          </div>
          <div className="flex gap-1.5">
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.gender === 'all' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('gender', 'all')}
            >
              Tous
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.gender === 'homme' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('gender', 'homme')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Homme
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.gender === 'femme' 
                  ? 'bg-pink-100 text-pink-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('gender', 'femme')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Femme
            </button>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

        {/* Session Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="text-xs font-medium text-gray-500 uppercase flex items-center mr-2">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            Session:
          </div>
          <div className="flex gap-1.5">
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.session === 'all' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('session', 'all')}
            >
              Toutes
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.session === 'septembre' 
                  ? 'bg-amber-100 text-amber-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('session', 'septembre')}
            >
              Sep 2023
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.session === 'novembre' 
                  ? 'bg-amber-100 text-amber-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('session', 'novembre')}
            >
              Nov 2023
            </button>
            <button
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                filters.session === 'fevrier' 
                  ? 'bg-amber-100 text-amber-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('session', 'fevrier')}
            >
              Fév 2024
            </button>
          </div>
        </div>

        {/* Date Selector Toggle */}
        <div className="ml-auto flex items-center">
          <button
            onClick={() => setShowDateFilters(!showDateFilters)}
            className="flex items-center text-xs text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
            Dates
            <ChevronDownIcon className={`h-3 w-3 ml-1 transition-transform ${showDateFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {getActiveFilterCount() > 0 && (
            <button 
              onClick={resetFilters}
              className="ml-2 flex items-center text-xs text-gray-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser ({getActiveFilterCount()})
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Button - Above the table but below filters */}
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex justify-end">
        <button 
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 shadow-sm flex items-center"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          Filtrer les résultats
        </button>
      </div>

      {/* Date Filters - Only shown when date filter button is clicked */}
      {showDateFilters && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="absolute -top-3 left-4 px-2 bg-white text-xs font-semibold text-blue-700 rounded-full border border-blue-200 shadow-sm flex items-center">
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                Date de début
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 hover:border-blue-300 transition-all p-4 pt-5">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Sélectionner</div>
                    <div className="text-sm font-medium text-gray-800">
                      {filters.startDate 
                        ? new Date(filters.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) 
                        : 'Pas de date sélectionnée'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="date"
                    className="block w-full pl-10 pr-3 py-2 text-xs border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-gray-50 hover:bg-white transition-colors"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                {!filters.startDate && (
                  <div className="mt-3 flex">
                    <button
                      onClick={() => handleFilterChange('startDate', new Date().toISOString().split('T')[0])}
                      className="flex-1 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-l-md border border-gray-200 transition-colors"
                    >
                      Aujourd'hui
                    </button>
                    <button
                      onClick={() => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        handleFilterChange('startDate', yesterday.toISOString().split('T')[0]);
                      }}
                      className="flex-1 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-r-md border-t border-r border-b border-gray-200 transition-colors"
                    >
                      Hier
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -top-3 left-4 px-2 bg-white text-xs font-semibold text-emerald-700 rounded-full border border-emerald-200 shadow-sm flex items-center">
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                Date de fin
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-emerald-100 hover:border-emerald-300 transition-all p-4 pt-5">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Sélectionner</div>
                    <div className="text-sm font-medium text-gray-800">
                      {filters.endDate 
                        ? new Date(filters.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) 
                        : 'Pas de date sélectionnée'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="date"
                    className="block w-full pl-10 pr-3 py-2 text-xs border-gray-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-gray-50 hover:bg-white transition-colors"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
                {!filters.endDate && (
                  <div className="mt-3 flex">
                    <button
                      onClick={() => {
                        const inOneMonth = new Date();
                        inOneMonth.setMonth(inOneMonth.getMonth() + 1);
                        handleFilterChange('endDate', inOneMonth.toISOString().split('T')[0]);
                      }}
                      className="flex-1 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-l-md border border-gray-200 transition-colors"
                    >
                      +1 mois
                    </button>
                    <button
                      onClick={() => {
                        const inThreeMonths = new Date();
                        inThreeMonths.setMonth(inThreeMonths.getMonth() + 3);
                        handleFilterChange('endDate', inThreeMonths.toISOString().split('T')[0]);
                      }}
                      className="flex-1 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-r-md border-t border-r border-b border-gray-200 transition-colors"
                    >
                      +3 mois
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Date range description */}
          {filters.startDate && filters.endDate && (
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Période sélectionnée: 
                <span className="font-medium ml-1">
                  {new Date(filters.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
                <span className="mx-1">au</span>
                <span className="font-medium">
                  {new Date(filters.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {(() => {
                  const start = new Date(filters.startDate);
                  const end = new Date(filters.endDate);
                  const diffTime = Math.abs(end - start);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return <span className="ml-1 text-xs text-gray-500">({diffDays} jours)</span>;
                })()}
              </div>
              <div>
                <button 
                  onClick={() => {
                    handleFilterChange('startDate', '');
                    handleFilterChange('endDate', '');
                  }}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Effacer les dates
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-5 flex justify-end">
            <button 
              onClick={applyFilters}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
      
      {/* Affichage dynamique en fonction du mode sélectionné */}
      {viewMode === 'list' ? renderStagiairesTable() : renderStagiaireCards()}
      
      {/* S'affiche si aucun stagiaire */}
      {stagiaires.length === 0 && (
        <div className="py-10 flex flex-col items-center justify-center text-gray-500">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <BriefcaseIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600">Aucun stagiaire trouvé</h3>
          <p className="text-sm mt-1">Modifiez vos critères de recherche ou ajoutez un nouveau stagiaire</p>
        </div>
      )}

      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-500 order-2 sm:order-1">
          Affichage de <span className="font-medium text-gray-700">{stagiaires.length}</span> stagiaires sur <span className="font-medium text-gray-700">{totalPages * stagiaires.length}</span>
        </div>
        
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button 
            onClick={() => onChangePage(1)} 
            disabled={currentPage === 1}
            className={`p-2 rounded-md border ${currentPage === 1 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            title="Première page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => onChangePage(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`p-2 rounded-md border ${currentPage === 1 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            title="Page précédente"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calcul pour afficher les pages autour de la page courante
              let pageNum = currentPage;
              if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button 
                    key={pageNum} 
                    onClick={() => onChangePage(pageNum)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-colors
                      ${pageNum === currentPage 
                        ? 'bg-cyan-500 text-white border border-cyan-500' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
          </div>
          
          <button 
            onClick={() => onChangePage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md border ${currentPage === totalPages 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            title="Page suivante"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => onChangePage(totalPages)} 
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md border ${currentPage === totalPages 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            title="Dernière page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StagiairesList;