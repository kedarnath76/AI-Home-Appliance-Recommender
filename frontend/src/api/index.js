import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRecommendations = async (data) => {
  const response = await api.post('/recommend', data);
  return response.data;
};

export const saveHistory = async (data) => {
  const response = await api.post('/history', data);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const clearHistory = async () => {
  const response = await api.delete('/history');
  return response.data;
};

export const toggleWishlist = async (data) => {
  const response = await api.post('/history/wishlist', data);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/history/wishlist');
  return response.data;
};

export const chatWithAi = async (messages) => {
  const response = await api.post('/chat', { messages });
  return response.data;
};
