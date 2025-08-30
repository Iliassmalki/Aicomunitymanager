import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Ajouter automatiquement le token dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ou sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
