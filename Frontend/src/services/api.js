// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1", // backend base URL
  withCredentials: true, // 👈 important for cookies (sends them with every request)
});

// Auth
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);
export const logoutUser = () => API.post("/users/logout");
export const getUserProfile = () => API.get("/users/me");
export const changePassword = (data) => API.post("/users/change-password", data);
export const updateAccount = (data) => API.put("/users/update-account", data);

// Videos
export const uploadVideo = (data) =>
  API.post("/videos/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getHistory = () => API.get("/videos/history");

export default API;
