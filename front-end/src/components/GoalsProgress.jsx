import { useState, useEffect } from 'react';
import { getGoals, deleteGoal } from '../api'; 
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

function GoalsProgress() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const apiData = await getGoals();
        
        const mappedGoals = apiData.map(item => {
          return {
            id: item.id, 
            nome: item.nome,
            valorAtual: item.valorAtual,
            valorAlvo: item.valorAlvo,
            dataAtual: new Date(),
            dataFim: item.dataFim || 'Inderteminado' 
          };
        });
        setGoals(mappedGoals);
        setError(null);
      } catch (error) {
        console.error("Erro ao buscar metas:", error);
        setError('Erro ao carregar as metas.');
        setGoals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta meta?");
    if (confirmDelete) {
      try {
        await deleteGoal(id);
        
        setGoals((prev) => prev.filter((goal) => goal.id !== id));

      } catch (error) {
        console.error("Erro ao excluir meta:", error);
        alert(`Não foi possível excluir a meta: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return <p className="p-6">Carregando metas...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600 font-medium">{error}</p>;
  }
  
  if (goals.length === 0) {
    return <p className="p-6">Nenhuma meta cadastrada, crie uma nova meta!</p>;
  }

  return (
    <section className="p-3">
      <div className="flex flex-col gap-5">
        {goals.map((goal) => {
          const percent = (goal.valorAlvo > 0) ? Math.min((goal.valorAtual / goal.valorAlvo) * 100, 100) : 0;
          const isDone = percent >= 100;
          
          const isValidDate = goal.dataFim && !isNaN(new Date(goal.dataFim));

          return (
            <div key={goal.id} className={`flex flex-col gap-3 rounded-xl border p-5 transition ${
                isDone
                  ? "bg-[#D0EAD2] border-[#81C784] hover:shadow-md"
                  : "bg-[#ffffff] border-[#dfe8df] hover:shadow-md"
              }`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#264533] font-semibold text-lg">{goal.nome}</p>
                  <div className="flex items-center gap-2 text-sm text-[#366348]">
                    <CalendarDays size={14} color={isDone ? "#000" : goal.dataAtual < new Date(goal.dataFim) ? "#000" : "red"}/>
                    <span className={`
                      ${isDone ? "text-[#000]" : isValidDate ? (goal.dataAtual < new Date(goal.dataFim) ? "text-[#000]" : "text-red-500") : "text-[#000]"}`}>
                      Prazo:{" "}
                      {isValidDate ? new Date(goal.dataFim).toLocaleDateString("pt-BR", {timeZone: "UTC",}) : goal.dataFim}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#264533] text-sm font-medium">
                    R$ {goal.valorAtual.toLocaleString('pt-BR')} / R$ {goal.valorAlvo.toLocaleString('pt-BR')}
                  </p>
                  <p className={`text-sm font-medium ${isDone ? "text-[#388E3C]" : "text-[#366348]"}`}>
                    {percent.toFixed(0)}% concluído
                  </p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-700 ${isDone ? "bg-[#388E3C]" : "bg-[#4CAF50]"}`}
                  style={{ width: `${percent}%` }}>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button className="flex items-center gap-1 text-[#4CAF50] hover:text-[#388E3C] text-sm font-medium transition">
                  <Pencil size={16} /> Editar
                </button>
                <button onClick={() => handleDelete(goal.id)}  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition">
                  <Trash2 size={16} /> Excluir
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}

export default GoalsProgress;