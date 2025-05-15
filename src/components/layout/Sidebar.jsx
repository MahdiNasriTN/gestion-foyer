import React, { useState, useEffect, useMemo } from 'react';
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
  ShieldCheckIcon,
  LogoutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UserIcon
} from '@heroicons/react/outline';

import { 
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  OfficeBuildingIcon as OfficeBuildingIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  CakeIcon as CakeIconSolid,
  ChartPieIcon as ChartPieIconSolid,
  ClipboardListIcon as ClipboardListIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/solid';

const Sidebar = ({ onLogout, onNavigateToEtudiants }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Update date only if the day changes
      if (now.getDate() !== currentDate.getDate() || 
          now.getMonth() !== currentDate.getMonth() ||
          now.getFullYear() !== currentDate.getFullYear()) {
        setCurrentDate(now);
      }
    }, 10000); // update every 10 seconds
    
    return () => clearInterval(timer);
  }, [currentDate]);
  
  // Formatted time & date
  const timeString = useMemo(() => 
    currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    [currentTime]
  );
  
  const dateString = useMemo(() => 
    currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
    [currentDate]
  );
  
  // Modifiez la définition des éléments de navigation
  const navItems = [
    { 
      name: 'Tableau de Bord', 
      path: '/', 
      icon: <HomeIcon className="h-5 w-5" />,
      activeIcon: <HomeIconSolid className="h-5 w-5" />,
      badge: null,
      description: 'Vue d\'ensemble et statistiques',
      color: 'from-sky-500 to-blue-600',
    },
    
    { 
      name: 'Gestion des Stagiaires', 
      path: '/stagiaires', 
      icon: <BriefcaseIcon className="h-5 w-5" />,
      activeIcon: <BriefcaseIconSolid className="h-5 w-5" />,
      badge: { count: 5, color: 'blue' },
      description: 'Gestion des stagiaires hébergés',
      color: 'from-violet-500 to-purple-600',
    },
    { 
      name: 'Gestion du Personnel', 
      path: '/personnel', 
      icon: <UserIcon className="h-5 w-5" />,
      activeIcon: <UserIconSolid className="h-5 w-5" />,
      badge: null,
      description: 'Gestion du personnel',
      color: 'from-indigo-500 to-blue-600',
    },
    { 
      name: 'Gestion des Chambres', 
      path: '/chambres', 
      icon: <OfficeBuildingIcon className="h-5 w-5" />,
      activeIcon: <OfficeBuildingIconSolid className="h-5 w-5" />,
      badge: { count: 2, color: 'green' },
      description: 'Gestion des chambres et occupations',
      color: 'from-emerald-500 to-green-600',
    },
    { 
      name: 'Gestion de la Cuisine', 
      path: '/cuisine', 
      icon: <CakeIcon className="h-5 w-5" />,
      activeIcon: <CakeIconSolid className="h-5 w-5" />,
      badge: null,
      description: 'Aperçu de la restauration',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div 
      className={`
        relative flex flex-col h-full transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'} z-30
      `}
      style={{
        background: 'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(31, 41, 55) 100%)',
      }}
    >
      {/* Visual effects for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-grid-pattern"></div>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      {/* Collapse button - repositioned to be more visible */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-16 w-8 h-8 rounded-full z-50 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all border-2 border-white/20"
      >
        {collapsed ? 
          <ChevronRightIcon className="h-4 w-4 text-white" /> : 
          <ChevronLeftIcon className="h-4 w-4 text-white" />
        }
      </button>
    
      {/* Logo section */}
      <div 
        className={`flex items-center p-4 relative ${collapsed ? 'justify-center' : ''}`}
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Logo - compact version */}
        {collapsed ? (
          <div className="w-9 h-9 flex items-center justify-center z-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg overflow-hidden">
            <span className="text-xl font-bold text-white">F</span>
          </div>
        ) : (
          <>
            {/* Logo - full version */}
            <div className="w-10 h-10 flex items-center justify-center z-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg mr-3">
              <span className="text-xl font-bold text-white">F</span>
            </div>
            
            {/* Title section */}
            <div>
              <h1 className="text-base font-bold tracking-wide text-white">
                Gestion De Foyer<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400"></span>
              </h1>
              <div className="text-2xs text-blue-200/80">
                Panneau administrateur
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Date & time display - only in expanded mode */}
      {!collapsed && (
        <div className="px-4 pt-3 flex items-center justify-between">
          <span className="text-2xs text-blue-200/60">
            {dateString}
          </span>
          <span className="text-2xs px-1.5 py-0.5 rounded-md bg-blue-900/40 text-blue-300 border border-blue-800/30">
            {timeString}
          </span>
        </div>
      )}
      
      {/* Navigation principale - simplifiée */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className={`py-3 px-3 ${collapsed ? 'px-2' : ''}`}>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => `
                  group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'text-white font-medium' 
                    : 'text-blue-100/70 hover:text-white hover:bg-white/5'}
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active state with gradient background */}
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg opacity-90`}></div>
                    )}
                    
                    <div className="flex-shrink-0 relative z-10">
                      {isActive && item.activeIcon ? item.activeIcon : item.icon}
                    </div>
                    
                    {!collapsed && (
                      <>
                        <span className="truncate relative z-10 text-xs">{item.name}</span>
                        
                        {/* Badge */}
                        {item.badge && (
                          <div className={`
                            ml-auto px-1 py-0.5 flex-shrink-0 rounded-full text-2xs font-medium relative z-10
                            ${item.badge.color === 'green' ? 'bg-emerald-500 text-white' : ''}
                            ${item.badge.color === 'blue' ? 'bg-blue-500 text-white' : ''}
                          `}>
                            {item.badge.count}
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Badge in collapsed mode */}
                    {collapsed && item.badge && (
                      <div className="absolute top-0 right-0 -mt-1 -mr-1 z-10">
                        <div className={`
                          w-3.5 h-3.5 flex items-center justify-center rounded-full text-2xs font-medium
                          ${item.badge.color === 'green' ? 'bg-emerald-500 text-white' : ''}
                          ${item.badge.color === 'blue' ? 'bg-blue-500 text-white' : ''}
                        `}>
                          {item.badge.count}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      
      {/* User profile section */}
      <div 
        className="p-4 border-t border-white/10 mt-auto"
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        }}
      >
        <div className={`flex ${collapsed ? 'justify-center' : ''}`}>
  
        </div>
      </div>
      
      
      {/* Custom styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 0V20M0 1H20' stroke='white' stroke-opacity='0.1' stroke-width='0.5'/%3E%3C/svg%3E");
          background-size: 20px 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
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