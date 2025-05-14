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
            <div className="flex items-center gap-1.5 bg-white py-1.5 px-3 rounded-lg text-xs text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all shadow-sm">
              <FilterIcon className="h-3.5 w-3.5 text-cyan-500" />
              <span>Filtrer</span>
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-50" />
            </div>
            
            {/* Menu déroulant de filtre avec animation */}
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transform origin-top-right opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2">
                <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase">Par statut</div>
                
                <button 
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${selectedFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => onChangeFilter('all')}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    {selectedFilter === 'all' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                  </span>
                  <span>Tous</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${selectedFilter === 'active' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => onChangeFilter('active')}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    {selectedFilter === 'active' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                  </span>
                  <span>Actifs</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${selectedFilter === 'inactive' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => onChangeFilter('inactive')}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    {selectedFilter === 'inactive' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                  </span>
                  <span>Inactifs</span>
                </button>

                <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase mt-2">Par chambre</div>
                
                <button 
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${selectedFilter === 'withRoom' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => onChangeFilter('withRoom')}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    {selectedFilter === 'withRoom' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                  </span>
                  <span>Avec chambre</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${selectedFilter === 'withoutRoom' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => onChangeFilter('withoutRoom')}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    {selectedFilter === 'withoutRoom' && <CheckCircleIcon className="h-4 w-4 text-cyan-500" />}
                  </span>
                  <span>Sans chambre</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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