import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import FinancialSummary from "./FinancialSummary";
import TransactionsTable from "./TransactionsTable";
import GoalsProgress from "./GoalsProgress";
import DashboardCharts from "./DashboardCharts";
import Footer from './Footer'
import Modal from "./Modal";
import FormTransaction from "./FormTransaction"
import { getTransactions } from "../api";

function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [happinessLevel, setHappinessLevel] = useState(3);
  const navigate = useNavigate();

  const getHappinessInfo = (level) => {
    const messages = [
      "Jarbas está muito triste! Você está gastando mais do que ganha.",
      "Jarbas está triste. Sua taxa de poupança é baixa.",
      "Jarbas não está muito feliz. Poupe mais!",
      "Jarbas está neutro. Taxa de poupança razoável.",
      "Jarbas está feliz! Boa taxa de poupança!",
      "Jarbas está muito feliz! Excelente poupança!",
      "Jarbas está super feliz! Você é um mestre da poupança!"
    ];

    // Map happiness levels to available images
    const imageNames = [
      "porco0.png",   // 0: Very sad
      "porco1.png",   // 1: Sad
      "porco2.png",   // 2: Unhappy
      "porco3.png",   // 3: Neutral
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
      const transactions = await getTransactions(userId);

      const totalIncome = transactions
        .filter(t => t.tipoMovimentacao === 1)
        .reduce((sum, t) => sum + (t.valor || 0), 0);
      const totalExpenses = transactions
        .filter(t => t.tipoMovimentacao === 0)
        .reduce((sum, t) => sum + (t.valor || 0), 0);
      const balance = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? (balance / totalIncome) : 0;

      let happiness = 3;
      if (savingsRate < 0) happiness = 0;
      else if (savingsRate < 0.1) happiness = 1;
      else if (savingsRate < 0.2) happiness = 2;
      else if (savingsRate < 0.3) happiness = 3;
      else if (savingsRate < 0.4) happiness = 4;
      else if (savingsRate < 0.5) happiness = 5;
      else happiness = 6;

      setHappinessLevel(happiness);
    } catch (error) {
      console.error("Erro ao calcular felicidade:", error);
      setHappinessLevel(3);
    }
  };

  useEffect(() => {
    calculateHappiness();

    const handleTransactionUpdated = () => {
      calculateHappiness();
    };

    window.addEventListener('transactionAdded', handleTransactionUpdated);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionUpdated);
    };
  }, []);

  const handleTableClick = () => {
    navigate('/transactions');
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <Header />
      <main className="flex flex-1 justify-center px-4 sm:px-10 lg:px-40 py-5 pt-20">
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
                  e.target.src = '/images/porco3.png';
                }}
              />
            </div>
          </section>

          <FinancialSummary />

          <DashboardCharts />

          <div className="flex flex-wrap justify-between items-center gap-3 px-4 pb-3 pt-5">
            <h2 className="text-[#131711] text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Transações Recentes <i className="fa-solid fa-clock-rotate-left"></i>
            </h2>
            <button
              onClick={handleTableClick}
              className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#45a049] transition"
            >
              Ver Todas as Transações
            </button>
          </div>

          <TransactionsTable />

          <GoalsProgress />

          {openModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <h2 className="text-[#264533] text-xl font-bold">Nova Transação</h2>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="text-[#366348] hover:text-[#264533]"
                  >
                    ✕
                  </button>
                </div>
                <FormTransaction
                  onClose={() => setOpenModal(false)}
                  onSuccess={() => window.dispatchEvent(new Event('transactionAdded'))}
                />
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer/>
    </div>
  );
}

export default Dashboard;