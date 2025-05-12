import React, { useState, useMemo, useEffect } from 'react';
import { mockStagiaires, mockChambres } from '../utils/mockData';

// Importation des composants
import StagiairesList from '../components/stagiaires/StagiairesList';
import StagiaireProfile from '../components/stagiaires/StagiaireProfile';
import StagiaireStats from '../components/stagiaires/StagiaireStats';
import StagiaireHeader from '../components/stagiaires/StagiaireHeader';
import StagiaireModal from '../components/stagiaires/StagiaireModal';

const Stagiaires = () => {
  const [stagiaires, setStagiaires] = useState(mockStagiaires);
  const [filteredStagiaires, setFilteredStagiaires] = useState(mockStagiaires);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit' ou 'delete'
  const [currentStagiaire, setCurrentStagiaire] = useState(null);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const [animation, setAnimation] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [chambresDisponibles, setChambresDisponibles] = useState([]);

  // Préparation des chambres disponibles
  useEffect(() => {
    // Calculer les occupants actuels par chambre
    const occupationMap = mockChambres.reduce((acc, chambre) => {
      acc[chambre.numero] = { ...chambre, occupants: 0 };
      return acc;
    }, {});
    
    // Compter les occupants actuels (étudiants et stagiaires)
    [...stagiaires, ...mockStagiaires].forEach(occupant => {
      if (occupant.chambre && occupationMap[occupant.chambre]) {
        occupationMap[occupant.chambre].occupants += 1;
      }
    });
    
    // Convertir en tableau et filtrer les chambres qui ne sont pas pleines
    const chambres = Object.values(occupationMap).filter(
      chambre => chambre.occupants < chambre.capacite
    );
    
    setChambresDisponibles(chambres);
  }, [stagiaires]);

  // Animation de transition
  useEffect(() => {
    setAnimation(true);
    const timeout = setTimeout(() => setAnimation(false), 500);
    return () => clearTimeout(timeout);
  }, [viewMode, viewProfileId]);

  // Vérifie si un stagiaire est actif (période actuelle)
  const isStagiaireActif = (stagiaire) => {
    const now = new Date();
    const arrivee = new Date(stagiaire.dateArrivee);
    const depart = new Date(stagiaire.dateDepart);
    return now >= arrivee && now <= depart;
  };
  
  // Filtrage et tri des stagiaires
  useEffect(() => {
    let result = [...stagiaires];
    
    // Filtrage
    if (searchTerm) {
      result = result.filter(stagiaire => 
        stagiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stagiaire.chambre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stagiaire.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stagiaire.entreprise.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrage par statut et chambre
    if (selectedFilter === 'active') {
      result = result.filter(stagiaire => isStagiaireActif(stagiaire));
    } else if (selectedFilter === 'inactive') {
      result = result.filter(stagiaire => !isStagiaireActif(stagiaire));
    } else if (selectedFilter === 'withRoom') {
      result = result.filter(stagiaire => stagiaire.chambre);
    } else if (selectedFilter === 'withoutRoom') {
      result = result.filter(stagiaire => !stagiaire.chambre);
    }
    
    // Tri
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'dateArrivee') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredStagiaires(result);
    setCurrentPage(1); // Retour à la première page après filtrage
  }, [stagiaires, searchTerm, sortBy, sortOrder, selectedFilter]);

  // Pagination
  const currentStagiaires = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStagiaires.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStagiaires, currentPage]);
  
  const totalPages = Math.max(1, Math.ceil(filteredStagiaires.length / itemsPerPage));

  // Statistiques
  const stats = useMemo(() => {
    const totalStagiaires = stagiaires.length;
    const withRoom = stagiaires.filter(s => s.chambre).length;
    const withoutRoom = totalStagiaires - withRoom;
    const active = stagiaires.filter(s => isStagiaireActif(s)).length;
    
    // Calcul de la durée moyenne des stages en jours
    const averageDuration = stagiaires.length > 0 ? Math.round(
      stagiaires.reduce((acc, s) => {
        const start = new Date(s.dateArrivee);
        const end = new Date(s.dateDepart);
        const duration = (end - start) / (1000 * 60 * 60 * 24); // en jours
        return acc + duration;
      }, 0) / stagiaires.length
    ) : 0;
    
    return {
      total: totalStagiaires,
      withRoom,
      withoutRoom,
      active,
      inactive: totalStagiaires - active,
      occupancyRate: totalStagiaires ? Math.round((withRoom / totalStagiaires) * 100) : 0,
      activeRate: totalStagiaires ? Math.round((active / totalStagiaires) * 100) : 0,
      averageDuration
    };
  }, [stagiaires]);

  // Handlers pour les modals
  const handleOpenAddModal = () => {
    setModalType('add');
    setCurrentStagiaire(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (stagiaire) => {
    setModalType('edit');
    setCurrentStagiaire(stagiaire);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    const stagiaire = getStagiaireById(id);
    setModalType('delete');
    setCurrentStagiaire(stagiaire);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveStagiaire = (formData) => {
    if (modalType === 'delete') {
      // Supprimer stagiaire
      setStagiaires(stagiaires.filter(s => s.id !== formData.id));
      if (viewProfileId === formData.id) {
        setViewProfileId(null);
      }
    } else if (modalType === 'edit') {
      // Modifier stagiaire existant
      setStagiaires(stagiaires.map(s => 
        s.id === formData.id ? { ...formData } : s
      ));
    } else {
      // Ajouter nouveau stagiaire
      const newId = Math.max(...stagiaires.map(s => s.id), 0) + 1;
      setStagiaires([...stagiaires, { ...formData, id: newId }]);
    }
    
    setModalOpen(false);
  };

  const handleViewProfile = (id) => {
    setViewProfileId(id);
  };

  const getStagiaireById = (id) => {
    return stagiaires.find(stagiaire => stagiaire.id === id);
  };

  const getChambreInfo = (chambreNumero) => {
    return mockChambres.find(c => c.numero === chambreNumero) || { numero: 'Non assignée', capacite: 0 };
  };

  // Toggles du tri
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {viewProfileId ? (
        <StagiaireProfile
          stagiaire={getStagiaireById(viewProfileId)}
          chambre={getChambreInfo(getStagiaireById(viewProfileId).chambre)}
          animation={animation}
          onBack={() => setViewProfileId(null)}
          onEdit={() => handleOpenEditModal(getStagiaireById(viewProfileId))}
          onDelete={() => handleOpenDeleteModal(viewProfileId)}
        />
      ) : (
        <>
          <StagiaireHeader 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleStats={() => setIsStatsOpen(!isStatsOpen)}
            isStatsOpen={isStatsOpen}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddNew={handleOpenAddModal}
            totalCount={stagiaires.length}
          />

          {isStatsOpen && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <StagiaireStats stats={stats} />
            </div>
          )}

          <StagiairesList 
            stagiaires={currentStagiaires}
            currentPage={currentPage}
            totalPages={totalPages}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onView={handleViewProfile}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onSort={toggleSort}
            onChangePage={setCurrentPage}
            selectedFilter={selectedFilter}
            onChangeFilter={setSelectedFilter}
            viewMode={viewMode}
          />
        </>
      )}

      {/* Modal pour ajouter, modifier ou supprimer un stagiaire */}
      <StagiaireModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStagiaire}
        stagiaire={currentStagiaire}
        chambres={chambresDisponibles}
        modalType={modalType}
      />
    </div>
  );
};

export default Stagiaires;