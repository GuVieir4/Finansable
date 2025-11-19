import React, { useState, useEffect } from "react";
import { getTransactions } from "../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

function DashboardCharts() {
  const [chartData, setChartData] = useState({
    categoryCounts: [],
    expensesByCategory: [],
    transactionsOverTime: [],
    incomeVsExpenses: []
  });
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const transData = await getTransactions(userId);

        // Calculate chart data
        const categoryCounts = {};
        const expensesByCategory = {};
        const transactionsOverTime = {};
        let totalIncome = 0;
        let totalExpenses = 0;

        transData.forEach(t => {
          const category = getCategoryName(t.tipoCategoria ?? 0);
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;

          if (t.tipoMovimentacao === 0) { // Saída
            expensesByCategory[category] = (expensesByCategory[category] || 0) + (t.valor || 0);
            totalExpenses += t.valor || 0;
          } else {
            totalIncome += t.valor || 0;
          }

          const date = t.data ? new Date(t.data).toISOString().split('T')[0] : 'unknown';
          transactionsOverTime[date] = (transactionsOverTime[date] || 0) + (t.tipoMovimentacao === 0 ? -(t.valor || 0) : (t.valor || 0));
        });

        const categoryCountsData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
        const expensesByCategoryData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
        const transactionsOverTimeData = Object.entries(transactionsOverTime).map(([date, value]) => ({ date, value })).sort((a, b) => new Date(a.date) - new Date(b.date));
        const incomeVsExpensesData = [
          { name: 'Receitas', value: totalIncome },
          { name: 'Despesas', value: totalExpenses }
        ];

        setChartData({
          categoryCounts: categoryCountsData,
          expensesByCategory: expensesByCategoryData,
          transactionsOverTime: transactionsOverTimeData,
          incomeVsExpenses: incomeVsExpensesData
        });

        setHasData(transData.length > 0);
      } catch (error) {
        console.error("Erro ao buscar dados para gráficos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();

    const handleTransactionAdded = () => {
      fetchChartData();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const getCategoryName = (tipoCategoria) => {
    const categories = {
      0: "Alimentação",
      1: "Transporte",
      2: "Contas",
      3: "Renda",
      4: "Despesa",
      5: "Meta"
    };
    return categories[tipoCategoria] || "Outros";
  };

  const EmptyChart = ({ title }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="p-6 text-center text-[#366348]">
        <img src="/images/emoji.png" alt="Ops!" className="w-16 h-16 mb-4 mx-auto opacity-70" />
        <p className="text-[#366348] text-lg font-medium">Ops! Nada aqui ainda.</p>
        <p className="text-gray-400 text-sm text-center mt-2">Adicione transações para ver os gráficos.</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="px-4 py-4">
        <h2 className="text-[#131711] text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Análises Gráficas <i className="fa-solid fa-chart-pie"></i>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-center items-center h-[300px]">
                <div className="text-gray-500">Carregando...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h2 className="text-[#131711] text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Análises Gráficas <i className="fa-solid fa-chart-pie"></i>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {hasData ? (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Distribuição por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.categoryCounts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {chartData.categoryCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#4CAF50', '#81C784', '#66BB6A', '#43A047', '#388E3C'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Despesas por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.expensesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Receitas vs Despesas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.incomeVsExpenses}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    <Cell fill="#4CAF50" />
                    <Cell fill="#9E9E9E" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Fluxo de Transações ao Longo do Tempo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.transactionsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4CAF50" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <>
            <EmptyChart title="Distribuição por Categoria" />
            <EmptyChart title="Despesas por Categoria" />
            <EmptyChart title="Receitas vs Despesas" />
            <EmptyChart title="Fluxo de Transações ao Longo do Tempo" />
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardCharts;