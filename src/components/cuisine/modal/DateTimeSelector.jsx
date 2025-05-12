import React from 'react';
import { CalendarIcon, ExclamationIcon } from '@heroicons/react/outline';

const DateTimeSelector = ({ date, timeSlot, onDateChange, onTimeSlotChange, selectedColor, error }) => {
  // Time slot options
  const timeSlots1 = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00'];
  const timeSlots2 = ['16:00 - 18:00', '18:00 - 20:00', '20:00 - 22:00'];
  
  // Helper functions for date buttons
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };
  
  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onDateChange(tomorrow.toISOString().split('T')[0]);
  };
  
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <span>Date</span>
          <span className="ml-1 text-xs text-red-500">*</span>
        </label>
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${date ? selectedColor.text : 'text-gray-400'}`}>
            <CalendarIcon className="h-5 w-5" />
          </div>
          
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className={`pl-10 pr-3 py-2 shadow-sm block w-full text-sm rounded-lg
              ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : `border-gray-300 focus:ring-2 focus:ring-offset-2 ${selectedColor.ring} focus:border-transparent`}`}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1.5">
            <button 
              type="button" 
              onClick={setToday}
              className={`px-2 py-0.5 text-xs rounded ${selectedColor.light} ${selectedColor.text} ${selectedColor.border} border`}
            >
              Aujourd'hui
            </button>
            <button 
              type="button" 
              onClick={setTomorrow}
              className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            >
              Demain
            </button>
          </div>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <ExclamationIcon className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
        
        {date && (
          <div className="mt-1.5 text-xs text-gray-500">
            {new Date(date).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Horaire
        </label>
        
        {/* Time slots - first row */}
        <div className="grid grid-cols-4 gap-2 mt-1">
          {timeSlots1.map(time => (
            <button
              key={time}
              type="button"
              onClick={() => onTimeSlotChange(time)}
              className={`py-1.5 px-1 text-xs font-medium rounded-md flex justify-center items-center ${
                timeSlot === time 
                  ? `${selectedColor.light} ${selectedColor.text} border ${selectedColor.border}`
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        
        {/* Time slots - second row */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {timeSlots2.map(time => (
            <button
              key={time}
              type="button"
              onClick={() => onTimeSlotChange(time)}
              className={`py-1.5 px-1 text-xs font-medium rounded-md flex justify-center items-center ${
                timeSlot === time 
                  ? `${selectedColor.light} ${selectedColor.text} border ${selectedColor.border}`
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;