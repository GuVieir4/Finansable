import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import GoalsProgress from '../components/GoalsProgress'
import NewGoalButton from "../components/NewGoalButton";
import { getGoals } from "../api/routes/poupancas";

function GoalsPage() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        const apiData = await getGoals(userId);
        const mappedGoals = apiData.map(item => ({
          title: item.nome,
          target: item.valorAlvo,
          progress: item.valorAtual,
          deadline: item.dataFim ? new Date(item.dataFim).toISOString().split('T')[0] : null
        }));
        setGoals(mappedGoals);
      } catch (error) {
        console.error("Erro ao buscar metas para visão geral:", error);
      }
    };
    fetchGoals();

    const handleGoalUpdated = () => {
      fetchGoals();
    };
    window.addEventListener('goalsUpdated', handleGoalUpdated);
    return () => window.removeEventListener('goalsUpdated', handleGoalUpdated);
  }, []);

  const handleGoalCreated = (createdGoal) => {
    window.dispatchEvent(new CustomEvent('goalCreated', { detail: createdGoal }));
    const mappedGoal = {
      title: createdGoal.nome,
      target: createdGoal.valorAlvo,
      progress: createdGoal.valorAtual,
      deadline: createdGoal.dataFim ? new Date(createdGoal.dataFim).toISOString().split('T')[0] : null
    };
    setGoals(prev => [...prev, mappedGoal]);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalProgress = goals.reduce((sum, g) => sum + g.progress, 0);
  const totalPercent = totalTarget === 0 ? 0 : Math.round((totalProgress / totalTarget) * 100);
  const COLORS = ["#4CAF50", "#C8E6C9"];

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-8 bg-[#f6f9f6] min-h-screen">
      <div className="layout-content-container flex flex-col w-full lg:max-w-[960px] flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-wrap justify-between items-center gap-3 p-6 border-b border-[#dfe8df] bg-[#4CAF50]/10">
          <div className="flex flex-col gap-2">
            <p className="text-[#264533] text-[32px] font-bold leading-tight">
              Histórico Completo e Metas
            </p>
            <p className="text-[#264533]/80 text-lg">
              Acompanhe o progresso das suas metas financeiras e prazos definidos.
            </p>
          </div>
          <NewGoalButton onGoalCreated={handleGoalCreated} />
        </div>

        <div className="p-6 border-b border-[#dfe8df] flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <h2 className="text-[#264533] text-[22px] font-bold">Visão Geral das Metas</h2>
            <p className="text-[#264533]/80">
              Seu progresso total está em <b>{totalPercent}%</b> das metas concluídas.
            </p>
          </div>
          <div className="relative w-full md:w-1/2 h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: "Progresso", value: totalProgress },
                    { name: "Restante", value: Math.max(totalTarget - totalProgress, 0) },
                  ]}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-[#264533] font-bold text-2xl">{totalPercent}%</p>
            </div>
          </div>
        </div>

        <GoalsProgress/>
      </div>
    </div>
  );
}

export default GoalsPage;