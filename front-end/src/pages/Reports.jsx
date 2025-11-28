import { useState, useEffect } from "react";
import { getTransactions } from "../api/routes/transacoes";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const colors = {
  primary: '#264533',
  secondary: '#366348',
  accent: '#4CAF50',
  background: '#F3F4F6',
  text: '#1F2937',
  textLight: '#6B7280',
  white: '#FFFFFF',
  border: '#E5E7EB',
  income: '#16a34a',
  expense: '#dc2626',
  greenLight: '#4CAF50',
  greenDark: '#388E3C'
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 10
  },
  headerLeft: {
    flexDirection: 'column'
  },
  brandTitle: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  brandSubtitle: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2
  },
  headerRight: {
    textAlign: 'right'
  },
  dateText: {
    fontSize: 10,
    color: colors.textLight
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  summaryCard: {
    width: '32%',
    backgroundColor: colors.background,
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary
  },
  summaryLabel: {
    fontSize: 8,
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold'
  },
  summaryValue: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    marginTop: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 6,
    alignItems: 'center'
  },
  tableHeaderCell: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    paddingVertical: 6,
    minHeight: 20
  },
  tableRowEven: {
    backgroundColor: '#F9FAFB'
  },
  tableCell: {
    fontSize: 9,
    color: colors.text,
    paddingHorizontal: 8
  },
  colDate: {
    width: '20%'
  },
  colDesc: {
    width: '40%'
  },
  colCat: {
    width: '20%'
  },
  colVal: {
    width: '20%',
    textAlign: 'right'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10
  },
  footerText: {
    fontSize: 8,
    color: colors.textLight
  }
});

const MyDocument = ({ transactions, dateFrom, dateTo, typeFilter, user }) => {
  const typeLabel = typeFilter === 'all' ? 'Todas' : typeFilter === 'income' ? 'Entradas' : 'Saídas';

  return (
    <Document>
      <Page size="A4" style={styles.page} render={({ pageNumber, totalPages }) => (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <Text style={styles.brandTitle}>Finansable</Text>
              <Text style={styles.brandSubtitle}>Relatório Financeiro Detalhado</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.dateText}>Gerado em: {new Date().toLocaleDateString('pt-BR')} </Text>
            </View>
          </View>

          <View style={styles.summarySection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Usuário</Text>
              <Text style={styles.summaryValue}>{user?.Nome || user?.nome || 'N/A'}</Text>
              <Text style={{ fontSize: 9, color: colors.textLight, marginTop: 2 }}>
                {user?.Email || user?.email || 'N/A'}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Filtros Aplicados</Text>
              <Text style={styles.summaryValue}>Tipo: {typeLabel}</Text>
              <Text style={{ fontSize: 9, color: colors.textLight, marginTop: 2 }}>
                {(dateFrom || dateTo) ? `${dateFrom || 'Início'} até ${dateTo || 'Fim'}` : 'Todo o período'}
              </Text>
            </View>

            <View style={[styles.summaryCard, { borderLeftColor: colors.accent }]}>
              <Text style={styles.summaryLabel}>Total de Registros</Text>
              <Text style={[styles.summaryValue, { fontSize: 14 }]}>{transactions.length}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={styles.colDate}><Text style={styles.tableHeaderCell}>Data</Text></View>
              <View style={styles.colDesc}><Text style={styles.tableHeaderCell}>Descrição</Text></View>
              <View style={styles.colCat}><Text style={styles.tableHeaderCell}>Categoria</Text></View>
              <View style={styles.colVal}><Text style={styles.tableHeaderCell}>Valor</Text></View>
            </View>

            {transactions.map((transacao, index) => {
              const isIncome =
                transacao?.type === 1 ||
                (typeof transacao?.value === "string" && transacao.value.includes("+"));
              const valueColor = isIncome ? colors.income : colors.expense;
              const rowStyle = [styles.tableRow, index % 2 !== 0 ? styles.tableRowEven : {}];

              return (
                <View key={index} style={rowStyle}>
                  <View style={styles.colDate}><Text style={styles.tableCell}>{transacao.date || ""}</Text></View>
                  <View style={styles.colDesc}><Text style={styles.tableCell}>{transacao.description || ""}</Text></View>
                  <View style={styles.colCat}><Text style={styles.tableCell}>{transacao.category || ""}</Text></View>
                  <View style={styles.colVal}>
                    <Text style={[styles.tableCell, { color: valueColor, fontWeight: 'bold' }]}>
                      {transacao.value || ""}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View fixed style={styles.footer}>
            <Text style={styles.footerText}>
              Finansable • Página {pageNumber} de {totalPages}
            </Text>
          </View>
        </>
      )} />
    </Document>
  );
};

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState(null);

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

  const fetchTransactions = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const data = await getTransactions(userId);

      data.sort((a, b) => new Date(b.data) - new Date(a.data));

      const formattedTransactions = data.map(t => ({
        id: t.id,
        date: t.data ? new Date(t.data).toLocaleDateString('pt-BR') : 'Data inválida',
        rawDate: new Date(t.data),
        description: t.nome || 'Sem descrição',
        category: getCategoryName(t.tipoCategoria ?? 0),
        value: (t.tipoMovimentacao === 1 ? '+' : '-') + 'R$ ' + (t.valor != null ? Math.abs(t.valor).toFixed(2).replace('.', ',') : '0,00'),
        type: t.tipoMovimentacao
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
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsPremium(parseInt(parsedUser.tipoUsuario || parsedUser.TipoUsuario) === 2);
      } catch (error) {
        console.error("Erro ao ler usuário:", error);
        setIsPremium(false);
      }
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(t => t.rawDate >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => t.rawDate <= toDate);
    }

    if (typeFilter === "income") {
      filtered = filtered.filter(t => t.type === 1);
    } else if (typeFilter === "expense") {
      filtered = filtered.filter(t => t.type === 0);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, dateFrom, dateTo, typeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

        <div className="mb-4">
          <PDFDownloadLink
            document={<MyDocument
              transactions={filteredTransactions}
              dateFrom={dateFrom}
              dateTo={dateTo}
              typeFilter={typeFilter}
              user={user}
            />}
            fileName={`RelatorioFinansable_${user?.nome}`}
          >
            {({ loading }) => (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                disabled={loading}
              >
                {loading ? 'Gerando PDF...' : 'Baixar Relatório em PDF'}
              </button>
            )}
          </PDFDownloadLink>
        </div>

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
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium">Data</th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium">Descrição</th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium">Categoria</th>
                  <th className="px-4 py-3 text-left text-[#131711] text-sm font-medium">Valor</th>
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
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm">{transaction.date}</td>
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm">{transaction.description}</td>
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm">{transaction.category}</td>
                      <td className="h-[72px] px-4 py-2 text-[#000000] text-sm">{transaction.value}</td>
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

