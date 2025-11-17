import React, { useState, useEffect } from "react";
import { getTransactions } from "../api";

function FinancialSummary() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const transactions = await getTransactions(userId);
      const entradas = transactions.filter(t => t.tipoMovimentacao === 1).reduce((sum, t) => sum + (t.valor || 0), 0);
      const saidas = transactions.filter(t => t.tipoMovimentacao === 0).reduce((sum, t) => sum + (t.valor || 0), 0);
      const saldo = entradas - saidas;
      setDashboardData({ Saldo: saldo });
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleTransactionAdded = () => {
      fetchDashboardData();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-green-400/30 to-green-600/30 backdrop-blur-md border border-green-400/50 shadow-lg">
          <p className="text-[#131711] text-base font-medium leading-normal">Saldo Total</p>
          <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">Carregando...</p>
        </div>
      </div>
    );
  }

  const saldo = dashboardData?.Saldo ?? 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4">
      <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-green-400/30 to-green-600/30 backdrop-blur-md border border-green-400/50 shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 cursor-pointer">
        <p className="text-[#131711] text-base font-medium leading-normal">Saldo Total</p>
        <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ {saldo.toFixed(2).replace('.', ',')}</p>
      </div>
    </div>
  );
}

export default FinancialSummary;