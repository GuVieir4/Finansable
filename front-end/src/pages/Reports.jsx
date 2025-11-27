import React, { useState, useEffect } from "react";
import { getTransactions } from "../api";

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // "all", "income", "expense"
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPremium, setIsPremium] = useState(false);

  const fetchTransactions = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      console.log('Fetching transactions for userId:', userId);
      const data = await getTransactions(userId);
      console.log('Fetched data:', data);

      // Sort by date descending (most recent first)
      data.sort((a, b) => new Date(b.data) - new Date(a.data));

      // Transform data to match the expected format
      const formattedTransactions = data.map(t => ({
        id: t.id,
        date: t.data ? new Date(t.data).toLocaleDateString('pt-BR') : 'Data inválida',
        rawDate: new Date(t.data),
        description: t.nome || 'Sem descrição',
        category: getCategoryName(t.tipoCategoria ?? 0),
        value: (t.tipoMovimentacao === 1 ? '+' : '-') + 'R$ ' + (t.valor != null ? Math.abs(t.valor).toFixed(2).replace('.', ',') : '0,00'),
        type: t.tipoMovimentacao // 0 expense, 1 income
      }));
      setTransactions(formattedTransactions);
      setFilteredTransactions(formattedTransactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check user type
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsPremium(parseInt(user.tipoUsuario || user.TipoUsuario) === 2);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsPremium(false);
      }
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Filter by date from
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(t => t.rawDate >= fromDate);
    }

    // Filter by date to
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(t => t.rawDate <= toDate);
    }

    // Filter by type
    if (typeFilter === "income") {
      filtered = filtered.filter(t => t.type === 1);
    } else if (typeFilter === "expense") {
      filtered = filtered.filter(t => t.type === 0);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, dateFrom, dateTo, typeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  if (!isPremium) {
    return (
      <div className="flex flex-col min-h-screen bg-[#E8F5E9] items-center justify-center">
        <img src="/images/emoji.png" alt="Emoji" className="w-24 h-24 mb-8 rounded-full" />
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-[#264533] text-[32px] font-bold mb-4">
            Acesso Restrito
          </h1>
          <p className="text-[#264533] text-lg mb-6">
            Esta funcionalidade está disponível apenas para usuários premium.
          </p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Faça upgrade para o plano premium para acessar relatórios avançados e outras funcionalidades exclusivas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-full lg:max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#264533] tracking-light text-[32px] font-bold leading-tight">
                Relatórios
              </p>
              <p className="text-[#264533] text-lg">
                Carregando...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-full lg:max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#264533] tracking-light text-[32px] font-bold leading-tight">
              Relatórios <i className="fa-solid fa-chart-line"></i>
            </p>
            <p className="text-[#264533] text-lg">
              Visualize suas transações com filtros personalizados.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white rounded-lg border border-[#366348] mb-4">
          <h3 className="text-[#264533] text-lg font-semibold mb-3">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#264533] mb-1">Data de:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-[#366348] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#264533] mb-1">Data até:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-[#366348] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#264533] mb-1">Tipo:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#366348] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              >
                <option value="all">Todas</option>
                <option value="income">Entradas</option>
                <option value="expense">Saídas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Page Size Selector */}
        <div className="mb-4">
          <label htmlFor="pageSize" className="mr-2 text-[#264533] text-sm font-medium">Resultados por página:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-lg border border-[#265433] border-solid bg-white">
          {paginatedTransactions.length === 0 ? (
            <div className="p-6 text-center text-[#366348]">
              <img src="/images/emoji.png" alt="Ops!" className="w-16 h-16 mb-4 mx-auto opacity-70" />
              <p className="text-[#366348] text-lg font-medium">Nenhuma transação encontrada.</p>
              <p className="text-gray-400 text-sm text-center mt-2">Tente ajustar os filtros.</p>
            </div>
          ) : (
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-400/30 to-green-600/30 backdrop-blur-md border-b border-green-400/50">
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">Data</th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">Descrição</th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">Categoria</th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">Valor</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction, index) => {
                  const isEntrada = transaction.value.startsWith("+");
                  return (
                    <tr
                      key={transaction.id || index}
                      className={`border-t border-t-[#dee5dc] ${isEntrada ? "hover:bg-green-300" : "hover:bg-red-300"} transition duration-700`}
                    >
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm font-normal leading-normal">
                        {transaction.date}
                      </td>
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm font-normal leading-normal">
                        {transaction.description}
                      </td>
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm font-normal leading-normal">
                        {transaction.category}
                      </td>
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm font-normal leading-normal">
                        {transaction.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-300"
          >
            Anterior
          </button>
          <span className="text-[#264533] text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-300"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;