import React from 'react';
import { InformationCircleIcon, XIcon, ExclamationIcon } from '@heroicons/react/outline';

const TaskDescriptionField = ({ description, onChange, selectedColor, error }) => {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <span>Description</span>
        <span className="ml-1 text-xs text-red-500">*</span>
      </label>
      
      <div className="relative">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-start pt-2.5 pointer-events-none ${description ? selectedColor.text : 'text-gray-400'}`}>
          <InformationCircleIcon className="h-5 w-5" />
        </div>
        
        <textarea
          id="description"
          value={description}
          onChange={(e) => onChange(e.target.value)}
          rows="3"
          className={`pl-10 pr-3 py-2 shadow-sm block w-full text-sm rounded-lg
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : `border-gray-300 focus:ring-2 focus:ring-offset-2 ${selectedColor.ring} focus:border-transparent`}`}
          placeholder="Décrivez la tâche en détail..."
          style={{ resize: 'none' }}
        />
        
        {description && (
          <div 
            className="absolute right-3 top-3 transition-opacity opacity-70 hover:opacity-100 cursor-pointer"
            onClick={() => onChange('')}
          >
            <XIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </div>
        )}
      </div>
      
      {error ? (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <ExclamationIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-gray-500 flex items-start">
          <span className="text-gray-400 mr-1">💡</span>
          <span>Soyez précis pour que la tâche soit bien comprise par tous.</span>
        </p>
      )}
      
      <div className={`mt-1 text-xs ${description.length > 200 ? 'text-amber-500' : 'text-gray-400'} text-right`}>
        {description.length} / 500
      </div>
    </div>
  );
};

export default TaskDescriptionField;