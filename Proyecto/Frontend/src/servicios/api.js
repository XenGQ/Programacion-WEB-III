import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api', withCredentials: true });

export const auth = {
  captcha: () => api.get('/auth/captcha'),
  login: (d) => api.post('/auth/login', d),
  logout: () => api.post('/auth/logout'),
};

export const clients = {
  list: () => api.get('/clients'),
  create: (d) => api.post('/clients', d),
  update: (id,d) => api.put(`/clients/${id}`, d),
  del: (id) => api.delete(`/clients/${id}`)
};

export const taxis = {
  list: () => api.get('/taxis'),
  create: (d) => api.post('/taxis', d),
  update: (id,d) => api.put(`/taxis/${id}`, d),
  toggle: (id) => api.post(`/taxis/${id}/toggle`),
  del: (id) => api.delete(`/taxis/${id}`)
};

export const trips = {
  list: () => api.get('/trips'),
  create: (d) => api.post('/trips', d),
  update: (id,d) => api.put(`/trips/${id}`, d),
  del: (id) => api.delete(`/trips/${id}`)
};

export const audits = {
  list: () => api.get('/audits')
};

export default api;
