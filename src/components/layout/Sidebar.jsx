import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  OfficeBuildingIcon, 
  UserGroupIcon, 
  CakeIcon,
  ChartPieIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  DocumentReportIcon,
  ShieldCheckIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  LogoutIcon,
  MenuAlt2Icon,
  ClipboardListIcon,
  HeartIcon
} from '@heroicons/react/outline';

import { HomeIcon as HomeIconSolid } from '@heroicons/react/solid';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [hoverItem, setHoverItem] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format de l'heure
  const timeString = currentTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Navigation items - mise à jour avec tous les éléments
  const mainNavItems = [
    { 
      name: 'Tableau de Bord', 
      path: '/', 
      icon: <HomeIcon className="h-5 w-5" />,
      activeIcon: <HomeIconSolid className="h-5 w-5" />,
      badge: null,
      description: 'Vue d\'ensemble et statistiques'
    },
    { 
      name: 'Chambres', 
      path: '/chambres', 
      icon: <OfficeBuildingIcon className="h-5 w-5" />,
      badge: { count: 2, color: 'green' },
      description: 'Gestion des chambres et occupations'
    },
    { 
      name: 'Étudiants', 
      path: '/etudiants', 
      icon: <UsersIcon className="h-5 w-5" />,
      badge: { count: 12, color: 'blue' },
      description: 'Gestion des étudiants résidents'
    },
    { 
      name: 'Stagiaires', 
      path: '/stagiaires', 
      icon: <UserGroupIcon className="h-5 w-5" />,
      badge: { count: 5, color: 'blue' },
      description: 'Gestion des stagiaires hébergés'
    },
    { 
      name: 'Cuisine', 
      path: '/cuisine', 
      icon: <CakeIcon className="h-5 w-5" />,
      badge: null,
      description: 'Gestion de la restauration et menus',
      submenu: [
        {
          name: 'Menus Hebdo',
          path: '/cuisine/menus',
          icon: <DocumentReportIcon className="h-5 w-5" />,
          description: 'Planning des menus de la semaine'
        },
        {
          name: 'Inventaire',
          path: '/cuisine/inventaire',
          icon: <ClipboardListIcon className="h-5 w-5" />,
          description: 'Gestion des stocks alimentaires'
        },
        {
          name: 'Régimes spéciaux',
          path: '/cuisine/regimes',
          icon: <HeartIcon className="h-5 w-5" />,
          description: 'Allergies et préférences alimentaires'
        }
      ]
    },
    { 
      name: 'Statistiques', 
      path: '/statistiques', 
      icon: <ChartPieIcon className="h-5 w-5" />,
      description: 'Rapports et analyses du foyer'
    }
  ];
  
  const secondaryNavItems = [
    { 
      name: 'Paramètres', 
      path: '/parametres', 
      icon: <CogIcon className="h-5 w-5" />,
      description: 'Configuration du système'
    },
    { 
      name: 'Règlements', 
      path: '/reglements', 
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      description: 'Règles et directives du foyer'
    },
    { 
      name: 'Aide & Support', 
      path: '/aide', 
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
      description: 'Documentation et assistance'
    }
  ];

  // Fonctions utilitaires - restent les mêmes
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const hasActiveChild = (submenu) => {
    return submenu && submenu.some(item => isActive(item.path));
  };
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const shouldExpandSection = (item) => {
    if (expandedSection === item.name) return true;
    if (item.submenu && hasActiveChild(item.submenu)) return true;
    return false;
  };

  // Rendu d'un élément de sous-menu avec le nouveau design
  const renderSubMenuItem = (item) => (
    <NavLink 
      key={item.path} 
      to={item.path}
      onMouseEnter={() => setHoverItem(item.path)}
      onMouseLeave={() => setHoverItem(null)}
      className={({ isActive }) => `
        group relative flex items-center pl-10 pr-4 py-2.5 text-sm rounded-lg transition-all duration-200
        ${isActive 
          ? 'text-white font-medium backdrop-blur-sm' 
          : 'text-blue-100/70 hover:text-white hover:bg-white/5'}
        ${collapsed ? 'justify-center ml-1 pl-3' : ''}
      `}
    >
      {/* Fond actif avec brillance */}
      {isActive && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-indigo-600/70 rounded-lg"></div>
          <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
            <div className="absolute -top-1/2 left-0 right-0 h-full w-full bg-gradient-to-b from-white/10 via-transparent to-transparent"></div>
          </div>
        </>
      )}
      
      <div className="flex-shrink-0 mr-2 relative z-10">
        {item.icon}
      </div>
      
      {!collapsed && (
        <span className="truncate relative z-10">{item.name}</span>
      )}
      
      {/* Tooltip */}
      {((collapsed && item.description) || (!collapsed && hoverItem === item.path && item.description)) && (
        <div className={`
          absolute z-50 ${collapsed ? 'left-full ml-3' : 'top-full mt-1 left-0'} 
          bg-blue-900/95 backdrop-blur-sm text-white text-xs p-2 rounded-lg shadow-lg border border-white/10
          scale-0 ${hoverItem === item.path || collapsed ? 'scale-100' : ''} 
          transition-all duration-150 origin-${collapsed ? 'left' : 'top'} whitespace-nowrap
        `}>
          <div className="font-medium">{item.name}</div>
          <div className="text-blue-200 text-xs mt-0.5">{item.description}</div>
        </div>
      )}
    </NavLink>
  );

  // Rendu d'un élément de navigation principal avec le nouveau design
  const renderNavItem = (item) => {
    // Si l'élément a un sous-menu
    if (item.submenu) {
      const isExpanded = shouldExpandSection(item);
      const isItemActive = hasActiveChild(item.submenu);
      
      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => toggleSection(item.name)}
            onMouseEnter={() => setHoverItem(item.name)}
            onMouseLeave={() => setHoverItem(null)}
            className={`
              group relative w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200
              ${isItemActive
                ? 'text-white font-medium' 
                : 'text-blue-100/70 hover:text-white hover:bg-white/5'}
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {/* Effet d'arrière-plan actif */}
            {isItemActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-indigo-600/40 rounded-lg"></div>
            )}
            
            <div className={`${collapsed ? '' : 'w-5'} flex-shrink-0 relative z-10`}>
              {item.icon}
            </div>
            
            {!collapsed && (
              <>
                <span className="truncate relative z-10">{item.name}</span>
                <ChevronDownIcon className={`ml-auto h-4 w-4 transition-transform duration-200 relative z-10 ${isExpanded ? 'rotate-180' : ''}`} />
              </>
            )}
            
            {/* Tooltip pour mode collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-3 bg-blue-900/95 text-white px-3 py-2 text-xs 
                        rounded-lg scale-0 group-hover:scale-100 transition-all origin-left z-50 whitespace-nowrap border border-white/10 shadow-lg">
                <div className="font-medium">{item.name}</div>
                <div className="text-blue-200 text-xs mt-0.5">{item.description}</div>
              </div>
            )}
          </button>
          
          {/* Version simplifiée du sous-menu */}
          {!collapsed && isExpanded && (
            <div className="mt-1 bg-white/5 rounded-lg overflow-hidden">
              {item.submenu.map(subItem => (
                <NavLink 
                  key={subItem.path} 
                  to={subItem.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-2.5 text-sm transition-all
                    ${isActive 
                      ? 'bg-blue-600/30 text-white' 
                      : 'text-blue-100/80 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <div className="flex-shrink-0 w-5 mr-3 text-blue-300/70">
                    {subItem.icon}
                  </div>
                  <span>{subItem.name}</span>
                </NavLink>
              ))}
            </div>
          )}
          
          {/* Version simplifiée du sous-menu en mode collapsed */}
          {collapsed && isExpanded && (
            <div className="absolute left-full top-0 ml-3 mt-12 bg-blue-900/95 rounded-lg shadow-lg border border-white/10 py-1 w-48 z-50 overflow-hidden">
              {item.submenu.map(subItem => (
                <NavLink 
                  key={subItem.path} 
                  to={subItem.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 text-sm transition-all
                    ${isActive ? 'bg-blue-600/30 text-white' : 'text-blue-100/80 hover:bg-white/10 hover:text-white'}
                  `}
                >
                  <div className="flex-shrink-0 w-4 h-4 mr-2 text-blue-300/70">
                    {subItem.icon}
                  </div>
                  <span>{subItem.name}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Si l'élément est un lien simple
    return (
      <NavLink 
        key={item.path} 
        to={item.path}
        onMouseEnter={() => setHoverItem(item.path)}
        onMouseLeave={() => setHoverItem(null)}
        className={({ isActive }) => `
          group relative flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all duration-200
          ${isActive 
            ? 'text-white font-medium' 
            : 'text-blue-100/70 hover:text-white hover:bg-white/5'}
          ${collapsed ? 'justify-center' : ''}
        `}
      >
        {/* Effet d'arrière-plan actif avec brillance */}
        {({ isActive }) => isActive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 rounded-lg shadow-lg"></div>
            <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
              <div className="absolute -top-1/2 left-0 right-0 h-full w-full bg-gradient-to-b from-white/10 via-transparent to-transparent"></div>
            </div>
          </>
        )}
        
        <div className={`${collapsed ? '' : 'w-5'} flex-shrink-0 relative z-10 transition-all duration-200`}>
          {({ isActive }) => isActive && item.activeIcon ? item.activeIcon : item.icon}
        </div>
        
        {!collapsed && (
          <>
            <span className="truncate relative z-10">{item.name}</span>
            
            {item.badge && (
              <div className={`
                ml-auto flex-shrink-0 px-1.5 py-0.5 flex items-center justify-center rounded-full text-xs font-medium relative z-10
                ${item.badge.color === 'red' ? 'bg-red-500 text-white' : ''}
                ${item.badge.color === 'green' ? 'bg-green-500 text-white' : ''}
                ${item.badge.color === 'blue' ? 'bg-blue-500 text-white' : ''}
              `}>
                {item.badge.count}
              </div>
            )}
          </>
        )}
        
        {/* Badge en mode collapsed */}
        {collapsed && item.badge && (
          <div className="absolute top-0 right-0 -mt-1 -mr-1 z-10">
            <div className={`
              w-4 h-4 flex items-center justify-center rounded-full text-xs font-medium border-2 border-slate-900
              ${item.badge.color === 'red' ? 'bg-red-500 text-white' : ''}
              ${item.badge.color === 'green' ? 'bg-green-500 text-white' : ''}
              ${item.badge.color === 'blue' ? 'bg-blue-500 text-white' : ''}
            `}>
              {item.badge.count}
            </div>
          </div>
        )}
        
        {/* Tooltip en mode collapsed ou au survol */}
        {((collapsed && item.description) || (!collapsed && hoverItem === item.path && item.description)) && (
          <div className={`
            absolute z-50 ${collapsed ? 'left-full ml-3' : 'top-full mt-1 left-0'} 
            bg-blue-900/95 backdrop-blur-sm text-white text-xs p-2 rounded-lg shadow-lg border border-white/10
            scale-0 ${hoverItem === item.path || collapsed ? 'scale-100' : ''} 
            transition-all duration-150 origin-${collapsed ? 'left' : 'top'} whitespace-nowrap
          `}>
            <div className="font-medium">{item.name}</div>
            <div className="text-blue-200 text-xs mt-0.5">{item.description}</div>
            {item.badge && <div className="mt-1 text-xs flex items-center">
              <span className={`
                inline-block w-2 h-2 rounded-full mr-1
                ${item.badge.color === 'red' ? 'bg-red-400' : ''}
                ${item.badge.color === 'green' ? 'bg-green-400' : ''}
                ${item.badge.color === 'blue' ? 'bg-blue-400' : ''}
              `}></span>
              <span>{item.badge.count} éléments</span>
            </div>}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <div 
      className={`
        relative flex flex-col h-full transition-all duration-300 overflow-hidden
        ${collapsed ? 'w-16' : 'w-72'} z-30
      `}
      style={{
        background: 'linear-gradient(135deg, rgb(15 23 42 / 98%) 0%, rgb(31 44 90 / 96%) 100%)',
      }}
    >
      {/* Effets visuels subtils */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")" }}>
        </div>

        {/* Cercles lumineux */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        {/* Animation de ligne qui descend */}
        <div className="absolute right-4 top-0 bottom-0 w-px opacity-20">
          <div className="absolute h-20 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-slide-down"></div>
        </div>
      </div>

      {/* Bouton pour réduire/agrandir avec effet halo et ombre portée */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full z-10 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/50 flex items-center justify-center"
      >
        <div className="absolute inset-0 rounded-full opacity-20 animate-ping-slow bg-white"></div>
        {collapsed ? 
          <ChevronRightIcon className="h-3 w-3 text-white" /> : 
          <ChevronLeftIcon className="h-3 w-3 text-white" />
        }
      </button>
    
      {/* Logo et titre */}
      <div 
        className={`flex items-center p-4 relative overflow-hidden ${collapsed ? 'justify-center' : ''}`}
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Effets de réflexion */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        
        {collapsed ? (
          <div className="relative w-8 h-8 flex items-center justify-center z-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/30">
            <span className="text-xl font-bold text-white">F</span>
          </div>
        ) : (
          <>
            <div className="relative w-10 h-10 flex items-center justify-center z-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/30 mr-3">
              <span className="text-xl font-bold text-white">F</span>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-xl font-bold tracking-wide text-white">
                Gestion du Foyer
              </h1>
              <div className="flex items-center text-xs text-blue-200/70">
                <span>Panneau administrateur</span>
                <span className="ml-2 px-1.5 py-0.5 bg-blue-500/20 rounded-md text-xs text-blue-300">
                  Pro
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Menu principal */}
      <div className="flex flex-col flex-grow overflow-y-auto custom-scrollbar relative">
        {!collapsed && (
          <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-10 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center">
              <MenuAlt2Icon className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-white/80">Navigation</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-900/50 text-blue-300">{timeString}</span>
          </div>
        )}

        <div className={`p-4 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed && (
            <div className="px-2 mb-3">
              <div className="flex items-center">
                <span className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider">Principal</span>
                <div className="h-px flex-grow ml-2 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
              </div>
            </div>
          )}
          <nav className="space-y-1">
            {mainNavItems.map(renderNavItem)}
          </nav>
        </div>
        
        {!collapsed && (
          <div className="px-4 py-2">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          </div>
        )}
        
        <div className={`p-4 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed && (
            <div className="px-2 mb-3">
              <div className="flex items-center">
                <span className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider">Outils</span>
                <div className="h-px flex-grow ml-2 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
              </div>
            </div>
          )}
          <nav className="space-y-1">
            {secondaryNavItems.map(renderNavItem)}
          </nav>
        </div>
        
        {!collapsed && (
          <div className="mt-auto p-4">
            <div className="rounded-xl p-4 relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-sm border border-white/5">
              {/* Éléments décoratifs */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              </div>
              
              <div className="flex items-start relative z-10">
                <div className="rounded-full p-1.5 bg-blue-500/30">
                  <BellIcon className="h-4 w-4 text-blue-300" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xs font-medium text-white">Rappels</h3>
                  <p className="text-xs text-blue-200/70 mt-0.5">3 tâches à planifier aujourd'hui</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Section utilisateur */}
      <div 
        className={`relative p-4 ${collapsed ? 'flex justify-center' : ''}`}
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
            <span className="text-sm font-medium text-white">A</span>
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-green-400 rounded-full border border-slate-900"></span>
          </div>
        ) : (
          <div className="relative group z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg text-white relative overflow-hidden">
                <span className="text-lg font-medium">A</span>
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-slate-900"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin Foyer</p>
                <p className="text-xs text-blue-200/70 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  <span>En ligne</span>
                </p>
              </div>
              <div className="ml-auto">
                <button className="flex items-center justify-center h-8 w-8 rounded-lg text-blue-200 hover:bg-white/5 transition-all">
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Menu utilisateur au survol */}
            <div className="absolute bottom-full left-0 mb-2 w-full py-1 hidden group-hover:block transform transition-all duration-200 origin-bottom scale-95 group-hover:scale-100">
              <div className="bg-blue-900/80 backdrop-blur-sm rounded-lg shadow-2xl border border-white/5">
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-[10px] font-semibold text-blue-200/50 tracking-wider">CONNECTÉ EN TANT QUE</p>
                  <p className="text-sm font-medium text-white">administrateur@foyer.fr</p>
                </div>
                
                <a href="#profile" className="flex items-center px-3 py-2.5 text-sm text-blue-100 hover:bg-white/10 transition-colors">
                  Profil utilisateur
                </a>
                <a href="#settings" className="flex items-center px-3 py-2.5 text-sm text-blue-100 hover:bg-white/10 transition-colors">
                  Préférences
                </a>
                <hr className="my-1 border-white/5" />
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/20 transition-colors"
                >
                  <LogoutIcon className="h-4 w-4 mr-2" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Indicateur de version */}
      {!collapsed && (
        <div className="px-4 py-2 text-xs text-center text-blue-200/50" style={{ background: 'rgba(15, 23, 42, 0.9)' }}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-blue-300/80 font-medium">Foyer Manager Pro</span>
            <span className="inline-block w-1 h-1 bg-blue-400/30 rounded-full"></span>
            <span>v2.1.0</span>
          </div>
        </div>
      )}
      
      {/* Styles personnalisés */}
      <style jsx>{`
        @keyframes slide-down {
          0% { transform: translateY(-100px); opacity: 0.8; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.3); }
        }
        
        .animate-ping-slow { animation: ping-slow 3s ease-in-out infinite; }
        .animate-slide-down { animation: slide-down 15s linear infinite; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(59, 130, 246, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;