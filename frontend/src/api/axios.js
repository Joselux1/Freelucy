import axios from "axios";
import Cookies from "js-cookie";


const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// Inject CSRF token from cookie into header
api.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }
  return config;
});

export default api;
