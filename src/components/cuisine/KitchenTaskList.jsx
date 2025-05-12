import React, { useState } from 'react';
import { 
  PencilAltIcon, 
  TrashIcon,
  UserIcon,
  ClockIcon,
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  CalendarIcon
} from '@heroicons/react/outline';

const statusColors = {
  'en attente': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500' },
  'en cours': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500' },
  'terminé': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-500' },
  'annulé': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500' }
};

const typeColors = {
  'nettoyage': 'bg-blue-100 text-blue-800',
  'préparation': 'bg-purple-100 text-purple-800',
  'service': 'bg-green-100 text-green-800',
  'vaisselle': 'bg-cyan-100 text-cyan-800',
  'rangement': 'bg-indigo-100 text-indigo-800',
};

const KitchenTaskList = ({ tasks, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const types = [...new Set(tasks.map(task => task.type))];
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.assignedToName && task.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesType = !typeFilter || task.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Rechercher par description ou personne..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
          />
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-500 hidden sm:block">
            <span className="text-gray-700 font-medium">{filteredTasks.length}</span> résultats
            {(statusFilter || typeFilter) && <span> • Filtré</span>}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 bg-white py-1.5 px-3 rounded-lg text-xs text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
            >
              <FilterIcon className="h-3.5 w-3.5 text-cyan-500" />
              <span>Filtrer</span>
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-50" />
            </button>
            
            {/* Dropdown menu */}
            {showFilters && (
              <div className="absolute right-0 mt-1 w-60 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 text-sm">
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 font-medium mb-1.5">
                    Statut
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button 
                      className={`px-2 py-1 rounded text-xs font-medium ${!statusFilter ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                      onClick={() => setStatusFilter('')}
                    >
                      Tous
                    </button>
                    {Object.keys(statusColors).map(status => (
                      <button
                        key={status}
                        className={`px-2 py-1 rounded text-xs font-medium ${statusFilter === status ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1.5">
                    Type de tâche
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button 
                      className={`px-2 py-1 rounded text-xs font-medium ${!typeFilter ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                      onClick={() => setTypeFilter('')}
                    >
                      Tous
                    </button>
                    {types.map(type => (
                      <button
                        key={type}
                        className={`px-2 py-1 rounded text-xs font-medium ${typeFilter === type ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setTypeFilter(type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune tâche trouvée</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Aucune tâche ne correspond à vos critères de recherche ou de filtrage
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigné à
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cyan-50 flex items-center justify-center">
                          <CalendarIcon className="h-4 w-4 text-cyan-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{formatDate(task.date)}</div>
                          <div className="text-sm text-gray-500">{task.timeSlot}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[task.type] || 'bg-gray-100 text-gray-800'}`}>
                        {task.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{task.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.assignedToName ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{task.assignedToName}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                          Non assigné
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${statusColors[task.status].bg} ${statusColors[task.status].text} border ${statusColors[task.status].border}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1.5 rounded-md bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors"
                          onClick={() => onEdit && onEdit(task)}
                        >
                          <PencilAltIcon className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() => onDelete && onDelete(task.id)}
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
        </div>
      )}
    </div>
  );
};

export default KitchenTaskList;