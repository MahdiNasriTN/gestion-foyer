import React from 'react';
import { CheckCircleIcon, ExclamationIcon } from '@heroicons/react/outline';

const TaskTypeSelector = ({ type, onSelect, typeConfig, colorClasses, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Type de tâche
      </label>
      <div className="grid grid-cols-5 gap-2">
        {Object.keys(typeConfig).map(taskType => {
          const { icon, color } = typeConfig[taskType];
          const colorClass = colorClasses[color];
          const isSelected = type === taskType;
          
          return (
            <button
              key={taskType}
              type="button"
              onClick={() => onSelect(taskType)}
              className={`relative py-3 flex flex-col items-center rounded-lg border ${
                isSelected 
                  ? `${colorClass.border} ${colorClass.light} ring-2 ring-offset-2 ${colorClass.ring}` 
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl mb-1">{icon}</span>
              <span className={`text-xs font-medium ${
                isSelected ? colorClass.text : 'text-gray-700'
              }`}>
                {taskType.charAt(0).toUpperCase() + taskType.slice(1)}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircleIcon className={`h-4 w-4 ${colorClass.text}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <ExclamationIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default TaskTypeSelector;