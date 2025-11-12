function TransactionsTable() {
  const transactions = [
    { date: "06/10/2025", description: "Salário", category: "Renda", value: "+R$ 1.512,00" },
    { date: "06/10/2025", description: "Mercado", category: "Alimentação", value: "-R$ 200,00" },
    { date: "08/06/2025", description: "Agiota", category: "Despesa", value: "-R$ 700,00" },
    { date: "08/06/2025", description: "Conta de Luz", category: "Contas", value: "-R$ 180,00" },
    { date: "09/10/2025", description: "Entrega iFood", category: "Renda", value: "+R$ 150,00" },
  ];

  return (
    <section className="px-4 py-3">
      <div className="overflow-x-auto rounded-lg border border-[#265433] border-solid">
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
            {transactions.map((transaction, index) => {
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
      </div>
    </section>
  );
}

export default TransactionsTable;
