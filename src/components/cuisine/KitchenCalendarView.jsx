import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, DotsVerticalIcon } from '@heroicons/react/solid';
import { ClipboardListIcon } from '@heroicons/react/outline';

const typeColors = {
  'nettoyage': 'bg-blue-100 border-blue-300 text-blue-800',
  'préparation': 'bg-purple-100 border-purple-300 text-purple-800',
  'service': 'bg-green-100 border-green-300 text-green-800',
  'vaisselle': 'bg-cyan-100 border-cyan-300 text-cyan-800',
  'rangement': 'bg-indigo-100 border-indigo-300 text-indigo-800',
};

const KitchenCalendarView = ({ tasks, onEdit }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  
  const renderHeader = () => {
    const dateFormat = { month: 'long', year: 'numeric' };
    
    return (
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {currentMonth.toLocaleDateString('fr-FR', dateFormat)}
        </h2>
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = [];
    const dateFormat = { weekday: 'short' };
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-sm text-gray-600 uppercase py-2 border-b border-gray-200">
          {new Intl.DateTimeFormat('fr-FR', dateFormat).format(addDays(startDate, i)).slice(0, 3)}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 gap-0">{days}</div>;
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = formatDate(cloneDay);
        
        // Find tasks for this day
        const dayTasks = tasks.filter(task => task.date === formattedDate);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        days.push(
          <div
            key={day}
            className={`min-h-[130px] p-2 border-r border-b relative ${
              !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
            } ${
              isToday ? 'ring-2 ring-cyan-300 ring-inset' : ''
            }`}
          >
            <div className={`text-right text-sm font-medium mb-1 ${!isCurrentMonth ? 'text-gray-400' : isToday ? 'text-cyan-600' : 'text-gray-700'}`}>
              {formattedDate.split('-')[2]}
            </div>
            
            <div className="space-y-1.5">
              {dayTasks.slice(0, 3).map((task, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskDetails(true);
                  }}
                  className={`${typeColors[task.type] || 'bg-gray-100 border-gray-300 text-gray-800'} 
                    border-l-4 p-1.5 text-xs rounded shadow-sm truncate cursor-pointer hover:opacity-80 transition-opacity`}
                  title={`${task.description} - ${task.assignedToName || 'Non assigné'}`}
                >
                  <div className="font-medium">{task.timeSlot}</div>
                  <div className="truncate">{task.description}</div>
                </div>
              ))}
              
              {dayTasks.length > 3 && (
                <div className="text-xs text-center font-medium text-gray-500 cursor-pointer hover:text-gray-700 hover:bg-gray-50 rounded py-1 transition-colors"
                  onClick={() => {
                    // Handle showing all tasks for this day
                  }}
                >
                  +{dayTasks.length - 3} autres tâches
                </div>
              )}
              
              {dayTasks.length === 0 && isCurrentMonth && (
                <div className="text-xs text-gray-400 italic">Aucune tâche</div>
              )}
            </div>
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }
    
    return <div>{rows}</div>;
  };
  
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return [year, month, day].join('-');
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Helper functions for date manipulation
  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  function startOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() - day);
    return result;
  }
  
  function endOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() + (6 - day));
    return result;
  }
  
  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  
  function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  
  function isSameMonth(a, b) {
    return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  }
  
  function isSameDay(a, b) {
    return a.getDate() === b.getDate() && isSameMonth(a, b);
  }
  
  function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  
  function subMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
  }
  
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <ClipboardListIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune tâche planifiée</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Commencez par ajouter des tâches pour les voir apparaître dans le calendrier
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      {/* Task detail modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={() => setShowTaskDetails(false)}></div>
            
            <div className="bg-white rounded-lg shadow-xl transform transition-all max-w-md w-full p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la tâche
                </h3>
                <button onClick={() => setShowTaskDetails(false)} className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${typeColors[selectedTask.type] || 'bg-gray-100 border-gray-300 text-gray-800'}`}>
                    {selectedTask.type}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-gray-900">{selectedTask.description}</p>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date</h4>
                    <p className="text-gray-900">{new Date(selectedTask.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Horaire</h4>
                    <p className="text-gray-900">{selectedTask.timeSlot}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Assigné à</h4>
                  {selectedTask.assignedToName ? (
                    <p className="text-gray-900">{selectedTask.assignedToName}</p>
                  ) : (
                    <p className="text-gray-500 italic">Non assigné</p>
                  )}
                </div>
                
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setShowTaskDetails(false);
                      onEdit && onEdit(selectedTask);
                    }}
                    className="w-full bg-cyan-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Modifier cette tâche
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenCalendarView;