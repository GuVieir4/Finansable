const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getTransactions = async () => {
  const response = await fetch(`${API_BASE_URL}/Transacoes`);
  if (!response.ok) {
    throw new Error('Falha ao buscar transações');
  }
  return response.json();
};

export const getGoals = async () => {
  const response = await fetch(`${API_BASE_URL}/Poupancas`);
  if (!response.ok) {
    throw new Error('Falha ao buscar poupanças');
  }
  return response.json();
};

export const deleteGoal = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Poupancas/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.text(); 
    throw new Error(`Falha ao excluir meta`);
  }
};