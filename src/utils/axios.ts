import axios from 'axios';

// Create instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

// Optional: attach token on request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or cookies if needed)
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlc2NyaXRyIiwic3ViIjoiODM0ODhiZTgtM2ViNC00ZTFmLWI4NjktNjI1OGE0ZDRmMjQzIiwidXNyIjoiZ2FicmllbCIsImVtbCI6ImdhYnJpZWxAZ2FicmllbC5jb20iLCJ2ZXIiOjAsImV4cCI6MTc0NTg0OTA2M30.wZV6HgSKfWxz1pKNWqN_CpdkSI2s2o7BOJsvuS8qNDY`;
    console.log(config);
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error)
  }
);

export default api;