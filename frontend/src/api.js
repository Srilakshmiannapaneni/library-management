import axios from 'axios';
import { getStoredUser } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user?.role) {
    config.headers['X-User-Role'] = user.role;
  }
  if (user?.email) {
    config.headers['X-User-Email'] = user.email;
  }
  return config;
});

export default api;
