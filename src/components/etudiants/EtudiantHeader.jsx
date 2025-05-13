import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  SearchIcon, 
  ChartPieIcon,
  ViewListIcon,
  ViewGridIcon,
  UserGroupIcon
} from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EtudiantHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onToggleStats, 
  isStatsOpen, 
  viewMode, 
  onViewModeChange,
  totalCount = 0,
  onAddNew // Add onAddNew prop
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Effet de scroll pour animer le header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation to the Add Étudiant page
  const handleAddNew = () => {
    onAddNew(); // Call the function passed from the parent
  };

  return (
    <div className={`relative z-10 transition-all duration-300 ${scrolled ? 'sticky top-0' : ''}`}>
      {/* Effet de flou en arrière-plan quand on scrolle */}
      {scrolled && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-lg shadow-xl -z-10 rounded-xl border border-white/5"></div>
      )}
      
      {/* Design ultra-premium avec effets visuels */}
      <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-8'
      }`}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900"></div>
        </div>

        <div className={`container mx-auto transition-all duration-500 px-4 ${scrolled ? 'max-w-7xl' : 'max-w-6xl'}`}>
          {/* Top section with title and count */}
          <div className={`flex justify-between items-center mb-6 transition-all ${scrolled ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 shadow-inner shadow-white/5">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Gestion des Étudiants
                  <span className="text-sm font-normal text-blue-200/80 ml-3">
                    {totalCount} étudiants
                  </span>
                </h1>
                <div className="mt-1 h-1 w-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Search and actions bar */}
          <div className={`flex flex-col lg:flex-row lg:items-center gap-4 transition-all ${scrolled ? '-mt-2' : ''}`}>
            {/* Search input */}
            <div className={`relative flex-grow transition-all duration-300 ease-out`}>
              <div className={`flex items-center bg-white/5 backdrop-blur-sm rounded-lg border overflow-hidden transition-all duration-300 shadow-inner shadow-white/5 ${searchFocused ? 'border-cyan-500/40 ring-1 ring-cyan-500/20' : 'border-white/10'}`}>
                <div className={`p-3 flex items-center justify-center transition-colors ${searchFocused ? 'text-white' : 'text-blue-300'}`}>
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Rechercher un étudiant..." 
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-white placeholder-blue-200/50 border-0 flex-grow focus:ring-0 focus:outline-none py-2.5 px-1"
                />
                {searchTerm && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="pr-4 text-blue-300/70 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Actions container */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
              {/* Add button */}
              <button
                onClick={handleAddNew} // Use the navigation handler
                className="inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium shadow-sm bg-cyan-500 text-white hover:bg-cyan-600 transition-all"
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

export default EtudiantHeader;