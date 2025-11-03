function Transactions() {
  const transactions = [
    { date: "06/10/2025", description: "Salário", category: "Renda", value: "+R$ 1.512,00" },
    { date: "06/10/2025", description: "Mercado", category: "Alimentação", value: "-R$ 200,00" },
    { date: "08/06/2025", description: "Agiota", category: "Despesa", value: "-R$ 700,00" },
    { date: "08/06/2025", description: "Conta de Luz", category: "Contas", value: "-R$ 180,00" },
    { date: "09/10/2025", description: "Entrega iFood", category: "Renda", value: "+R$ 150,00" },
  ];

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
            <label className="flex flex-col h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg shadow-inner">
                <input placeholder="Pesquisar por descrição ou categoria..." 
                className="w-full min-w-0 flex-1 rounded-lg text-[#264533] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] border border-[#366348] bg-white h-full placeholder:text-gray-400 p-3 text-base font-normal leading-normal transition" type="text"
                />
              </div>
            </label>
          </div>
        <h2 className="text-[#264533] text-[22px] font-bold px-4 pb-3 pt-5">
          Resumo
        </h2>
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#366348] bg-[#4CAF50]">
            <p className="text-white text-base font-medium leading-normal">
              Receitas
            </p>
            <p className="text-white tracking-light text-2xl font-bold leading-tight">
              R$ 5.500,00
            </p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#366348] bg-[#cc4444]">
            <p className="text-white text-base font-medium leading-normal">
              Despesas
            </p>
            <p className="text-white tracking-light text-2xl font-bold leading-tight">
              R$ 2.300,00
            </p>
          </div>
        </div>
        <h2 className="text-[#264533] text-[22px] font-bold px-4 pb-3 pt-5">
          Transações
        </h2>
        <div className="px-4 py-3 @container">
          <div className="flex overflow-x-auto rounded-lg border border-[#366348]">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="bg-[#4CAF50]">
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
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => {
                  const isEntrada = transaction.value.startsWith("+");
                  return (
                    <tr key={index} className={`border-t border-t-[#dee5dc] ${isEntrada ? "hover:bg-green-300" : "hover:bg-red-300"} transition duration-700`}>
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
        </div>
      </div>
    </div>
  );
}

export default Transactions;