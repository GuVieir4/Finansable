import Header from "./components/Header";
import FinancialSummary from "./components/FinancialSummary";
import TransactionsTable from "./components/TransactionsTable";
import GoalsProgress from "./components/GoalsProgress";
import Login from "./pages/Login";
import Plans from './components/Plans'
import Footer from './components/Footer'
import Error404 from "./pages/404";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>
          <Header />
          <main className="flex flex-1 justify-center px-4 sm:px-10 lg:px-40 py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[960px]">
              <section className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-full sm:min-w-72 flex-col gap-3">
                  <p className="text-[#264533] tracking-light text-[28px] sm:text-[32px] font-bold leading-tight">
                    Resumo Financeiro <i class="fa-solid fa-coins"></i>
                  </p>
                  <p className="text-[#264533] text-sm sm:text-base font-semibold leading-normal">
                    Aqui está uma visão geral das suas finanças.
                  </p>
                </div>
              </section>

              <FinancialSummary />

              <h2 className="text-[#131711] text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Transações Recentes <i class="fa-solid fa-clock-rotate-left"></i>
              </h2>

              <TransactionsTable />

              <h2 className="text-[#131711] text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Progresso nas Metas <i class="fa-solid fa-bullseye"></i>
              </h2>

              <GoalsProgress />
            </div>
          </main>
          <Footer/>
        </div>} />

        <Route path="/login" element={<Login />} />

        <Route path="/plans" element={<div>
          <Header/>
          <Plans/>
          <Footer/>
        </div>} />

        <Route path="*" element={<Error404/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
