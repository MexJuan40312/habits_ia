// client/src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error de inicio de sesión';
    }
  },
  validateToken: async (token) => {
    try {
      const response = await api.get('/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Token inválido';
    }
  },
};

const habitsService = {
  getHabits: async () => {
    try {
      const response = await api.get(`/habits/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al obtener los hábitos';
    }
  },

  createHabit: async (habitData) => {
    try {
      const response = await api.post('/habits/', habitData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al crear el hábito';
    }
  },

  deleteHabit: async (habitId) => {
    try {
      const response = await api.delete(`/habits/${habitId}/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al eliminar el hábito';
    }
  },
};

const aiService = {
  generateText: async (prompt) => {
    try {
      const res = await api.post("/ai/generate_text/", { prompt });
      return res.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al generar texto';
    }
  }
};

export { authService, habitsService, aiService };