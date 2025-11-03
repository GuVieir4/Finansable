const API_BASE_URL = "https://localhost:7246/api";
export const getTransactions = async () => {
  const response = await fetch(`${API_BASE_URL}/Transacoes`);
  if (!response.ok) {
    throw new Error('Falha ao buscar transações');
  }
  return response.json();
};

export const getGoals = async () => {
  const API_BASE_URL = 'https://localhost:7246/api';
  const response = await fetch(`${API_BASE_URL}/Poupancas`);
  if (!response.ok) {
    throw new Error('Falha ao buscar poupanças');
  }
  return response.json();
};
