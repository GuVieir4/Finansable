import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FinancialSummary from "./components/FinancialSummary";
import TransactionsTable from "./components/TransactionsTable";
import GoalsProgress from "./components/GoalsProgress";
import Login from "./pages/Login";
import Plans from './components/Plans'
import Footer from './components/Footer'
import Error404 from "./pages/404";
import Chatbot from "./components/Chatbot";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Modal from "./components/Modal";
import FormTransaction from "./components/FormTransaction"
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import { getGoals } from "./api";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [happinessLevel, setHappinessLevel] = useState(3); // Default to neutral

  const getHappinessInfo = (level) => {
    const messages = [
      "Jarbas está muito triste! Que tal começar a trabalhar nas suas metas?",
      "Jarbas está triste. Vamos melhorar isso completando algumas metas!",
      "Jarbas não está muito feliz. Continue trabalhando nas suas metas!",
      "Jarbas está neutro. Mantenha o foco nas suas metas!",
      "Jarbas está feliz! Você está progredindo bem!",
      "Jarbas está muito feliz! Continue assim!",
      "Jarbas está super feliz! Parabéns pelas metas concluídas!"
    ];

    // Map happiness levels to available images
    const imageNames = [
      "porco0.png",   // 0: Very sad
      "porco1].png",  // 1: Sad (note: filename has bracket)
      "porco2.png",   // 2: Unhappy
      "porco3.jpg",   // 3: Neutral
      "porco4.png",   // 4: Happy
      "porco5.png",   // 5: Very happy
      "porco5.png"    // 6: Super happy (reuse level 5)
    ];

    return {
      message: messages[level] || messages[3],
      image: imageNames[level] || "porco3.jpg"
    };
  };

  const calculateHappiness = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const goals = await getGoals(userId);
      if (goals.length === 0) {
        setHappinessLevel(3); // Neutral if no goals
        return;
      }

      const totalTarget = goals.reduce((sum, g) => sum + g.valorAlvo, 0);
      const totalProgress = goals.reduce((sum, g) => sum + g.valorAtual, 0);
      const completionRate = totalTarget === 0 ? 0 : (totalProgress / totalTarget);

      // Map completion rate to happiness level (0-6)
      // 0-16%: 0 (very sad), 17-33%: 1, 34-50%: 2, 51-67%: 3 (neutral), 68-84%: 4, 85-100%: 5, 100%+: 6 (very happy)
      let happiness = 3; // neutral default
      if (completionRate <= 0.16) happiness = 0;
      else if (completionRate <= 0.33) happiness = 1;
      else if (completionRate <= 0.50) happiness = 2;
      else if (completionRate <= 0.67) happiness = 3;
      else if (completionRate <= 0.84) happiness = 4;
      else if (completionRate < 1.0) happiness = 5;
      else happiness = 6;

      setHappinessLevel(happiness);
    } catch (error) {
      console.error("Erro ao calcular felicidade:", error);
      setHappinessLevel(3); // Default to neutral on error
    }
  };

  useEffect(() => {
    calculateHappiness();

    // Listen for goal updates to recalculate happiness
    const handleGoalsUpdated = () => {
      calculateHappiness();
    };

    window.addEventListener('goalsUpdated', handleGoalsUpdated);

    return () => {
      window.removeEventListener('goalsUpdated', handleGoalsUpdated);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex flex-1 justify-center px-4 sm:px-10 lg:px-40 py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[960px]">
              <section className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-full sm:min-w-72 flex-col gap-3">
                  <p className="text-[#264533] tracking-light text-[28px] sm:text-[32px] font-bold leading-tight">
                    Resumo Financeiro <i className="fa-solid fa-coins"></i>
                  </p>
                  <p className="text-[#264533] text-sm sm:text-base font-semibold leading-normal">
                    Aqui está uma visão geral das suas finanças.
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    src={`/images/${getHappinessInfo(happinessLevel).image}`}
                    alt={`Jarbas nível ${happinessLevel}`}
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      e.target.src = '/images/porco3.jpg'; // Fallback to neutral pig
                    }}
                  />
                </div>
              </section>

              <FinancialSummary />

              <div className="px-4 py-4">
                <button onClick={() => setOpenModal(true)} className="bg-[#264533] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  Adicionar Movimentação
                </button>
              </div>

              <h2 className="text-[#131711] text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Transações Recentes <i className="fa-solid fa-clock-rotate-left"></i>
              </h2>

              <TransactionsTable />

              <GoalsProgress />

              <Modal isOpen={openModal} onClose={() =>setOpenModal(false)}>
                <FormTransaction onClose={() =>setOpenModal(false)} />
              </Modal>

            </div>
          </main>
          <Footer/>
        </div></ProtectedRoute>} />

        <Route path="/login" element={<Login />} />

        <Route path="/plans" element={<div className="flex flex-col min-h-screen">
          <Header/>
          <Plans/>
          <Footer/>
        </div>} />

        <Route path="/chatbot" element={
          <div>
            <Header/>
            <Chatbot/>
          </div>
        } />

        <Route path="*" element={<Error404/>} />

        <Route path="/transactions" element={<div>
          <Header/>
          <Transactions/>
          <Footer/>
        </div>} />

          <Route path="goals" element={<div>
            <Header/>
            <Goals/>
            <Footer/>
          </div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
