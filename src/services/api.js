import axios from "axios";

export const USER_STORAGE_KEY = "user";

export const normalizeRole = (role) => {
if (!role) return "";
return role.toUpperCase();
};

export const ROLE_HOME = {
STUDENT: "/student",
EMPLOYER: "/employer",
ADMIN: "/admin",
OFFICER: "/officer",
};

const baseURL =
import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
baseURL,
});

// AUTH
export const loginUser = async (data) => {
const res = await api.post("/api/auth/login", data);
return res.data;
};

// USERS
export const getUserById = async (id) => {
const res = await api.get(`/api/users/${id}`);
return res.data;
};

export const updateUserProfile = async (id, userData) => {
const res = await api.put(`/api/users/${id}`, userData);
return res.data;
};

// JOBS
export const getAllJobs = async () => {
const res = await api.get("/api/jobs");
return res.data;
};

export const getJobsByEmployer = async (id) => {
const res = await api.get(`/api/jobs/employer/${id}`);
return res.data;
};

// APPLICATIONS
export const applyForJob = async (data) => {
const res = await api.post("/api/applications/apply", data);
return res.data;
};

export const getApplicationsByStudent = async (id) => {
const res = await api.get(`/api/applications/student/${id}`);
return res.data;
};

export const getAllApplications = async () => {
const res = await api.get("/api/applications");
return res.data;
};

export const updateApplicationStatus = async (id, status) => {
const res = await api.put(`/api/applications/${id}/status?status=${status}`);
return res.data;
};

export default api;
