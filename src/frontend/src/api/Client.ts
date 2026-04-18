import axios from "axios";
import { useAuthStore } from "../stores/AuthStore";

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept every request before it leaves the frontend
apiClient.interceptors.request.use(
  (config) => {
    // Grab the token securely from Zustand's state
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response, // If the request succeeds, just return it.
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 AND we haven't already tried to retry this exact request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 1. Grab updateTokens
        const { refreshToken, updateTokens, logout } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          import.meta.env.VITE_BACKEND_BASE_URL + "/auth/refresh",
          {
            refreshToken: refreshToken,
          },
        );

        const data = response.data;

        // Update new tokens
        updateTokens(data.accessToken, data.refreshToken);

        // Update the failed request with the new token and try again!
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Logging out.");
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
