import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  SearchIcon, 
  ChartPieIcon,
  ViewListIcon,
  ViewGridIcon,
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  MenuIcon
} from '@heroicons/react/outline';

const EtudiantHeader = ({ 
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
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-lg shadow-xl -z-10 rounded-xl border border-white/5"></div>
      )}
      
      {/* Design ultra-premium avec effets visuels */}
      <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-8'
      }`}>
        {/* Arrière-plan dynamique avec dégradé - harmonisé avec le sidebar et la page Chambres */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900"></div>
          
          {/* Effets visuels subtils */}
          <div className="absolute inset-0 opacity-5 mix-blend-overlay" 
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")" }}>
          </div>
          
          {/* Cercles lumineux */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
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
            {/* Search input with animated focus state */}
            <div className={`relative flex-grow transition-all duration-300 ease-out`}>
              <div className={`
                flex items-center bg-white/5 backdrop-blur-sm rounded-lg border overflow-hidden
                transition-all duration-300 shadow-inner shadow-white/5
                ${searchFocused ? 'border-cyan-500/40 ring-1 ring-cyan-500/20' : 'border-white/10'}
              `}>
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
            
            {/* Actions container - right side */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
              {/* View modes with premium design */}
              <div className="inline-flex overflow-hidden rounded-lg bg-white/5 border border-white/10">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`relative p-2.5 ${
                    viewMode === 'list' 
                      ? 'text-white' 
                      : 'text-blue-200/70 hover:text-blue-100'
                  }`}
                  title="Vue en liste"
                >
                  {viewMode === 'list' && (
                    <span className="absolute inset-0 bg-cyan-500/20 border-y border-cyan-400/30"></span>
                  )}
                  <ViewListIcon className="relative z-10 h-5 w-5" />
                </button>
                
                <span className="w-px bg-white/10"></span>
                
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`relative p-2.5 ${
                    viewMode === 'grid' 
                      ? 'text-white' 
                      : 'text-blue-200/70 hover:text-blue-100'
                  }`}
                  title="Vue en grille"
                >
                  {viewMode === 'grid' && (
                    <span className="absolute inset-0 bg-cyan-500/20 border-y border-cyan-400/30"></span>
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
                    ? 'text-white bg-cyan-500 shadow-lg shadow-cyan-500/20' 
                    : 'bg-white/5 hover:bg-white/10 text-blue-100 border border-white/10'}
                `}
              >
                <ChartPieIcon className={`h-4 w-4 mr-2 ${isStatsOpen ? 'text-white' : 'text-blue-300'}`} aria-hidden="true" />
                {isStatsOpen ? 'Masquer' : 'Statistiques'}
              </button>

              {/* Add button with glowing effect */}
              <button
                onClick={onAddNew}
                className="inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium shadow-sm bg-cyan-500 text-white hover:bg-cyan-600 transition-all"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar for scrolling */}
      {scrolled && (
        <div className="h-0.5 w-full bg-transparent">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-400" 
            style={{ width: `${Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default EtudiantHeader;