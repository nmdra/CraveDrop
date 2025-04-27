// filepath: c:\Users\Asus\Desktop\Mid ChatGpt answers\restaurant-service\frontend\src\services\axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // Backend server URL
});

export default instance;