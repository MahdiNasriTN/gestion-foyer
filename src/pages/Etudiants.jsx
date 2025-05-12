import React, { useState, useMemo, useEffect } from 'react';
import { mockEtudiants, mockChambres } from '../utils/mockData';

// Importation des composants
import EtudiantsList from '../components/etudiants/EtudiantsList';
import EtudiantProfile from '../components/etudiants/EtudiantProfile';
import EtudiantStats from '../components/etudiants/EtudiantStats';
import EtudiantHeader from '../components/etudiants/EtudiantHeader';
import EtudiantModal from '../components/etudiants/EtudiantModal';

const Etudiants = () => {
  const [etudiants, setEtudiants] = useState(mockEtudiants);
  const [filteredEtudiants, setFilteredEtudiants] = useState(mockEtudiants);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit' ou 'delete'
  const [currentEtudiant, setCurrentEtudiant] = useState(null);
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
    
    // Compter les occupants actuels
    etudiants.forEach(etudiant => {
      if (etudiant.chambre && occupationMap[etudiant.chambre]) {
        occupationMap[etudiant.chambre].occupants += 1;
      }
    });
    
    // Convertir en tableau et filtrer les chambres qui ne sont pas pleines
    const chambres = Object.values(occupationMap).filter(
      chambre => chambre.occupants < chambre.capacite
    );
    
    setChambresDisponibles(chambres);
  }, [etudiants]);

  // Animation de transition
  useEffect(() => {
    setAnimation(true);
    const timeout = setTimeout(() => setAnimation(false), 500);
    return () => clearTimeout(timeout);
  }, [viewMode, viewProfileId]);

  // Filtrage et tri des étudiants
  useEffect(() => {
    let result = [...etudiants];
    
    // Filtrage
    if (searchTerm) {
      result = result.filter(etudiant => 
        etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etudiant.chambre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etudiant.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrage par statut
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'withRoom') {
        result = result.filter(etudiant => etudiant.chambre);
      } else if (selectedFilter === 'withoutRoom') {
        result = result.filter(etudiant => !etudiant.chambre);
      }
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
    
    setFilteredEtudiants(result);
    setCurrentPage(1); // Retour à la première page après filtrage
  }, [etudiants, searchTerm, sortBy, sortOrder, selectedFilter]);

  // Pagination
  const currentEtudiants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEtudiants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEtudiants, currentPage]);
  
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);

  // Statistiques
  const stats = useMemo(() => {
    const totalStudents = etudiants.length;
    const withRoom = etudiants.filter(e => e.chambre).length;
    const withoutRoom = totalStudents - withRoom;
    
    return {
      total: totalStudents,
      withRoom,
      withoutRoom,
      occupancyRate: totalStudents ? Math.round((withRoom / totalStudents) * 100) : 0
    };
  }, [etudiants]);

  // Handlers
  const handleOpenAddModal = () => {
    setModalType('add');
    setCurrentEtudiant(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (etudiant) => {
    setModalType('edit');
    setCurrentEtudiant(etudiant);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    const etudiant = getEtudiantById(id);
    setModalType('delete');
    setCurrentEtudiant(etudiant);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveEtudiant = (formData) => {
    if (modalType === 'delete') {
      // Delete student
      setEtudiants(etudiants.filter(e => e.id !== formData.id));
      if (viewProfileId === formData.id) {
        setViewProfileId(null);
      }
    } else if (modalType === 'edit') {
      // Edit existing student
      setEtudiants(etudiants.map(e => 
        e.id === formData.id ? { ...formData } : e
      ));
    } else {
      // Add new student
      const newId = Math.max(...etudiants.map(e => e.id), 0) + 1;
      setEtudiants([...etudiants, { ...formData, id: newId }]);
    }
    
    setModalOpen(false);
  };

  const handleViewProfile = (id) => {
    setViewProfileId(id);
  };

  const getEtudiantById = (id) => {
    return etudiants.find(etudiant => etudiant.id === id);
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
        <EtudiantProfile
          etudiant={getEtudiantById(viewProfileId)}
          chambre={getChambreInfo(getEtudiantById(viewProfileId).chambre)}
          animation={animation}
          onBack={() => setViewProfileId(null)}
          onEdit={() => handleOpenEditModal(getEtudiantById(viewProfileId))}
          onDelete={() => handleOpenDeleteModal(viewProfileId)}
        />
      ) : (
        <>
          <EtudiantHeader 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleStats={() => setIsStatsOpen(!isStatsOpen)}
            isStatsOpen={isStatsOpen}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddNew={handleOpenAddModal}
            totalCount={etudiants.length}
          />

          {isStatsOpen && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <EtudiantStats stats={stats} />
            </div>
          )}

          <EtudiantsList 
            etudiants={currentEtudiants}
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

      {/* Modal pour ajouter, modifier ou supprimer un étudiant */}
      <EtudiantModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEtudiant}
        etudiant={currentEtudiant}
        chambres={chambresDisponibles}
        modalType={modalType}
      />
    </div>
  );
};

export default Etudiants;