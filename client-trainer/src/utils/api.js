import axios from 'axios';
const token = localStorage.getItem('jwt'); // Get the token from localStorage (or any storage)
console.log("Trainer Token  is", token)
// Create an Axios instance
const api = axios.create({
    baseURL: 'http://bas.rjpinfotek.com:5000/api', // Base URL for API requests
    withCredentials: true, // Ensures cookies are sent with each request
    headers: {
        Authorization: `Bearer ${token}`  // Set the token, if available
    },
});

 
export default api;
