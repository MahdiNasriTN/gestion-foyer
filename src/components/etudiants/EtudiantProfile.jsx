import React from 'react';
import { 
  ArrowNarrowLeftIcon,
  AcademicCapIcon,
  PencilAltIcon,
  TrashIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  OfficeBuildingIcon,
  LocationMarkerIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';
import { UserCircleIcon } from '@heroicons/react/solid';

const EtudiantProfile = ({ etudiant, chambre, animation, onBack, onEdit, onDelete }) => {
  return (
    <div className={`transition-all duration-500 ${animation ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="relative h-40 bg-gradient-to-r from-blue-600 to-indigo-700">
          {/* Pattern de fond */}
          <div className="absolute inset-0 opacity-20" 
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")" }}></div>
          
          {/* Bouton retour */}
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm group"
          >
            <ArrowNarrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          </button>
          
          {/* Badge rôle */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
            <div className="flex items-center">
              <AcademicCapIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>Étudiant</span>
            </div>
          </div>
          
          {/* Silhouette de l'avatar */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-slate-800 flex items-center justify-center shadow-xl">
              {etudiant.image ? (
                <img src={etudiant.image} alt={etudiant.nom} className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="w-full h-full text-white/90" />
              )}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                <CheckCircleIcon className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">{etudiant.nom}</h2>
              <p className="text-blue-300 flex items-center mt-1">
                <LocationMarkerIcon className="h-4 w-4 mr-1.5" />
                <span>
                  {chambre.numero !== 'Non assignée' 
                    ? `Chambre ${chambre.numero}` 
                    : 'Pas de chambre assignée'}
                </span>
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2">
              <button 
                onClick={() => onEdit(etudiant)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all flex items-center"
              >
                <PencilAltIcon className="h-4 w-4 mr-2" />
                <span>Modifier</span>
              </button>
              <button 
                onClick={() => onDelete(etudiant.id)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
          
          <hr className="border-blue-900/30 my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-blue-400" />
                <span>Informations personnelles</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
                    <MailIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-300">Email</p>
                    <p className="text-white">{etudiant.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
                    <PhoneIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-300">Téléphone</p>
                    <p className="text-white">{etudiant.telephone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
                    <CalendarIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-300">Date d'arrivée</p>
                    <p className="text-white">{new Date(etudiant.dateArrivee).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <OfficeBuildingIcon className="h-5 w-5 mr-2 text-blue-400" />
                <span>Chambre</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
                    <LocationMarkerIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-300">Numéro</p>
                    <p className="text-white">{chambre.numero}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
                    <UserGroupIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-300">Capacité</p>
                    <p className="text-white">{chambre.capacite}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtudiantProfile;