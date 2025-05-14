import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});



export const login = async (credentials) => {
  try {
    // Try a direct request to match Laravel's route configuration
    // Option 1: Try with /api/login
    let response;
    try {
      response = await API.post('/api/auth/login', credentials);
      console.log('First attempt succeeded');
      console.log('Login response:', response);
    } catch (apiError) {
        console.error('First attempt failed:', apiError);
        throw new Error( apiError.response?.data.message || apiError);
    
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
    const response = await API.get('/api/stagiaires', { params: filters });
    return response.data;
  } catch (error) {
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
    await API.delete(`/api/stagiaires/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add similar functions for chambres and kitchen tasks