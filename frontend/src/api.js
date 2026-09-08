import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const getCategories = () => API.get('/categories');
export const getProducts = () => API.get('/products');
export const getFeaturedProducts = () => API.get('/products/featured');
export const getDeals = () => API.get('/products/deals');
export const getUpcomingEvents = () => API.get('/events/upcoming');

export default API;
