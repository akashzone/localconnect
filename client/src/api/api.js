import axios from "axios";

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api",
    withCredentials: true
});


api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Prevent looping if the refresh request itself fails
            if (originalRequest.url === "/auth/refresh" || originalRequest.url.endsWith("/auth/refresh")) {
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                await api.post("/auth/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;