import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getGoals = async (userId) => {
  const { data } = await api.get(`/api/Poupancas/usuario/${userId}`);
  return data;
};

export const createGoal = async (goalData) => {
  const { data } = await api.post("/api/Poupancas", goalData);
  return data;
};

export const deleteGoal = async (id) => {
  await api.delete(`/api/Poupancas/${id}`);
};

export const updateGoal = async (id, goalData) => {
  const { data } = await api.put(`/api/Poupancas/${id}`, goalData);
  return data;
};
