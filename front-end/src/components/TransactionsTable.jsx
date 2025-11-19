import React, { useState, useEffect } from "react";
import { getTransactions } from "../api";

function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
        date: t.data ? new Date(t.data).toLocaleDateString('pt-BR') : 'Data inválida',
        description: t.nome || 'Sem descrição',
        category: getCategoryName(t.tipoCategoria ?? 0),
        value: (t.tipoMovimentacao === 1 ? '+' : '-') + 'R$ ' + (t.valor != null ? Math.abs(t.valor).toFixed(2).replace('.', ',') : '0,00')
      }));
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const handleTransactionAdded = () => {
      fetchTransactions();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const getCategoryName = (tipoCategoria) => {
    // Map TipoCategoria to category names
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

  const displayedTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <section className="px-4 py-3">
        <div className="overflow-x-auto rounded-lg border border-[#265433] border-solid bg-white">
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Carregando...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-3">
      <div className="overflow-x-auto rounded-lg border border-[#265433] border-solid bg-white">
        {displayedTransactions.length === 0 ? (
          <div className="p-6 text-center text-[#366348]">
            <img src="/images/emoji.png" alt="Ops!" className="w-16 h-16 mb-4 mx-auto opacity-70" />
            <p className="text-[#366348] text-lg font-medium">Ops! Nada aqui ainda.</p>
            <p className="text-gray-400 text-sm text-center mt-2">Adicione suas transações para ver os dados aqui.</p>
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
              {displayedTransactions.map((transaction, index) => {
                const isEntrada = transaction.value.startsWith("+");
                return (
                  <tr
                    key={index} className={`border-t border-t-[#dee5dc] ${isEntrada ? "hover:bg-green-300" : "hover:bg-red-300"} transition duration-700`}>
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
    </section>
  );
}

export default TransactionsTable;
