import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3002/api', // Adjust port if needed
    withCredentials: true, // Important for cookies
});

export default api;
