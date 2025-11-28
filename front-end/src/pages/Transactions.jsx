import React, { useState, useEffect } from "react";
import { getTransactions, getDashboardData, deleteTransaction, getGoals } from "../api";
import Modal from "../components/Modal";
import FormTransaction from "../components/FormTransaction";
import { Pencil, Trash2 } from "lucide-react";
import Toast from "../components/Toast";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [rawTransactions, setRawTransactions] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteTransaction(confirmDelete.id);
      fetchData(); // Refresh data
      setConfirmDelete({ show: false, id: null });
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      showToast("Erro ao excluir transação. Tente novamente.", "error");
      setConfirmDelete({ show: false, id: null });
    }
  };

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const [transData, dashData, goalsData] = await Promise.all([
        getTransactions(userId),
        getDashboardData(userId),
        getGoals(userId)
      ]);

      setRawTransactions(transData);

      const formattedTransactions = transData.map(t => ({
        date: t.data ? new Date(t.data).toLocaleDateString('pt-BR') : 'Data inválida',
        description: t.nome || 'Sem descrição',
        category: getCategoryName(t.tipoCategoria ?? 0),
        value: (t.tipoMovimentacao === 1 ? '+' : '-') + 'R$ ' + (t.valor != null ? Math.abs(t.valor).toFixed(2).replace('.', ',') : '0,00')
      }));

      // Calculate sums from transactions
      const entradas = transData.filter(t => t.tipoMovimentacao === 1).reduce((sum, t) => sum + (t.valor || 0), 0);
      const saidas = transData.filter(t => t.tipoMovimentacao === 0).reduce((sum, t) => sum + (t.valor || 0), 0);

      // Saldo Líquido: entradas e saídas excluindo metas (tipoCategoria !== 5)
      const entradasLiquido = transData.filter(t => t.tipoMovimentacao === 1 && t.tipoCategoria !== 5).reduce((sum, t) => sum + (t.valor || 0), 0);
      const saidasLiquido = transData.filter(t => t.tipoMovimentacao === 0 && t.tipoCategoria !== 5).reduce((sum, t) => sum + (t.valor || 0), 0);
      const saldoLiquido = entradasLiquido - saidasLiquido;

      // Poupado: soma dos valores atuais das metas
      const poupado = goalsData.reduce((sum, g) => sum + (g.valorAtual || 0), 0);

      // Patrimônio: saldo líquido + poupado
      const patrimonio = saldoLiquido + poupado;

      setTransactions(formattedTransactions);
      setDashboardData({ ...dashData, Entradas: entradas, Saidas: saidas, saldoLiquido, poupado, patrimonio });
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const totalPages = Math.ceil(transactions.length / pageSize) || 1;
  const paginatedTransactions = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-full lg:max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#264533] tracking-light text-[32px] font-bold leading-tight">
                Transações
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
              Transações
            </p>
            <p className="text-[#264533] text-lg">
              Visualize e gerencie todas as suas transações financeiras.
            </p>
          </div>
        </div>
           <div className="p-4">
             <div className="flex gap-4">
               <label className="flex flex-col h-12 flex-1">
                 <div className="flex w-full flex-1 items-stretch rounded-lg shadow-inner">
                   <input placeholder="Pesquisar por descrição ou categoria..."
                   className="w-full min-w-0 flex-1 rounded-lg text-[#264533] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] border border-[#366348] bg-white h-full placeholder:text-gray-400 p-3 text-base font-normal leading-normal transition" type="text"
                   />
                 </div>
               </label>
               <button
                 onClick={() => {
                   console.log('Nova Transação button clicked');
                   setEditingTransaction(null);
                   setIsModalOpen(true);
                 }}
                 className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition"
               >
                 Nova Transação
               </button>
             </div>
           </div>
        <h2 className="text-[#264533] text-[22px] font-bold px-4 pb-3 pt-5">
          Resumo
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-green-400/30 to-green-600/30 backdrop-blur-md border border-green-400/50 shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 cursor-pointer">
            <p className="text-[#131711] text-base font-medium leading-normal">Saldo Líquido</p>
            <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ {(dashboardData?.saldoLiquido || 0).toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-blue-400/30 to-blue-600/30 backdrop-blur-md border border-blue-400/50 shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 cursor-pointer">
            <p className="text-[#131711] text-base font-medium leading-normal">Poupado</p>
            <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ {(dashboardData?.poupado || 0).toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 bg-gradient-to-br from-purple-400/30 to-purple-600/30 backdrop-blur-md border border-purple-400/50 shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 cursor-pointer">
            <p className="text-[#131711] text-base font-medium leading-normal">Patrimônio</p>
            <p className="text-[#131711] tracking-light text-2xl font-bold leading-tight">R$ {(dashboardData?.patrimonio || 0).toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <h2 className="text-[#264533] text-[22px] font-bold px-4 pb-3 pt-5">
          Transações
        </h2>
        <div className="px-4 py-3 @container">
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
          <div className="flex overflow-x-auto rounded-lg border border-[#366348] bg-white">
            <table className="min-w-[700px] w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-400/30 to-green-600/30 backdrop-blur-md border-b border-green-400/50">
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium leading-normal">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction, index) => {
                  const isEntrada = transaction.value.startsWith("+");
                  return (
                    <tr key={index + (currentPage - 1) * pageSize} className={`border-t border-t-[#dee5dc] ${isEntrada ? "hover:bg-green-300" : "hover:bg-red-300"} transition duration-700`}>
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
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm font-normal leading-normal">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(rawTransactions[index + (currentPage - 1) * pageSize])}
                            className="flex items-center gap-1 text-[#4CAF50] hover:text-[#388E3C] text-sm font-medium transition"
                          >
                            <Pencil size={16} /> Editar
                          </button>
                          <button
                            onClick={() => handleDelete(rawTransactions[index + (currentPage - 1) * pageSize].id)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition"
                          >
                            <Trash2 size={16} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-[#264533] text-xl font-bold">Nova Transação</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#366348] hover:text-[#264533]"
              >
                ✕
              </button>
            </div>
            <FormTransaction
              onClose={() => {
                setIsModalOpen(false);
                setEditingTransaction(null);
              }}
              onSuccess={() => fetchData()}
              transactionToEdit={editingTransaction}
            />
          </div>
        </div>
      )}
      {confirmDelete.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-[#264533] text-xl font-bold">Confirmar Exclusão</h2>
              <button
                onClick={() => setConfirmDelete({ show: false, id: null })}
                className="text-[#366348] hover:text-[#264533]"
              >
                ✕
              </button>
            </div>
            <p className="text-[#264533] mb-6">Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete({ show: false, id: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Transactions;