import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getTransactions = async () => {
  const { data } = await api.get("/Transacoes");
  return data;
};

export const getGoals = async () => {
  const { data } = await api.get("/Poupancas");
  return data;
};

export const createGoal = async (goalData) => {
  const { data } = await api.post("/Poupancas", goalData);
  return data;
};

export const deleteGoal = async (id) => {
  await api.delete(`/Poupancas/${id}`);
};