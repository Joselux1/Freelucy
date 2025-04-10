import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Muy importante para enviar cookies de sesión
});

export default api;
