import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createOrder = (orderData) => axios.post(`${API_URL}/orders`, orderData);
