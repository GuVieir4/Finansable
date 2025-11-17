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

  useEffect(() => {
    const fetchChartData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

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
      } catch (error) {
        console.error("Erro ao buscar dados para gráficos:", error);
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
      4: "Despesa"
    };
    return categories[tipoCategoria] || "Outros";
  };

  return (
    <div className="px-4 py-4">
      <h2 className="text-[#131711] text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Análises Gráficas <i className="fa-solid fa-chart-pie"></i>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
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
      </div>
    </div>
  );
}

export default DashboardCharts;