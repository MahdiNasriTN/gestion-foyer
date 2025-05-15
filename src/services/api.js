import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
API.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Si un token existe, l'ajouter à l'en-tête d'autorisation
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs 401 (non autorisé)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si on reçoit une erreur 401, cela signifie que le token n'est plus valide
    if (error.response && error.response.status === 401) {
      // Supprimer les informations d'authentification
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Rediriger vers la page de login (si nécessaire)
      // window.location = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    // Try a direct request to match Laravel's route configuration
    let response;
    try {
      response = await API.post('/api/auth/login', credentials);
      console.log('First attempt succeeded');
      console.log('Login response:', response);
    } catch (apiError) {
      console.error('First attempt failed:', apiError);
      throw new Error(apiError.response?.data.message || apiError);
    }

    console.log('Login response:', response);
    console.log('Login response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response || error);
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    await API.post('/api/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Stagiaires endpoints
export const fetchStagiaires = async (filters = {}) => {
  try {
    // Construction des paramètres de requête à partir des filtres
    let queryParams = new URLSearchParams();
    
    // Traitement des différents filtres
    if (filters.status && filters.status !== 'all') {
      queryParams.append('status', filters.status);
    }
    
    if (filters.room && filters.room !== 'all') {
      queryParams.append('room', filters.room);
    }
    
    if (filters.specificRoom) {
      queryParams.append('specificRoom', filters.specificRoom);
    }
    
    if (filters.gender && filters.gender !== 'all') {
      queryParams.append('gender', filters.gender);
    }
    
    if (filters.session && filters.session !== 'all') {
      queryParams.append('session', filters.session);
    }
    
    if (filters.startDate) {
      queryParams.append('startDate', filters.startDate);
    }
    
    if (filters.endDate) {
      queryParams.append('endDate', filters.endDate);
    }
    
    // Construction de l'URL avec les paramètres de requête
    const queryString = queryParams.toString();
    const url = `/api/stagiaires${queryString ? `?${queryString}` : ''}`;
    
    const response = await API.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching stagiaires with filters:', error);
    throw error.response?.data || error;
  }
};

export const fetchStagiaire = async (id) => {
  try {
    const response = await API.get(`/api/stagiaires/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createStagiaire = async (data) => {
  try {
    const response = await API.post('/api/stagiaires', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateStagiaire = async (id, data) => {
  try {
    const response = await API.put(`/api/stagiaires/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteStagiaire = async (id) => {
  try {
    const response = await API.delete(`/api/stagiaires/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting stagiaire:', error);
    throw error.response?.data || error;
  }
};

// Ajouter les fonctions spécifiques pour les stagiaires internes et externes
export const createInternStagiaire = async (data) => {
  try {
    // Assurer que le type est correctement défini
    const stagiaireData = {
      ...data,
      type: 'interne',
      // Formater le nom complet
      nom: `${data.firstName} ${data.lastName}`
    };
    
    const response = await API.post('/api/stagiaires', stagiaireData);
    return response.data;
  } catch (error) {
    console.error('Error creating intern stagiaire:', error);
    throw error.response?.data || error;
  }
};

export const createExternStagiaire = async (data) => {
  try {
    // Assurer que le type est correctement défini
    const stagiaireData = {
      ...data,
      type: 'externe',
      // Formater le nom complet
      nom: `${data.firstName} ${data.lastName}`
    };
    
    const response = await API.post('/api/stagiaires', stagiaireData);
    return response.data;
  } catch (error) {
    console.error('Error creating extern stagiaire:', error);
    throw error.response?.data || error;
  }
};

// Récupérer un stagiaire par son ID
export const getStagiaireById = async (id) => {
  try {
    const response = await API.get(`/api/stagiaires/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching stagiaire by ID:', error);
    throw error.response?.data || error;
  }
};

// Add similar functions for chambres and kitchen tasks