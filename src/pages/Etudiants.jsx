import React, { useState, useMemo, useEffect } from 'react';
import { mockEtudiants, mockChambres } from '../utils/mockData';

// Importation des composants
import EtudiantsList from '../components/etudiants/EtudiantsList';
import EtudiantProfile from '../components/etudiants/EtudiantProfile';
import EtudiantStats from '../components/etudiants/EtudiantStats';
import EtudiantHeader from '../components/etudiants/EtudiantHeader';
import AddEtudiant from '../components/etudiants/AddEtudiant';

const Etudiants = () => {
  const [etudiants, setEtudiants] = useState(mockEtudiants);
  const [filteredEtudiants, setFilteredEtudiants] = useState(mockEtudiants);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // State to toggle the Add Étudiant form
  const [currentPage, setCurrentPage] = useState(1); // Define currentPage state
  const itemsPerPage = 5;

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
  }, [etudiants, searchTerm, sortBy, sortOrder]);

  // Pagination
  const currentEtudiants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEtudiants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEtudiants, currentPage]);
  
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);

  // Handlers
  const handleAddNew = () => {
    setIsAdding(true); // Show the Add Étudiant form
    setViewProfileId(null); // Ensure no profile is being viewed
  };

  const handleCancelAdd = () => {
    setIsAdding(false); // Return to the student list
  };

  const handleSaveEtudiant = (formData) => {
    // Add new student
    const newId = Math.max(...etudiants.map(e => e.id), 0) + 1;
    setEtudiants([...etudiants, { ...formData, id: newId }]);
    setIsAdding(false); // Return to the student list
  };

  return (
    <div className="space-y-6">
      {isAdding ? (
        <AddEtudiant 
          onCancel={handleCancelAdd} // Cancel adding a new student
          onSave={handleSaveEtudiant} // Save the new student
        />
      ) : viewProfileId ? (
        <EtudiantProfile
          etudiant={etudiants.find(e => e.id === viewProfileId)}
          onBack={() => setViewProfileId(null)}
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
            onAddNew={handleAddNew} // Show the Add Étudiant form
            totalCount={etudiants.length}
          />

          {isStatsOpen && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <EtudiantStats stats={{ total: etudiants.length }} />
            </div>
          )}

          <EtudiantsList 
            etudiants={currentEtudiants}
            currentPage={currentPage}
            totalPages={totalPages}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onView={setViewProfileId}
            onSort={(field) => {
              if (sortBy === field) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy(field);
                setSortOrder('asc');
              }
            }}
            onChangePage={setCurrentPage} // Pass setCurrentPage to handle pagination
          />
        </>
      )}
    </div>
  );
};

export default Etudiants;