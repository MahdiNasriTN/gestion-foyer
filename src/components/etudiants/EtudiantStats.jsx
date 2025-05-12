import React from 'react';
import { 
  UserIcon, 
  OfficeBuildingIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/outline';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${color} rounded-xl shadow-lg border border-white/10`}>
    <div className="absolute top-0 right-0 opacity-10">
      <div className="transform translate-x-1/3 -translate-y-1/3">
        {icon}
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-sm font-medium text-white/80">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  </div>
);

const EtudiantStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Étudiants" 
        value={stats.total} 
        icon={<UserIcon className="h-12 w-12 text-white" />} 
        color="from-blue-500 to-indigo-600" 
      />
      <StatCard 
        title="Avec Chambre" 
        value={stats.withRoom} 
        icon={<OfficeBuildingIcon className="h-12 w-12 text-white" />} 
        color="from-green-500 to-teal-600" 
      />
      <StatCard 
        title="Sans Chambre" 
        value={stats.withoutRoom} 
        icon={<ExclamationCircleIcon className="h-12 w-12 text-white" />} 
        color="from-red-500 to-pink-600" 
      />
      <StatCard 
        title="Taux d'Occupation" 
        value={`${stats.occupancyRate}%`} 
        icon={<CheckCircleIcon className="h-12 w-12 text-white" />} 
        color="from-yellow-500 to-orange-600" 
      />
    </div>
  );
};

export default EtudiantStats;