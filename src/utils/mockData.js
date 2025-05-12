export const mockChambres = [
  { id: "chambre-1", numero: 'A-101', capacite: 2, statut: 'occupée', occupants: [1, 2] },
  { id: 2, numero: '102', capacite: 1, statut: 'libre', occupants: [] },
  { id: 3, numero: '103', capacite: 2, statut: 'occupée', occupants: [3] },
  { id: 4, numero: '104', capacite: 1, statut: 'occupée', occupants: [4] },
  { id: 5, numero: '201', capacite: 2, statut: 'libre', occupants: [] },
  { id: 6, numero: '202', capacite: 2, statut: 'occupée', occupants: [5, 6] },
];

export const mockEtudiants = [
  { id: 1, nom: 'Martin Dupont', chambre: '101', telephone: '0601020304', email: 'martin@email.com', dateArrivee: '2023-09-01' },
  { id: 2, nom: 'Sophie Laurent', chambre: '101', telephone: '0602030405', email: 'sophie@email.com', dateArrivee: '2023-09-01' },
  { id: 3, nom: 'Thomas Bernard', chambre: '103', telephone: '0603040506', email: 'thomas@email.com', dateArrivee: '2023-10-15' },
  { id: 5, nom: 'Camille Moreau', chambre: '202', telephone: '0605060708', email: 'camille@email.com', dateArrivee: '2024-01-10' },
];

export const mockStagiaires = [
  { id: 4, nom: 'Alexandre Petit', chambre: '104', telephone: '0604050607', email: 'alex@email.com', dateArrivee: '2024-01-05', dateDepart: '2024-06-30', entreprise: 'Tech Solutions' },
  { id: 6, nom: 'Julie Leroy', chambre: '202', telephone: '0606070809', email: 'julie@email.com', dateArrivee: '2024-02-01', dateDepart: '2024-07-31', entreprise: 'Innovate Corp' },
];

export const mockTachesCuisine = [
  { id: 1, date: '2025-05-13', creneau: 'Matin', responsable: 1, tache: 'Préparation petit-déjeuner' },
  { id: 2, date: '2025-05-13', creneau: 'Soir', responsable: 2, tache: 'Nettoyage cuisine' },
  { id: 3, date: '2025-05-14', creneau: 'Matin', responsable: 3, tache: 'Préparation petit-déjeuner' },
  { id: 4, date: '2025-05-14', creneau: 'Soir', responsable: 4, tache: 'Nettoyage cuisine' },
  { id: 5, date: '2025-05-15', creneau: 'Matin', responsable: 5, tache: 'Préparation petit-déjeuner' },
  { id: 6, date: '2025-05-15', creneau: 'Soir', responsable: 6, tache: 'Nettoyage cuisine' },
];