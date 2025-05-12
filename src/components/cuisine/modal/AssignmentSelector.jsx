import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/outline';
import { mockEtudiants } from '../../../utils/mockData';

const AssignmentSelector = ({ assignedTo, onSelect, selectedColor }) => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get students once
  useEffect(() => {
    setStudents(mockEtudiants || []);
  }, []);
  
  // Displayed students - filtered by search and limited
  const displayStudents = students
    .filter(s => {
      if (!searchQuery) return true;
      const fullName = `${s.firstName || ''} ${s.lastName || ''} ${s.nom || ''}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    })
    .slice(0, 5);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Assigné à
      </label>
      
      {/* Search field */}
      <input
        type="text"
        placeholder="Rechercher un étudiant..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-offset-2"
      />
      
      {/* Student selection grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {/* "Not assigned" option */}
        <button
          type="button"
          onClick={() => onSelect('')}
          className={`flex items-center p-2 rounded-lg ${
            assignedTo === '' 
              ? `${selectedColor.light} border ${selectedColor.border}`
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="text-sm font-medium text-gray-900">
            Non assigné
          </div>
        </button>
        
        {/* Student options */}
        {displayStudents.map(student => (
          <button
            key={student.id}
            type="button"
            onClick={() => onSelect(student.id)}
            className={`flex items-center p-2 rounded-lg ${
              assignedTo === student.id 
                ? `${selectedColor.light} border ${selectedColor.border}`
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-3">
              {(student.firstName?.[0] || student.nom?.[0] || '?').toUpperCase()}
            </div>
            <div className="text-sm truncate max-w-[120px] font-medium text-gray-900">
              {student.nom || (student.firstName && student.lastName ? `${student.firstName} ${student.lastName}` : 'Anonyme')}
            </div>
            {assignedTo === student.id && (
              <div className={`ml-auto ${selectedColor.text}`}>
                <CheckCircleIcon className="h-5 w-5" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Hint text */}
      <div className="text-xs text-gray-500 flex items-start pt-3">
        <span className="text-gray-400 mr-1">💡</span>
        <span>Vous pouvez laisser ce champ vide et assigner la tâche plus tard.</span>
      </div>
    </div>
  );
};

export default AssignmentSelector;