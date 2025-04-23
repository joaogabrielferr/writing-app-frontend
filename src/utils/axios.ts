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
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlc2NyaXRyIiwic3ViIjoiODM0ODhiZTgtM2ViNC00ZTFmLWI4NjktNjI1OGE0ZDRmMjQzIiwidXNyIjoiZ2FicmllbCIsImVtbCI6ImdhYnJpZWxAZ2FicmllbC5jb20iLCJ2ZXIiOjAsImV4cCI6MTc0NTQ5NDg3OX0.Q7GR3h7YY1Ex7gV4l1chJ1dDlN12gJn6HHcs1GX-M54`;
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