import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { XIcon, ExclamationIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { mockEtudiants } from '../../utils/mockData';

// Lazy load components for better performance
const TaskTypeSelector = lazy(() => import('./modal/TaskTypeSelector'));
const TaskDescriptionField = lazy(() => import('./modal/TaskDescriptionField'));
const DateTimeSelector = lazy(() => import('./modal/DateTimeSelector'));
const AssignmentSelector = lazy(() => import('./modal/AssignmentSelector'));
const StatusSelector = lazy(() => import('./modal/StatusSelector'));

// Constants outside component to prevent re-creation
const TYPE_CONFIG = {
  nettoyage: { icon: "✨", color: "blue" },
  préparation: { icon: "🔪", color: "purple" },
  service: { icon: "🍽️", color: "green" },
  vaisselle: { icon: "🫗", color: "cyan" },
  rangement: { icon: "📦", color: "indigo" }
};

const COLOR_CLASSES = {
  blue: {
    light: 'bg-blue-50',
    accent: 'bg-blue-500',
    text: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-600',
    ring: 'focus:ring-blue-500'
  },
  purple: {
    light: 'bg-purple-50',
    accent: 'bg-purple-500',
    text: 'text-purple-700',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-600',
    ring: 'focus:ring-purple-500'
  },
  green: {
    light: 'bg-green-50',
    accent: 'bg-green-500',
    text: 'text-green-700',
    border: 'border-green-200',
    hover: 'hover:bg-green-600',
    ring: 'focus:ring-green-500'
  },
  cyan: {
    light: 'bg-cyan-50',
    accent: 'bg-cyan-500',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    hover: 'hover:bg-cyan-600',
    ring: 'focus:ring-cyan-500'
  },
  indigo: {
    light: 'bg-indigo-50',
    accent: 'bg-indigo-500',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-600',
    ring: 'focus:ring-indigo-500'
  }
};

// Main component - dramatically simplified
const KitchenTaskModal = ({ task, isOpen, onClose, onSave }) => {
  // State declarations
  const [formData, setFormData] = useState({
    id: '',
    type: 'nettoyage',
    description: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '08:00 - 10:00',
    assignedTo: '',
    status: 'en attente'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [students, setStudents] = useState([]);
  
  // Memoized values
  const totalSteps = 3;
  const selectedTypeColor = useMemo(() => 
    COLOR_CLASSES[TYPE_CONFIG[formData.type]?.color || 'blue'], 
    [formData.type]
  );
  
  // Task initialization
  useEffect(() => {
    if (!isOpen) return;
    
    if (task?.id) {
      setFormData({
        id: task.id || '',
        type: task.type || 'nettoyage',
        description: task.description || '',
        date: task.date || new Date().toISOString().split('T')[0],
        timeSlot: task.timeSlot || '08:00 - 10:00',
        assignedTo: task.assignedTo || '',
        status: task.status || 'en attente'
      });
      setCurrentStep(0);
    } else {
      setFormData({
        id: '',
        type: 'nettoyage',
        description: '',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '08:00 - 10:00',
        assignedTo: '',
        status: 'en attente'
      });
      setCurrentStep(1);
    }
    
    // Reset errors
    setErrors({});
    setIsSubmitting(false);
    setShowSuccessIndicator(false);
    
    // Control page scrolling
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [task, isOpen]);

  useEffect(() => {
    // Fetch students once
    if (students.length === 0) {
      setStudents(mockEtudiants || []);
    }
  }, [students.length]);
  
  // Event handlers - consolidated into a single function
  const updateForm = useCallback((field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);
  
  // Step validation and navigation
  const validateStep = useCallback((step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.description.trim()) newErrors.description = 'La description est requise';
    } else if (step === 2) {
      if (!formData.date) newErrors.date = 'La date est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const goToNextStep = useCallback(() => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
  }, [currentStep, validateStep]);
  
  const goToPrevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);
  
  // Form submission handler
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    
    const allFieldsErrors = {};
    if (!formData.description.trim()) allFieldsErrors.description = 'La description est requise';
    if (!formData.date) allFieldsErrors.date = 'La date est requise';
    
    setErrors(allFieldsErrors);
    
    if (Object.keys(allFieldsErrors).length === 0) {
      setShowSuccessIndicator(true);
      
      setTimeout(() => {
        onSave(formData);
        onClose();
      }, 800);
    } else {
      setIsSubmitting(false);
    }
  }, [formData, onSave, onClose]);
  
  // If modal is closed, don't render anything
  if (!isOpen) return null;
  
  // Render the modal with lazy-loaded components
  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40" 
        onClick={onClose}
        style={{animation: 'fadeIn 200ms ease-out forwards'}}
      />
      
      {/* Modal container - reduced complexity */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="w-full max-w-lg rounded-xl bg-white shadow-xl"
          style={{
            animation: 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            willChange: 'transform',
            transformOrigin: 'bottom'
          }}
        >
          {/* Colored header strip */}
          <div className={`${selectedTypeColor.accent} h-1.5 w-full rounded-t-xl`}></div>
          
          {/* Header section */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`mr-3 rounded-xl p-2 ${selectedTypeColor.light}`}>
                  <span className="text-xl">{TYPE_CONFIG[formData.type]?.icon}</span>
                </span>
                <h3 className="text-xl font-medium text-gray-900">
                  {task?.id ? "Modifier la tâche" : "Nouvelle tâche de cuisine"}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-gray-200"
                aria-label="Fermer"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Progress indicator - only show in stepped mode */}
            {(!task?.id && currentStep !== 0) && (
              <div className="mb-6 mt-4">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Étape {currentStep}/{totalSteps}</span>
                  <span>{currentStep === 1 ? 'Détails' : currentStep === 2 ? 'Planification' : 'Assignation'}</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
                  <div 
                    className={`h-1.5 rounded-full ${selectedTypeColor.accent}`}
                    style={{ 
                      width: `${(currentStep / totalSteps) * 100}%`,
                      transition: 'width 300ms ease-in-out'
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Form content - using Suspense for lazy-loaded components */}
            <Suspense fallback={<div className="my-8 text-center">Chargement...</div>}>
              <div className="space-y-5">
                {/* Dynamic content based on current step */}
                {(task?.id || currentStep === 0 || currentStep === 1) && (
                  <>
                    <TaskTypeSelector 
                      type={formData.type}
                      onSelect={(type) => updateForm('type', type)} 
                      typeConfig={TYPE_CONFIG}
                      colorClasses={COLOR_CLASSES}
                      error={errors.type}
                    />
                    
                    <TaskDescriptionField 
                      description={formData.description}
                      onChange={(value) => updateForm('description', value)}
                      selectedColor={selectedTypeColor}
                      error={errors.description}
                    />
                  </>
                )}
                
                {(task?.id || currentStep === 0 || currentStep === 2) && (
                  <DateTimeSelector 
                    date={formData.date}
                    timeSlot={formData.timeSlot}
                    onDateChange={(date) => updateForm('date', date)}
                    onTimeSlotChange={(slot) => updateForm('timeSlot', slot)}
                    selectedColor={selectedTypeColor}
                    error={errors.date}
                  />
                )}
                
                {(task?.id || currentStep === 0 || currentStep === 3) && (
                  <AssignmentSelector 
                    assignedTo={formData.assignedTo}
                    onSelect={(id) => updateForm('assignedTo', id)}
                    selectedColor={selectedTypeColor}
                    students={students}
                  />
                )}
                
                {/* Status selector - only for editing existing tasks */}
                {task?.id && (
                  <StatusSelector 
                    status={formData.status}
                    onSelect={(status) => updateForm('status', status)}
                  />
                )}
              </div>
            </Suspense>
          </div>
          
          {/* Footer with action buttons */}
          <div className={`flex flex-col-reverse items-center gap-3 border-t p-6 sm:flex-row sm:justify-between ${selectedTypeColor.light} ${selectedTypeColor.border}`}>
            {/* Back/Cancel button */}
            <button
              type="button"
              onClick={currentStep > 1 ? goToPrevStep : onClose}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
            >
              {currentStep > 1 ? "Retour" : "Annuler"}
            </button>
            
            {/* Next/Submit button */}
            <button
              type="button"
              onClick={task?.id || currentStep === 0 || currentStep === totalSteps ? handleSubmit : goToNextStep}
              disabled={isSubmitting}
              className={`w-full rounded-lg border border-transparent px-6 py-2.5 text-sm font-medium text-white shadow-sm sm:w-auto ${selectedTypeColor.accent} ${selectedTypeColor.hover} ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
            >
              {showSuccessIndicator ? (
                <span className="flex items-center">
                  <CheckCircleIcon className="mr-1.5 h-4 w-4" />
                  {task?.id ? "Mise à jour effectuée!" : "Tâche créée!"}
                </span>
              ) : (
                <div className="flex items-center">
                  <span>
                    {task?.id || currentStep === totalSteps ? (task?.id ? "Mettre à jour" : "Créer la tâche") : "Suivant"}
                  </span>
                  
                  {!task?.id && currentStep !== totalSteps && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  
                  {isSubmitting && (
                    <svg className="ml-1.5 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default KitchenTaskModal;