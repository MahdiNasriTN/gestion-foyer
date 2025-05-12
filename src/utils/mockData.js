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

export const mockKitchenTasks = [
  {
    id: '1',
    type: 'nettoyage',
    description: 'Nettoyer le sol de la cuisine',
    date: '2025-05-12',
    timeSlot: '10:00 - 12:00',
    assignedTo: '101',
    assignedToName: 'Thomas Martin',
    status: 'en attente'
  },
  {
    id: '2',
    type: 'préparation',
    description: 'Préparer les légumes pour le dîner',
    date: '2025-05-12',
    timeSlot: '16:00 - 18:00',
    assignedTo: '102',
    assignedToName: 'Emma Bernard',
    status: 'en attente'
  },
  {
    id: '3',
    type: 'service',
    description: 'Servir le dîner',
    date: '2025-05-12',
    timeSlot: '18:00 - 20:00',
    assignedTo: '103',
    assignedToName: 'Lucas Dubois',
    status: 'en attente'
  },
  {
    id: '4',
    type: 'vaisselle',
    description: 'Faire la vaisselle du dîner',
    date: '2025-05-12',
    timeSlot: '20:00 - 22:00',
    assignedTo: '104',
    assignedToName: 'Sofia Petit',
    status: 'en attente'
  },
  {
    id: '5',
    type: 'nettoyage',
    description: 'Nettoyer les réfrigérateurs',
    date: '2025-05-13',
    timeSlot: '14:00 - 16:00',
    assignedTo: '',
    assignedToName: '',
    status: 'en attente'
  },
  {
    id: '6',
    type: 'rangement',
    description: 'Ranger les provisions reçues',
    date: '2025-05-13',
    timeSlot: '10:00 - 12:00',
    assignedTo: '105',
    assignedToName: 'Léo Richard',
    status: 'en attente'
  },
  {
    id: '7',
    type: 'préparation',
    description: 'Préparer les entrées du déjeuner',
    date: '2025-05-14',
    timeSlot: '08:00 - 10:00',
    assignedTo: '106',
    assignedToName: 'Camille Robert',
    status: 'en attente'
  },
  {
    id: '8',
    type: 'nettoyage',
    description: 'Nettoyer les plans de travail',
    date: '2025-05-14',
    timeSlot: '12:00 - 14:00',
    assignedTo: '107',
    assignedToName: 'Noah Simon',
    status: 'en attente'
  },
  {
    id: '9',
    type: 'service',
    description: 'Servir le petit déjeuner',
    date: '2025-05-15',
    timeSlot: '08:00 - 10:00',
    assignedTo: '108',
    assignedToName: 'Jade Leroy',
    status: 'en attente'
  },
  {
    id: '10',
    type: 'vaisselle',
    description: 'Faire la vaisselle du petit déjeuner',
    date: '2025-05-15',
    timeSlot: '10:00 - 12:00',
    assignedTo: '',
    assignedToName: '',
    status: 'en attente'
  },
  // Add more tasks as needed
];
