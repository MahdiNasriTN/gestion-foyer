import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  ViewListIcon, 
  ViewGridIcon,
  PlusIcon,
  ChartPieIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowSmUpIcon,
  ExclamationCircleIcon,
  LightningBoltIcon
} from '@heroicons/react/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import KitchenTaskList from './KitchenTaskList';
import KitchenCalendarView from './KitchenCalendarView';
import { mockKitchenTasks, mockEtudiants } from '../../utils/mockData';

// Richer, on-brand color palette
const COLORS = {
  primary: '#0ea5e9', // Sky blue 500
  primaryLight: '#e0f2fe', // Sky blue 50
  primaryDark: '#0284c7', // Sky blue 600
  secondary: '#8b5cf6', // Violet 500
  secondaryLight: '#f5f3ff', // Violet 50
  accent1: '#06b6d4', // Cyan 500
  accent2: '#14b8a6', // Teal 500
  accent3: '#f59e0b', // Amber 500
  accent4: '#ef4444', // Red 500
  neutral: '#64748b', // Slate 500
  neutralLight: '#f8fafc', // Slate 50
  neutralDark: '#334155', // Slate 700
  chart: ['#0ea5e9', '#8b5cf6', '#06b6d4', '#f59e0b', '#14b8a6']
};

const KitchenDashboard = ({ tasks = mockKitchenTasks, onAddTask, onEditTask, onDeleteTask }) => {
  const [view, setView] = useState('list');
  const [localTasks, setLocalTasks] = useState([]);
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [expandedStat, setExpandedStat] = useState(null);
  const [activeTimeRange, setActiveTimeRange] = useState('week');
  const [stats, setStats] = useState({
    tasksToday: 0,
    tasksThisWeek: 0,
    unassignedTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    tasksByType: [],
    tasksByStatus: [],
    participationRate: [],
    trendData: [],
    avgCompletionTime: 0
  });

  // Format date helper
  const formatDate = (dateStr) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  useEffect(() => {
    // Use the passed tasks or fallback to mock data
    const tasksData = tasks && tasks.length ? tasks : mockKitchenTasks;
    setLocalTasks(tasksData);
    
    try {
      // Calculate statistics
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const tasksToday = tasksData.filter(task => 
        task && task.date === todayString
      ).length;
      
      const tasksThisWeek = tasksData.filter(task => {
        if (!task || !task.date) return false;
        const taskDate = new Date(task.date);
        return taskDate >= weekStart && taskDate <= weekEnd;
      }).length;
      
      const unassignedTasks = tasksData.filter(task => 
        task && (!task.assignedTo || task.assignedTo === '')
      ).length;
      
      const completedTasks = tasksData.filter(task => 
        task && task.status === 'terminé'
      ).length;

      const completionRate = Math.round((completedTasks / (tasksData.length || 1)) * 100);
      
      // Task types statistics - with null check
      const typeCount = tasksData.reduce((acc, task) => {
        if (task && task.type) {
          acc[task.type] = (acc[task.type] || 0) + 1;
        }
        return acc;
      }, {});
      
      const tasksByType = Object.keys(typeCount).map(type => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: typeCount[type],
        color: type === 'nettoyage' ? COLORS.chart[0] : 
               type === 'préparation' ? COLORS.chart[1] :
               type === 'service' ? COLORS.chart[2] :
               type === 'vaisselle' ? COLORS.chart[3] : COLORS.chart[4]
      }));

      // Tasks by status
      const statusCount = tasksData.reduce((acc, task) => {
        if (task && task.status) {
          acc[task.status] = (acc[task.status] || 0) + 1;
        }
        return acc;
      }, {});
      
      const tasksByStatus = Object.keys(statusCount).map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCount[status],
        color: status === 'terminé' ? '#10b981' : 
               status === 'en cours' ? '#6366f1' :
               status === 'en attente' ? '#f59e0b' : '#ef4444'
      }));
      
      // Participation rate - with null checks
      const studentsData = mockEtudiants || [];
      const studentParticipation = studentsData
        .filter(student => student && student.id)
        .map(student => {
          if (!student) return { name: 'Unknown', tasks: 0, completed: 0 };
          
          const studentTasks = tasksData.filter(task => 
            task && task.assignedTo === student.id
          );

          const taskCount = studentTasks.length;
          const completedCount = studentTasks.filter(task => 
            task && task.status === 'terminé'
          ).length;
          
          const fullName = student.firstName && student.lastName 
            ? `${student.firstName} ${student.lastName.charAt(0)}.` 
            : student.nom || 'Unknown';
          
          return {
            name: fullName,
            tasks: taskCount,
            completed: completedCount,
            rate: taskCount ? Math.round((completedCount / taskCount) * 100) : 0
          };
        })
        .filter(item => item !== null)
        .sort((a, b) => b.tasks - a.tasks)
        .slice(0, 5);

      // Generate trend data
      const generateTrendData = () => {
        const data = [];
        // Generate data for last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayTasks = tasksData.filter(task => task && task.date === dateStr);
          const completed = dayTasks.filter(task => task && task.status === 'terminé').length;
          const pending = dayTasks.filter(task => task && task.status === 'en attente').length;
          const inProgress = dayTasks.filter(task => task && task.status === 'en cours').length;
          
          data.push({
            name: i === 0 ? "Aujourd'hui" : i === 1 ? "Hier" : formatDate(dateStr),
            completed,
            pending,
            inProgress,
            total: dayTasks.length
          });
        }
        return data;
      };

      // Calculate average completion time (mock data for now)
      const avgCompletionTime = 4.5; // hours

      setStats({
        tasksToday,
        tasksThisWeek,
        unassignedTasks,
        completedTasks,
        completionRate,
        tasksByType,
        tasksByStatus,
        participationRate: studentParticipation,
        trendData: generateTrendData(),
        avgCompletionTime
      });

    } catch (error) {
      console.error("Error calculating kitchen stats:", error);
      // Set default stats if there's an error
      setStats({
        tasksToday: 0,
        tasksThisWeek: 0,
        unassignedTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        tasksByType: [],
        tasksByStatus: [],
        participationRate: [],
        trendData: [],
        avgCompletionTime: 0
      });
    }
  }, [tasks]);

  // Custom tooltips for chart components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-neutral-100 text-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center text-xs mb-1">
              <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: entry.color || entry.fill }}></span>
              <span>{entry.name}: {entry.value} {entry.name === "Taux" ? "%" : ""}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Helper for status chip colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'terminé': return 'bg-emerald-100 text-emerald-800';
      case 'en cours': return 'bg-indigo-100 text-indigo-800';
      case 'en attente': return 'bg-amber-100 text-amber-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  // Toggle card expansion
  const toggleCardExpansion = (cardId) => {
    setExpandedStat(expandedStat === cardId ? null : cardId);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header premium with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 shadow-xl">
        {/* Visual effects */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="200" fill="none" stroke="currentColor" strokeWidth="50" strokeDasharray="200 30"></circle>
            <circle cx="600" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="40" strokeDasharray="50 20"></circle>
            <circle cx="200" cy="600" r="150" fill="none" stroke="currentColor" strokeWidth="30" strokeDasharray="80 40"></circle>
          </svg>
        </div>

        <div className="relative p-8">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
            {/* Left side with title and description */}
            <div className="w-full lg:w-2/3 space-y-3">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Gestion de Cuisine
              </h1>
              <p className="text-blue-100 max-w-2xl">
                Planifiez et suivez les tâches de cuisine pour le foyer. Assignez des tâches aux résidents et visualisez le planning.
              </p>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 mt-6">
                {/* View mode selector */}
                <div className="inline-flex overflow-hidden rounded-lg bg-white/5 border border-white/10">
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 relative ${view === 'list' ? 'text-white' : 'text-blue-200/70 hover:text-blue-100'}`}
                    title="Vue en liste"
                  >
                    {view === 'list' && (
                      <span className="absolute inset-0 bg-cyan-500/20 border-y border-cyan-400/30"></span>
                    )}
                    <ViewListIcon className="h-5 w-5 relative z-10" />
                  </button>

                  <span className="w-px bg-white/10"></span>

                  <button
                    onClick={() => setView('calendar')}
                    className={`p-2 relative ${view === 'calendar' ? 'text-white' : 'text-blue-200/70 hover:text-blue-100'}`}
                    title="Vue en calendrier"
                  >
                    {view === 'calendar' && (
                      <span className="absolute inset-0 bg-cyan-500/20 border-y border-cyan-400/30"></span>
                    )}
                    <ViewGridIcon className="h-5 w-5 relative z-10" />
                  </button>
                </div>

                {/* Statistics toggle */}
                <button
                  onClick={() => setIsStatsOpen(!isStatsOpen)}
                  className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium shadow-sm bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <ChartPieIcon className="h-4 w-4 mr-2 text-blue-300" aria-hidden="true" />
                  {isStatsOpen ? 'Masquer' : 'Statistiques'}
                </button>

                <button
                  onClick={() => onAddTask && onAddTask()}
                  className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium shadow-sm bg-cyan-500 text-white hover:bg-cyan-600 transition-all ml-auto"
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Statistics Summary Section */}
      {isStatsOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Today's Tasks - Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-sky-50 p-3 mr-4 group-hover:bg-sky-100 transition-colors">
                  <CalendarIcon className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Tâches aujourd'hui</p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.tasksToday}</h3>
                    <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700">
                      <ArrowSmUpIcon className="h-3 w-3 mr-0.5" />
                      +{Math.max(0, stats.tasksToday - 3)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
                  <span>Progression</span>
                  <span className="font-medium">{Math.min(100, Math.round((stats.completedTasks / (stats.tasksToday || 1)) * 100))}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-1.5 rounded-full bg-sky-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((stats.completedTasks / (stats.tasksToday || 1)) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 group-hover:bg-sky-50 transition-colors">
              <div className="flex items-center text-xs text-sky-700">
                <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                <span>{stats.completedTasks} tâche{stats.completedTasks !== 1 ? 's' : ''} terminée{stats.completedTasks !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          {/* Weekly Tasks - Card 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-violet-50 p-3 mr-4 group-hover:bg-violet-100 transition-colors">
                  <ClockIcon className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Cette semaine</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.tasksThisWeek}</h3>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-1">
                {['terminé', 'en cours', 'en attente'].map(status => {
                  const count = stats.tasksByStatus.find(s => s.name.toLowerCase() === status)?.value || 0;
                  return (
                    <div key={status} className="text-center">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {count}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 group-hover:bg-violet-50 transition-colors">
              <div className="flex items-center text-xs text-violet-700">
                <TrendingUpIcon className="h-4 w-4 mr-1.5" />
                <span>Taux de complétion: {stats.completionRate}%</span>
              </div>
            </div>
          </div>
          
          {/* Unassigned Tasks - Card 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-amber-50 p-3 mr-4 group-hover:bg-amber-100 transition-colors">
                  <UserGroupIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Non-attribuées</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.unassignedTasks}</h3>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
                  <span>Taux d'attribution</span>
                  <span className="font-medium">{Math.round(((localTasks.length - stats.unassignedTasks) / (localTasks.length || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-1.5 rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${Math.round(((localTasks.length - stats.unassignedTasks) / (localTasks.length || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 group-hover:bg-amber-50 transition-colors">
              <div className="flex items-center text-xs text-amber-700">
                <ExclamationCircleIcon className="h-4 w-4 mr-1.5" />
                <span>{stats.unassignedTasks} tâche{stats.unassignedTasks !== 1 ? 's' : ''} en attente d'attribution</span>
              </div>
            </div>
          </div>
          
          {/* Performance - Card 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-emerald-50 p-3 mr-4 group-hover:bg-emerald-100 transition-colors">
                  <LightningBoltIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Performance</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.completionRate}%</h3>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <div className="text-xs text-gray-500 flex items-center">
                  <span>Temps moyen:</span>
                  <span className="ml-2 font-semibold text-emerald-700">{stats.avgCompletionTime} heures</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 group-hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-emerald-700">
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  <span>{stats.completionRate >= 70 ? 'Excellente performance' : 'Performance normale'}</span>
                </div>
                <span className="text-xs text-gray-500">cible: 80%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Charts Section with Expandable Cards */}
      {isStatsOpen && (
        <div className={`grid grid-cols-1 ${expandedStat ? '' : 'md:grid-cols-2'} gap-6 mb-6`}>
          {/* Task Distribution by Type */}
          <div 
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer ${
              expandedStat === 'type-chart' ? 'col-span-full' : ''
            }`}
            onClick={() => toggleCardExpansion('type-chart')}
          >
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Distribution des types de tâches</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCardExpansion('type-chart');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
              </button>
            </div>
            <div className="p-6 pt-0">
              <div className={`h-64 ${expandedStat === 'type-chart' ? 'md:h-96' : ''}`}>
                {stats.tasksByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.tasksByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={expandedStat === 'type-chart' ? 140 : 80}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {stats.tasksByType.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color || COLORS.chart[index % COLORS.chart.length]} 
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        iconSize={10}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </div>

              {expandedStat === 'type-chart' && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {stats.tasksByType.map((type, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="inline-block w-6 h-6 rounded-full mb-2" style={{ backgroundColor: type.color }}></div>
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xl font-bold text-gray-900">{type.value}</div>
                      <div className="text-xs text-gray-500">tâches</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Task Status Distribution */}
          <div 
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer ${
              expandedStat === 'status-chart' ? 'col-span-full' : ''
            }`}
            onClick={() => toggleCardExpansion('status-chart')}
          >
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Distribution par statut</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCardExpansion('status-chart');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
              </button>
            </div>
            <div className="p-6 pt-0">
              <div className={`h-64 ${expandedStat === 'status-chart' ? 'md:h-96' : ''}`}>
                {stats.tasksByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {expandedStat === 'status-chart' ? (
                      <BarChart
                        data={stats.tasksByStatus}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Tâches" radius={[4, 4, 0, 0]}>
                          {stats.tasksByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={stats.tasksByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {stats.tasksByStatus.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          iconType="circle"
                          iconSize={10}
                        />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </div>

              {expandedStat === 'status-chart' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  {stats.tasksByStatus.map((status, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center flex flex-col items-center">
                      <div 
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 text-white"
                        style={{ backgroundColor: status.color }}
                      >
                        {status.name === 'Terminé' ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : status.name === 'En cours' ? (
                          <ClockIcon className="h-5 w-5" />
                        ) : status.name === 'En attente' ? (
                          <ExclamationCircleIcon className="h-5 w-5" />
                        ) : (
                          <XCircleIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="font-medium">{status.name}</div>
                      <div className="text-2xl font-bold text-gray-900">{status.value}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round((status.value / localTasks.length) * 100)}% du total
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Top Participants */}
          <div 
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer ${
              expandedStat === 'participant-chart' ? 'col-span-full' : ''
            }`}
            onClick={() => toggleCardExpansion('participant-chart')}
          >
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Top 5 Participants</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCardExpansion('participant-chart');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
              </button>
            </div>
            <div className="p-6 pt-0">
              <div className={`h-64 ${expandedStat === 'participant-chart' ? 'md:h-96' : ''}`}>
                {stats.participationRate.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.participationRate}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      barSize={expandedStat === 'participant-chart' ? 40 : 20}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis 
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="top" 
                        height={36} 
                      />
                      <Bar 
                        dataKey="tasks" 
                        name="Total" 
                        fill={COLORS.primary}
                        radius={[4, 4, 0, 0]}
                      />
                      {expandedStat === 'participant-chart' && (
                        <Bar 
                          dataKey="completed" 
                          name="Terminées" 
                          fill={COLORS.accent2}
                          radius={[4, 4, 0, 0]} 
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </div>

              {expandedStat === 'participant-chart' && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tâches</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terminées</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.participationRate.map((person, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white">
                                {person.name.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{person.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{person.tasks}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{person.completed}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              person.rate >= 75 ? 'bg-green-100 text-green-800' :
                              person.rate >= 50 ? 'bg-blue-100 text-blue-800' :
                              person.rate >= 25 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {person.rate}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Tasks Trend */}
          <div 
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer ${
              expandedStat === 'trend-chart' ? 'col-span-full' : ''
            }`}
            onClick={() => toggleCardExpansion('trend-chart')}
          >
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Tendance des tâches</h3>
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTimeRange('week');
                    }}
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      activeTimeRange === 'week' 
                        ? 'bg-sky-100 text-sky-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Semaine
                  </button>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCardExpansion('trend-chart');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className={`h-64 ${expandedStat === 'trend-chart' ? 'md:h-96' : ''}`}>
                {stats.trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {expandedStat === 'trend-chart' ? (
                      <AreaChart
                        data={stats.trendData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.accent2} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={COLORS.accent2} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="total" name="Total" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorTotal)" />
                        <Area type="monotone" dataKey="completed" name="Terminées" stroke={COLORS.accent2} fillOpacity={1} fill="url(#colorCompleted)" />
                        <Area type="monotone" dataKey="pending" name="En attente" stroke={COLORS.accent3} fillOpacity={0.5} />
                        <Area type="monotone" dataKey="inProgress" name="En cours" stroke={COLORS.secondary} fillOpacity={0.5} />
                      </AreaChart>
                    ) : (
                      <LineChart
                        data={stats.trendData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          name="Total" 
                          stroke={COLORS.primary} 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="completed" 
                          name="Terminées" 
                          stroke={COLORS.accent2} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </div>

              {expandedStat === 'trend-chart' && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Synthèse des tendances</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-500">Jour le plus actif</div>
                      <div className="text-lg font-bold text-gray-900">
                        {stats.trendData.reduce((max, day) => day.total > max.total ? day : max, { total: 0 }).name}
                      </div>
                      <div className="text-sm text-gray-700">
                        {stats.trendData.reduce((max, day) => day.total > max.total ? day : max, { total: 0 }).total} tâches
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-500">Progression moyenne</div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round((stats.trendData.reduce((sum, day) => sum + day.completed, 0) / 
                        stats.trendData.reduce((sum, day) => sum + day.total, 0)) * 100) || 0}%
                      </div>
                      <div className="text-sm text-gray-700">sur 7 jours</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-500">Tendance</div>
                      <div className="text-lg font-bold text-gray-900 flex items-center">
                        {stats.trendData[6]?.completed > stats.trendData[0]?.completed ? (
                          <>
                            <ArrowSmUpIcon className="h-5 w-5 text-emerald-500 mr-1" />
                            <span className="text-emerald-600">En hausse</span>
                          </>
                        ) : (
                          <>
                            <ArrowSmUpIcon className="h-5 w-5 text-amber-500 mr-1 transform rotate-180" />
                            <span className="text-amber-600">En baisse</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">de productivité</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Task View */}
      {view === 'list' ? (
        <KitchenTaskList 
          tasks={localTasks} 
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ) : (
        <KitchenCalendarView 
          tasks={localTasks}
          onEdit={onEditTask}
        />
      )}
    </div>
  );
};

export default KitchenDashboard;