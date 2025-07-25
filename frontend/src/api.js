import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/'
});

// Attach access token to every request if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  console.log(token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default API;
