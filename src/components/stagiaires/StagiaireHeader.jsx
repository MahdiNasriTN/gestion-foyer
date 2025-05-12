import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  SearchIcon, 
  ChartPieIcon,
  ViewListIcon,
  ViewGridIcon,
  BriefcaseIcon
} from '@heroicons/react/outline';

const StagiaireHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onToggleStats, 
  isStatsOpen, 
  viewMode, 
  onViewModeChange,
  onAddNew,
  totalCount = 0
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Effet de scroll pour animer le header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative z-10 transition-all duration-300 ${scrolled ? 'sticky top-0' : ''}`}>
      {/* Effet de flou en arrière-plan quand on scrolle */}
      {scrolled && (
        <div className="absolute inset-0 bg-white shadow-xl -z-10 rounded-xl border border-gray-200"></div>
      )}
      
      {/* Design premium */}
      <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-6'
      }`}>
        {/* Arrière-plan avec dégradé subtil */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-cyan-50"></div>
        </div>

        <div className={`container mx-auto transition-all duration-500 px-4 ${scrolled ? 'max-w-7xl' : 'max-w-6xl'}`}>
          {/* Top section with title and count */}
          <div className={`flex justify-between items-center mb-6 transition-all ${scrolled ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-cyan-100 p-2.5 rounded-xl border border-cyan-200">
                <BriefcaseIcon className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  Gestion des Stagiaires
                  <span className="text-sm font-normal text-gray-500 ml-3">
                    {totalCount} stagiaires
                  </span>
                </h1>
                <div className="mt-1 h-1 w-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Search and actions bar */}
          <div className={`flex flex-col lg:flex-row lg:items-center gap-4 transition-all ${scrolled ? '-mt-2' : ''}`}>
            {/* Search input with animated focus state */}
            <div className={`relative flex-grow transition-all duration-300 ease-out`}>
              <div className={`
                flex items-center bg-white rounded-lg border overflow-hidden
                transition-all duration-300 shadow-sm
                ${searchFocused ? 'border-cyan-500 ring-1 ring-cyan-500/20' : 'border-gray-200'}
              `}>
                <div className={`p-3 flex items-center justify-center transition-colors ${searchFocused ? 'text-cyan-600' : 'text-gray-400'}`}>
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Rechercher un stagiaire..." 
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-gray-800 placeholder-gray-400 border-0 flex-grow focus:ring-0 focus:outline-none py-2.5 px-1"
                />
                {searchTerm && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Actions container - right side */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
              {/* View modes with premium design */}
              <div className="inline-flex overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`relative p-2.5 ${
                    viewMode === 'list' 
                      ? 'text-cyan-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Vue en liste"
                >
                  {viewMode === 'list' && (
                    <span className="absolute inset-0 bg-cyan-50 border-y border-cyan-200"></span>
                  )}
                  <ViewListIcon className="relative z-10 h-5 w-5" />
                </button>
                
                <span className="w-px bg-gray-200"></span>
                
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`relative p-2.5 ${
                    viewMode === 'grid' 
                      ? 'text-cyan-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Vue en grille"
                >
                  {viewMode === 'grid' && (
                    <span className="absolute inset-0 bg-cyan-50 border-y border-cyan-200"></span>
                  )}
                  <ViewGridIcon className="relative z-10 h-5 w-5" />
                </button>
              </div>
              
              {/* Statistics button with animation */}
              <button
                onClick={onToggleStats}
                className={`
                  inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all
                  ${isStatsOpen 
                    ? 'text-white bg-cyan-600 shadow-md' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'}
                `}
              >
                <ChartPieIcon className={`h-4 w-4 mr-2 ${isStatsOpen ? 'text-white' : 'text-cyan-500'}`} aria-hidden="true" />
                {isStatsOpen ? 'Masquer' : 'Statistiques'}
              </button>

              {/* Add button with glowing effect */}
              <button
                onClick={onAddNew}
                className="inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium shadow-sm bg-cyan-600 text-white hover:bg-cyan-700 transition-all"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StagiaireHeader;