import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://mago-tvc.co.ke/api" 
    : (import.meta.env.VITE_API_URL || "/api"),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to unwrap standardized API responses
api.interceptors.response.use(
  (response) => {
    // If the response follows our standardized format { success: true, data: ... }
    if (
      response.data &&
      response.data.success === true &&
      response.data.data !== undefined
    ) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
