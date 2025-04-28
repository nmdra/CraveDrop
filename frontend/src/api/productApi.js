import axios from 'axios';

const API_URL ='http://localhost:5000/api';

export const getAllProducts = () => axios.get(`${API_URL}/products`);
export const getProductById = (id) => axios.get(`${API_URL}/products/${id}`);
