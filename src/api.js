const API_BASE_URL = "https://localhost:7246/api";
export const getTransactions = async () => {
  const response = await fetch(`${API_BASE_URL}/Transacoes`);
  if (!response.ok) {
    throw new Error('Falha ao buscar transações');
  }
  return response.json();
};
