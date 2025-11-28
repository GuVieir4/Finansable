import { useState, useEffect } from "react";
import { getTransactions } from "../api/routes/transacoes";
import { getGoals } from "../api/routes/poupancas";

function FinancialSummary() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const [transactions, goals] = await Promise.all([
        getTransactions(userId),
        getGoals(userId)
      ]);

      // Saldo Líquido: entradas e saídas excluindo metas (tipoCategoria !== 5)
      const entradasLiquido = transactions.filter(t => t.tipoMovimentacao === 1 && t.tipoCategoria !== 5).reduce((sum, t) => sum + (t.valor || 0), 0);
      const saidasLiquido = transactions.filter(t => t.tipoMovimentacao === 0 && t.tipoCategoria !== 5).reduce((sum, t) => sum + (t.valor || 0), 0);
      const saldoLiquido = entradasLiquido - saidasLiquido;

      // Poupado: soma dos valores atuais das metas
      const poupado = goals.reduce((sum, g) => sum + (g.valorAtual || 0), 0);

      // Patrimônio: saldo líquido + poupado
      const patrimonio = saldoLiquido + poupado;

      setDashboardData({ saldoLiquido, poupado, patrimonio });
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
          <p className="text-[#131711] text-base font-medium leading-normal">Saldo Líquido</p>
          <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">Carregando...</p>
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-blue-400/30 to-blue-600/30 backdrop-blur-md border border-blue-400/50 shadow-lg">
          <p className="text-[#131711] text-base font-medium leading-normal">Poupado</p>
          <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">Carregando...</p>
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-purple-400/30 to-purple-600/30 backdrop-blur-md border border-purple-400/50 shadow-lg">
          <p className="text-[#131711] text-base font-medium leading-normal">Patrimônio</p>
          <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">Carregando...</p>
        </div>
      </div>
    );
  }

  const { saldoLiquido = 0, poupado = 0, patrimonio = 0 } = dashboardData || {};

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4">
      <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-green-400/30 to-green-600/30 backdrop-blur-md border border-green-400/50 shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 cursor-pointer">
        <p className="text-[#131711] text-base font-medium leading-normal">Saldo Líquido</p>
        <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ {saldoLiquido.toFixed(2).replace('.', ',')}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-blue-400/30 to-blue-600/30 backdrop-blur-md border border-blue-400/50 shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 cursor-pointer">
        <p className="text-[#131711] text-base font-medium leading-normal">Poupado</p>
        <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ {poupado.toFixed(2).replace('.', ',')}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-purple-400/30 to-purple-600/30 backdrop-blur-md border border-purple-400/50 shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 cursor-pointer">
        <p className="text-[#131711] text-base font-medium leading-normal">Patrimônio</p>
        <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ {patrimonio.toFixed(2).replace('.', ',')}</p>
      </div>
    </div>
  );
}

export default FinancialSummary;