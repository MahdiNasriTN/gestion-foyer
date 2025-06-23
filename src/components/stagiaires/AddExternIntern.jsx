import React, { useState, useRef, useEffect } from 'react';
import { createExternStagiaire, updateStagiaire } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

const AddExternIntern = ({ onCancel, onSave, initialData = null, isEditing = false }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(initialData?.profilePhoto || null);
  const [dragActive, setDragActive] = useState(false);
  const [animatePhoto, setAnimatePhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const permissions = usePermissions();
  
  // Add this helper function to format dates for HTML inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  // Update the formData initialization:
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cinNumber: '',
    dateOfBirth: '',
    placeOfBirth: '',
    assignedCenter: '',
    specialization: '',
    cycle: '', // Add cycle field
    sessionYear: new Date().getFullYear().toString(), // Add sessionYear field
    groupNumber: '',
    trainingPeriodFrom: '',
    trainingPeriodTo: '',
    email: '',
    phoneNumber: '',
    profilePhoto: null,
    sexe: 'garcon',
    // UPDATED: Change field name from carteHebergement to carteRestauration
    carteRestauration: 'non', // Default to 'non'
    // Payment fields for restauration only
    restauration: false,
    restaurationStatus: 'payé',
    restaurationSemester1: '',
    restaurationSemester2: '',
    restaurationSemester3: '',
  });

  // Add useEffect to handle data initialization for editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        ...initialData,
        // Format dates for HTML date inputs
        dateOfBirth: formatDateForInput(initialData.dateOfBirth),
        trainingPeriodFrom: formatDateForInput(initialData.trainingPeriodFrom),
        trainingPeriodTo: formatDateForInput(initialData.trainingPeriodTo),
        // Handle other fields that might need formatting
        assignedCenter: initialData.assignedCenter || initialData.entreprise || '',
        sexe: initialData.sexe || 'garcon',
        profilePhoto: initialData.profilePhoto || null,
        cycle: initialData.cycle || '', // Handle cycle
        sessionYear: initialData.sessionYear || new Date().getFullYear().toString(), // Handle sessionYear
        
        // UPDATED: Handle carteRestauration instead of carteHebergement
        carteRestauration: initialData.carteRestauration || initialData.carteHebergement || 'non',
        
        // Handle payment data if it exists
        ...(initialData.payment && {
          restauration: initialData.payment.restauration?.enabled || false,
          restaurationStatus: initialData.payment.restauration?.status || 'payé',
          restaurationSemester1: initialData.payment.restauration?.semester1Price ? initialData.payment.restauration.semester1Price.toString() : '',
          restaurationSemester2: initialData.payment.restauration?.semester2Price ? initialData.payment.restauration.semester2Price.toString() : '',
          restaurationSemester3: initialData.payment.restauration?.semester3Price ? initialData.payment.restauration.semester3Price.toString() : '',
        })
      });
      
      // Set preview image if it exists
      if (initialData.profilePhoto) {
        setPreviewImage(initialData.profilePhoto);
      }
    }
  }, [isEditing, initialData]);

  // Animation d'entrée pour la photo
  useEffect(() => {
    setTimeout(() => setAnimatePhoto(true), 300);
  }, []);

  // Update the handleChange function:
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cinNumber') {
      // CIN validation: only digits, max 8 characters
      const cleanValue = value.replace(/\D/g, ''); // Remove non-digits
      if (cleanValue.length <= 8) {
        setFormData({ ...formData, [name]: cleanValue });
      }
      // Don't update if more than 8 digits
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Gestionnaires pour la photo de profil
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };
  
  const handleFileUpload = (file) => {
    if (file && file.type.substring(0, 5) === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({
      ...prev,
      profilePhoto: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.cinNumber) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // CIN validation
    if (formData.cinNumber.length !== 8) {
      setError('Le numéro CIN doit contenir exactement 8 chiffres.');
      return;
    }

    setLoading(true);
    setError(null);

    console.log('Form data being submitted:', formData);

    try {
      let response;

      // UPDATED: Include carteRestauration in submission data
      const submissionData = {
        ...formData,
        sexe: formData.sexe || 'garcon',
        email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@example.com`,
        dateArrivee: formData.trainingPeriodFrom,
        dateDepart: formData.trainingPeriodTo,
        entreprise: formData.assignedCenter,
        type: 'externe',
        cycle: formData.cycle, // Include cycle
        sessionYear: formData.sessionYear, // Include sessionYear
        nationality: 'Tunisienne',
        currentSituation: 'Stagiaire Externe',
        
        // UPDATED: Include carteRestauration field
        carteRestauration: formData.carteRestauration,
        
        // Add payment structure for restauration only
        payment: {
          restauration: {
            enabled: formData.restauration,
            status: formData.restaurationStatus || 'payé',
            semester1Price: parseFloat(formData.restaurationSemester1) || 0,
            semester2Price: parseFloat(formData.restaurationSemester2) || 0,
            semester3Price: parseFloat(formData.restaurationSemester3) || 0
          }
        }
      };

      // Remove flat payment fields
      delete submissionData.restauration;
      delete submissionData.restaurationStatus;
      delete submissionData.restaurationSemester1;
      delete submissionData.restaurationSemester2;
      delete submissionData.restaurationSemester3;

      console.log('Submission data:', submissionData);

      if (isEditing) {
        response = await updateStagiaire(initialData._id, submissionData);
      } else {
        response = await createExternStagiaire(submissionData);
      }

      console.log('Response:', response);

      setLoading(false);
      
      if (response && response.data) {
        if (onSave) {
          onSave(response.data.stagiaire || response.data);
        }
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (err) {
      setLoading(false);
      console.error("Erreur lors de l'enregistrement:", err);
      setError(err.response?.data?.message || err.message || "Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  // Vérifications des permissions
  if (!permissions.canCreate && !initialData) {
    return (
      <div className="bg-gradient-to-br from-white to-indigo-50/50 shadow-xl rounded-2xl p-8 max-w-full mx-auto my-4 w-[98%]">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès Restreint</h3>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour ajouter des stagiaires externes.</p>
          <button
            onClick={() => onCancel ? onCancel() : navigate('/stagiaires')}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!permissions.canEdit && initialData) {
    return (
      <div className="bg-gradient-to-br from-white to-indigo-50/50 shadow-xl rounded-2xl p-8 max-w-full mx-auto my-4 w-[98%]">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Mode Lecture Seule</h3>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour modifier les stagiaires externes.</p>
          <button
            onClick={() => onCancel ? onCancel() : navigate('/stagiaires')}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Updated styling classes with new premium color scheme
  const inputClass = "mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all duration-200 ease-in-out";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionHeaderClass = "text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-200 flex items-center gap-2";
  const sectionClass = "bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8";

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Generate options for 5 years back and 5 years forward
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      years.push(
        <option key={year} value={year.toString()}>
          {year}
        </option>
      );
    }
    
    return years;
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/50 shadow-xl rounded-2xl p-8 max-w-full mx-auto my-4 w-[98%]">
      {/* Back Button - Add this at the top */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel(); // Use the onCancel prop if provided
            } else {
              navigate('/stagiaires'); // Fallback to navigation
            }
          }}
          className="group inline-flex items-center px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-700 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-indigo-200"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux stagiaires
        </button>
      </div>

      <h2 className="text-4xl font-bold text-indigo-900 mb-10 text-center flex items-center justify-center">
        <span className="bg-indigo-100 p-3 rounded-full mr-4 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
        </span>
        <span className="bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
          {isEditing ? 'Modifier un Stagiaire Externe' : 'Ajouter un Stagiaire Externe'}
        </span>
      </h2>
      
      {/* Add error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <p className="font-medium">Erreur</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo de profil - SECTION PREMIUM */}
        <div className={`${sectionClass} relative overflow-hidden bg-gradient-to-br from-white to-indigo-50/50`}>
          {/* Éléments décoratifs de fond */}
          <div className="absolute w-64 h-64 rounded-full bg-indigo-50 -top-20 -right-20 opacity-50"></div>
          <div className="absolute w-40 h-40 rounded-full bg-purple-50 -bottom-10 -left-10 opacity-50"></div>
          
          <h3 className={sectionHeaderClass}>
            <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg">📷</span>
            Photo de Profil
          </h3>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Zone de téléchargement premium */}
            <div 
              className={`
                transition-all duration-500 ease-out transform
                ${animatePhoto ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
              `}
            >
              <div 
                className={`
                  relative w-60 h-60 mx-auto overflow-hidden rounded-xl shadow-2xl
                  transition-all duration-300 ease-out cursor-pointer
                  ${dragActive ? 'ring-4 ring-indigo-500/50 scale-[1.02]' : 'hover:scale-[1.01]'}
                  ${previewImage ? '' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-300'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={!previewImage ? triggerFileSelect : undefined}
              >
                {/* Fond avec effet de morphisme de verre quand pas d'image */}
                {!previewImage && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
                )}
                
                {/* Aperçu de l'image */}
                {previewImage ? (
                  <>
                    <img 
                      src={previewImage} 
                      alt="Aperçu" 
                      className="h-full w-full object-cover transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <div className="space-x-2">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerFileSelect();
                          }}
                          className="px-3 py-2 bg-white text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors shadow-lg"
                        >
                          Modifier
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-lg"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 relative z-10">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <h4 className="text-indigo-800 font-bold mb-1">Ajouter une photo</h4>
                    <p className="text-indigo-600/70 mb-4 text-sm">Glisser & déposer ou cliquer pour sélectionner</p>
                    <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors inline-flex items-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Parcourir
                    </span>
                  </div>
                )}
                
                {/* Input file caché */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              
              {/* Badge premium de qualité d'image */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-xs text-white px-2 py-1 rounded-full shadow-lg">
                PHOTO
              </div>
            </div>
            
            {/* Conseils et informations */}
            <div className={`
              flex-1 space-y-4 transition-all duration-500 ease-out transform
              ${animatePhoto ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
              delay-100
            `}>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100 shadow-inner">
                <h4 className="text-indigo-800 font-bold flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Conseils pour une photo parfaite
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-indigo-800">Utilisez une photo professionnelle récente</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-indigo-800">Assurez-vous que votre visage est bien visible</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-indigo-800">Choisissez un fond neutre et bien éclairé</span>
                  </li>
                </ul>
              </div>
              
              {/* Formats acceptés */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-md">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Formats acceptés :</span> JPG, PNG, WEBP
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Taille maximale :</span> 5 MB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className={`${sectionClass} bg-gradient-to-br from-white to-indigo-50/30`}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg">👤</span>
            Informations Personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Prénom"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nom"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="sexe" className={labelClass}>
                Genre *
              </label>
              <select
                id="sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="garcon">👦 Garçon</option>
                <option value="fille">👧 Fille</option>
              </select>
            </div>
            <div>
              <label htmlFor="cinNumber" className={labelClass}>
                Numéro CIN
              </label>
              <input
                type="text"
                id="cinNumber"
                name="cinNumber"
                value={formData.cinNumber}
                onChange={handleChange}
                placeholder="12345678"
                maxLength="8"
                pattern="[0-9]{8}"
                title="Le numéro CIN doit contenir exactement 8 chiffres"
                required
                className={inputClass}
              />
              {/* Add validation feedback */}
              {formData.cinNumber && formData.cinNumber.length < 8 && (
                <p className="mt-1 text-sm text-amber-600">
                  Le CIN doit contenir 8 chiffres ({formData.cinNumber.length}/8)
                </p>
              )}
              {formData.cinNumber && formData.cinNumber.length === 8 && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  CIN valide
                </p>
              )}
            </div>
            <div>
              <label htmlFor="dateOfBirth" className={labelClass}>
                Date de naissance
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="placeOfBirth" className={labelClass}>
                Lieu de naissance
              </label>
              <input
                type="text"
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                placeholder="Lieu de naissance"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className={labelClass}>
                Numéro de téléphone
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Numéro de téléphone"
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Training Information Section */}
        <div className={`${sectionClass} bg-gradient-to-br from-white to-indigo-50/30`}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-purple-100 text-purple-700 p-1.5 rounded-lg">🎓</span>
            Informations de Formation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="assignedCenter" className={labelClass}>
                Centre de formation
              </label>
              <input
                type="text"
                id="assignedCenter"
                name="assignedCenter"
                value={formData.assignedCenter}
                onChange={handleChange}
                placeholder="Centre assigné"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="specialization" className={labelClass}>
                Spécialisation
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Spécialisation"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="groupNumber" className={labelClass}>
                Numéro de groupe
              </label>
              <input
                type="text"
                id="groupNumber"
                name="groupNumber"
                value={formData.groupNumber}
                onChange={handleChange}
                placeholder="Numéro de groupe"
                required
                className={inputClass}
              />
            </div>

            {/* NEW: Add Session and Year fields - spans full width */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label htmlFor="cycle" className={labelClass}>
                  Session
                </label>
                <select
                  id="cycle"
                  name="cycle"
                  value={formData.cycle}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Sélectionnez une session</option>
                  <option value="sep">Septembre</option>
                  <option value="nov">Novembre</option>
                  <option value="fev">Février</option>
                </select>
              </div>
              <div>
                <label htmlFor="sessionYear" className={labelClass}>
                  Année de session
                </label>
                <select
                  id="sessionYear"
                  name="sessionYear"
                  value={formData.sessionYear}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Sélectionnez une année</option>
                  {generateYearOptions()}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="trainingPeriodFrom" className={labelClass}>
                Début de formation ou stage
              </label>
              <input
                type="date"
                id="trainingPeriodFrom"
                name="trainingPeriodFrom"
                value={formData.trainingPeriodFrom}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="trainingPeriodTo" className={labelClass}>
                Fin de formation ou stage
              </label>
              <input
                type="date"
                id="trainingPeriodTo"
                name="trainingPeriodTo"
                value={formData.trainingPeriodTo}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Add a new section for Carte d'hébergement before payment section */}
        <div className={`${sectionClass} bg-gradient-to-br from-white to-orange-50/30`}>
          <h3 className={sectionHeaderClass}>
              <span className="bg-orange-100 text-orange-700 p-1.5 rounded-lg">🍽️</span>
              Carte de Restauration
          </h3>
          
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-6">
                  <span className="text-lg font-medium text-gray-700">Le stagiaire externe a-t-il une carte de restauration ?</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                          type="radio"
                          name="carteRestauration"
                          value="oui"
                          checked={formData.carteRestauration === 'oui'}
                          onChange={(e) => {
                              setFormData({
                                  ...formData,
                                  carteRestauration: e.target.value
                              });
                          }}
                          className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">✅ Oui</span>
                    </label>
                    <label className="flex items-center">
                      <input
                          type="radio"
                          name="carteRestauration"
                          value="non"
                          checked={formData.carteRestauration === 'non'}
                          onChange={(e) => {
                              setFormData({
                                  ...formData,
                                  carteRestauration: e.target.value
                              });
                          }}
                          className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">❌ Non</span>
                    </label>
                  </div>
              </div>
              
              {/* UPDATED: Change explanation text */}
              <div className="mt-3 text-sm text-gray-600">
                  <p>ℹ️ La carte de restauration permet l'accès aux services de restauration du centre.</p>
              </div>
          </div>
        </div>

        {/* Add Payment Information Section for External Stagiaires */}
        <div className={`${sectionClass} bg-gradient-to-br from-white to-green-50/30`}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">💰</span>
            Informations de Paiement
          </h3>
          
          <div className="space-y-6">
            {/* Restauration Only for External Stagiaires */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="restauration"
                  name="restauration"
                  checked={formData.restauration}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      restauration: e.target.checked
                    });
                  }}
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="restauration" className="ml-3 text-lg font-medium text-gray-700">
                  Restauration
                </label>
              </div>
              
              {formData.restauration && (
                <div className="ml-7 space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      🍽️ Restauration
                    </h4>
                    
                    {/* Status Selection */}
                    <div className="flex space-x-4 mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="restaurationStatus"
                          value="payé"
                          checked={formData.restaurationStatus === 'payé'}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              restaurationStatus: e.target.value
                            });
                          }}
                          className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Payé</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="restaurationStatus"
                          value="dispensé"
                          checked={formData.restaurationStatus === 'dispensé'}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              restaurationStatus: e.target.value
                            });
                          }}
                          className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Dispensé</span>
                      </label>
                    </div>
                    
                    {/* Price Inputs */}
                    {formData.restaurationStatus === 'payé' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="restaurationTrimestre1" className={labelClass}>
                              Trimestre 1 (DT)
                            </label>
                            <input
                              type="number"
                              id="restaurationTrimestre1"
                              name="restaurationSemester1"
                              value={formData.restaurationSemester1}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  restaurationSemester1: e.target.value
                                });
                              }}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label htmlFor="restaurationTrimestre2" className={labelClass}>
                              Trimestre 2 (DT)
                            </label>
                            <input
                              type="number"
                              id="restaurationTrimestre2"
                              name="restaurationSemester2"
                              value={formData.restaurationSemester2}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  restaurationSemester2: e.target.value
                                });
                              }}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label htmlFor="restaurationTrimestre3" className={labelClass}>
                              Trimestre 3 (DT)
                            </label>
                            <input
                              type="number"
                              id="restaurationTrimestre3"
                              name="restaurationSemester3"
                              value={formData.restaurationSemester3}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  restaurationSemester3: e.target.value
                                });
                              }}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              className={inputClass}
                            />
                          </div>
                        </div>
                        
                        {/* Total Summary */}
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-emerald-700">Total Restauration:</span>
                            <span className="font-bold text-emerald-800">
                              {((parseFloat(formData.restaurationSemester1) || 0) + 
                                (parseFloat(formData.restaurationSemester2) || 0) + 
                                (parseFloat(formData.restaurationSemester3) || 0)).toFixed(2)} DT
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            {formData.restauration && (
              <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                <h4 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Résumé des Paiements
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-emerald-100">
                    <span className="text-sm font-medium text-gray-700">
                      🍽️ Restauration ({formData.restaurationStatus}):
                    </span>
                    <span className="font-semibold text-blue-700">
                      {formData.restaurationStatus === 'payé' 
                        ? `${((parseFloat(formData.restaurationSemester1) || 0) + 
                             (parseFloat(formData.restaurationSemester2) || 0) + 
                             (parseFloat(formData.restaurationSemester3) || 0)).toFixed(2)} DT`
                        : 'Dispensé'
                      }
                    </span>
                  </div>
                  
                  <div className="border-t border-emerald-200 pt-3 mt-3">
                    <div className="flex justify-between items-center py-2 px-3 bg-emerald-100 rounded-md">
                      <span className="font-bold text-emerald-800">Total à payer:</span>
                      <span className="font-bold text-lg text-emerald-800">
                        {formData.restaurationStatus === 'payé' 
                          ? `${((parseFloat(formData.restaurationSemester1) || 0) + 
                               (parseFloat(formData.restaurationSemester2) || 0) + 
                               (parseFloat(formData.restaurationSemester3) || 0)).toFixed(2)} DT`
                          : '0.00 DT'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons with premium styling */}
        <div className="flex justify-between items-center pt-6 border-t-2 border-indigo-100">
          <button
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                navigate('/stagiaires');
              }
            }}
            disabled={loading}
            className="group inline-flex items-center px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-700 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-indigo-200 disabled:opacity-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux stagiaires
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExternIntern;