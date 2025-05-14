import React, { useState, useMemo, useEffect } from 'react';
import { mockStagiaires, mockChambres } from '../utils/mockData';

// Importation des composants
import StagiairesList from '../components/stagiaires/StagiairesList';
import StagiaireProfile from '../components/stagiaires/StagiaireProfile';
import StagiaireStats from '../components/stagiaires/StagiaireStats';
import StagiaireHeader from '../components/stagiaires/StagiaireHeader';
import StagiaireModal from '../components/stagiaires/StagiaireModal';
import AddIntern from '../components/stagiaires/AddIntern';
import AddExternIntern from '../components/stagiaires/AddExternIntern';

const Stagiaires = () => {
  const [stagiaires, setStagiaires] = useState(mockStagiaires);
  const [filteredStagiaires, setFilteredStagiaires] = useState(mockStagiaires);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentStagiaire, setCurrentStagiaire] = useState(null);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('list');
  const [animation, setAnimation] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [chambresDisponibles, setChambresDisponibles] = useState([]);
  const [isAddingIntern, setIsAddingIntern] = useState(false);
  const [isAddingExtern, setIsAddingExtern] = useState(false);

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

  // Fonction pour gérer l'ajout d'un stagiaire interne
  const handleAddIntern = () => {
    setIsAddingIntern(true);
    setIsAddingExtern(false);
  };

  // Fonction pour gérer l'ajout d'un stagiaire externe
  const handleAddExtern = () => {
    setIsAddingExtern(true);
    setIsAddingIntern(false);
  };
  
  // Fonction pour annuler l'ajout d'un stagiaire
  const handleCancelAdd = () => {
    setIsAddingIntern(false);
    setIsAddingExtern(false);
    setCurrentStagiaire(null); // Réinitialiser le stagiaire en cours d'édition
  };
  
  // Fonction pour sauvegarder un nouveau stagiaire interne
  const handleSaveIntern = (formData) => {
    if (currentStagiaire) {
      // Mode édition : mettre à jour un stagiaire existant
      const updatedStagiaire = {
        ...currentStagiaire,
        ...formData,
        nom: `${formData.firstName} ${formData.lastName}`,
        type: 'interne'
      };
      
      setStagiaires(prev => prev.map(s => 
        s.id === currentStagiaire.id ? updatedStagiaire : s
      ));
    } else {
      // Mode ajout : créer un nouveau stagiaire
      const newId = Math.max(...stagiaires.map(s => s.id), 0) + 1;
      const newStagiaire = { 
        ...formData, 
        id: newId, 
        type: 'interne',
        nom: `${formData.firstName} ${formData.lastName}`
      };
      setStagiaires([...stagiaires, newStagiaire]);
    }
    
    // Réinitialiser les états
    setIsAddingIntern(false);
    setCurrentStagiaire(null);
  };

  // Fonction pour sauvegarder un nouveau stagiaire externe
  const handleSaveExtern = (formData) => {
    if (currentStagiaire) {
      // Mode édition : mettre à jour un stagiaire existant
      const updatedStagiaire = {
        ...currentStagiaire,
        ...formData,
        nom: `${formData.firstName} ${formData.lastName}`,
        type: 'externe'
      };
      
      setStagiaires(prev => prev.map(s => 
        s.id === currentStagiaire.id ? updatedStagiaire : s
      ));
    } else {
      // Mode ajout : créer un nouveau stagiaire
      const newId = Math.max(...stagiaires.map(s => s.id), 0) + 1;
      const newStagiaire = { 
        ...formData, 
        id: newId, 
        type: 'externe',
        nom: `${formData.firstName} ${formData.lastName}`
      };
      setStagiaires([...stagiaires, newStagiaire]);
    }
    
    // Réinitialiser les états
    setIsAddingExtern(false);
    setCurrentStagiaire(null);
  };

  // Ajoutez ces fonctions dans votre composant Stagiaires
  const handleAddExternIntern = (externData) => {
    // Créer un nouvel objet stagiaire externe avec les données du formulaire
    const newStagiaire = {
      id: Math.max(0, ...stagiaires.map(s => s.id)) + 1, // Générer un nouvel ID
      nom: `${externData.firstName} ${externData.lastName}`,
      firstName: externData.firstName,
      lastName: externData.lastName,
      chambre: null, // Généralement pas de chambre assignée immédiatement
      telephone: externData.phoneNumber || '',
      email: externData.email || `${externData.firstName.toLowerCase()}.${externData.lastName.toLowerCase()}@example.com`,
      dateArrivee: externData.trainingPeriodFrom,
      dateDepart: externData.trainingPeriodTo,
      entreprise: externData.assignedCenter,
      type: 'externe', // Marquer comme stagiaire externe
      avatar: externData.profilePhoto,
      cinNumber: externData.cinNumber,
      dateOfBirth: externData.dateOfBirth,
      placeOfBirth: externData.placeOfBirth,
      assignedCenter: externData.assignedCenter,
      specialization: externData.specialization,
      groupNumber: externData.groupNumber,
      trainingPeriodFrom: externData.trainingPeriodFrom,
      trainingPeriodTo: externData.trainingPeriodTo
    };

    // Ajouter le nouveau stagiaire externe à la liste
    setStagiaires(prevStagiaires => [...prevStagiaires, newStagiaire]);
    setModalOpen(false);
    

  };

  const handleUpdateStagiaire = (updatedData) => {
    // Vérifier si c'est un stagiaire interne ou externe
    const isIntern = currentStagiaire.type === 'interne';
    
    // Mettre à jour le stagiaire avec les nouvelles données
    const updatedStagiaire = {
      ...currentStagiaire,
      nom: `${updatedData.firstName} ${updatedData.lastName}`,
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      email: updatedData.email || currentStagiaire.email,
      telephone: updatedData.phoneNumber || updatedData.fatherPhone || currentStagiaire.telephone,
      dateArrivee: updatedData.trainingPeriodFrom,
      dateDepart: updatedData.trainingPeriodTo,
      avatar: updatedData.profilePhoto,
      // Données communes pour les deux types
      cinNumber: updatedData.cinNumber,
      dateOfBirth: updatedData.dateOfBirth,
      placeOfBirth: updatedData.placeOfBirth,
      specialization: updatedData.specialization,
      
      // Si c'est un stagiaire interne, mettre à jour les champs spécifiques
      ...(isIntern ? {
        nationality: updatedData.nationality,
        currentSituation: updatedData.currentSituation,
        cinPlace: updatedData.cinPlace,
        cinDate: updatedData.cinDate,
        phoneNumber: updatedData.phoneNumber,
        sendingAddress: updatedData.sendingAddress,
        city: updatedData.city,
        postalCode: updatedData.postalCode,
        centerName: updatedData.centerName,
        cycle: updatedData.cycle,
        fatherFirstName: updatedData.fatherFirstName,
        fatherLastName: updatedData.fatherLastName,
        fatherPhone: updatedData.fatherPhone,
        fatherJob: updatedData.fatherJob,
        fatherJobPlace: updatedData.fatherJobPlace,
        motherFirstName: updatedData.motherFirstName,
        motherLastName: updatedData.motherLastName,
        motherPhone: updatedData.motherPhone,
        motherJob: updatedData.motherJob,
        motherJobPlace: updatedData.motherJobPlace,
        numberOfBrothers: updatedData.numberOfBrothers,
        numberOfSisters: updatedData.numberOfSisters,
        hobby: updatedData.hobby,
        entreprise: updatedData.centerName,
      } : {
        // Si c'est un stagiaire externe, mettre à jour les champs spécifiques
        assignedCenter: updatedData.assignedCenter,
        groupNumber: updatedData.groupNumber,
        entreprise: updatedData.assignedCenter,
      }),
    };

    // Mettre à jour la liste des stagiaires
    setStagiaires(prevStagiaires => 
      prevStagiaires.map(stagiaire => 
        stagiaire.id === currentStagiaire.id ? updatedStagiaire : stagiaire
      )
    );
    
    setModalOpen(false);
    
  };

  // Modifiez la fonction handleEdit pour qu'elle affecte l'état d'affichage directement
  const handleEdit = (stagiaire) => {
    setCurrentStagiaire(stagiaire);
    
    // Si c'est un stagiaire externe, afficher AddExternIntern, sinon AddIntern
    if (stagiaire.type === 'externe') {
      setIsAddingExtern(true);
      setIsAddingIntern(false);
    } else {
      setIsAddingIntern(true);
      setIsAddingExtern(false);
    }
    
    // Désactiver l'affichage du profil si actif
    setViewProfileId(null);
  };

  return (
    <div className="space-y-6">
      {isAddingIntern && !viewProfileId ? (
        <AddIntern 
          onCancel={handleCancelAdd}
          onSave={handleSaveIntern}
          initialData={currentStagiaire} // Passer les données existantes pour l'édition
          isEditing={currentStagiaire !== null} // Indiquer si c'est une édition
        />
      ) : isAddingExtern && !viewProfileId ? (
        <AddExternIntern
          onCancel={handleCancelAdd}
          onSave={handleSaveExtern}
          initialData={currentStagiaire} // Passer les données existantes pour l'édition
          isEditing={currentStagiaire !== null} // Indiquer si c'est une édition
        />
      ) : viewProfileId ? (
        // Affichage du profil reste inchangé
        <StagiaireProfile
          stagiaire={getStagiaireById(viewProfileId)}
          chambre={getChambreInfo(getStagiaireById(viewProfileId).chambre)}
          animation={animation}
          onBack={() => setViewProfileId(null)}
          onEdit={() => handleEdit(getStagiaireById(viewProfileId))} // Utilisation de handleEdit ici aussi
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
            onAddNew={handleAddIntern}
            onAddExtern={handleAddExtern}
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
            onEdit={handleEdit} // <-- CORRECTION ICI
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
      {modalOpen && modalType === 'delete' && (
        <StagiaireModal
          onClose={() => setModalOpen(false)}
          title="Supprimer un stagiaire"
        >
          {/* Contenu pour la suppression */}
        </StagiaireModal>
      )}
    </div>
  );
};

export default Stagiaires;