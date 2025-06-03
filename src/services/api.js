import axios from 'axios';

const api = axios.create({
  baseURL: 'https://examen03-backend-z3v3.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de solicitud
api.interceptors.request.use(config => {
  // Excluye /cart de la autenticación
  if (!config.url.includes('/cart')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, error => Promise.reject(error));
// Interceptor de respuesta
api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;