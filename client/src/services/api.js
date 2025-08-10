import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      // Guardar token de autenticación en localStorage o en el estado global
      return response.data;
    } catch (error) {
      // Manejo de errores, por ejemplo, si las credenciales son incorrectas
      throw error.response.data.detail || 'Error de inicio de sesión';
    }
  },
};

export default authService;