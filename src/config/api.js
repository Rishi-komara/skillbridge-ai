import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add Firebase token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("skillbridge-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;