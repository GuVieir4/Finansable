import { useState, useEffect } from 'react';
import { getGoals, deleteGoal, updateGoal } from '../api';
import { CalendarDays, Pencil, Trash2, Check, X } from "lucide-react";
import NewGoalButton from './NewGoalButton';
import { useLocation, useNavigate } from "react-router-dom";
import Toast from './Toast';

function GoalsProgress() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editForm, setEditForm] = useState({ nome: '', valorAtual: '', valorAlvo: '', dataFim: '' });
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');
      console.log("🔍 GoalsProgress - userId:", userId, "token:", token ? "present" : "missing");

      if (!userId) {
        setError('Usuário não autenticado.');
        setIsLoading(false);
        return;
      }

      try {
        const apiData = await getGoals(userId);

        const mappedGoals = apiData.map(item => ({
          id: item.id,
          nome: item.nome,
          valorAtual: item.valorAtual,
          valorAlvo: item.valorAlvo,
          dataAtual: new Date(),
          dataFim: item.dataFim || 'Indeterminado'
        }));

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

    const handleGoalCreated = (event) => {
      const createdGoal = event.detail;
      const mappedGoal = {
        id: createdGoal.id,
        nome: createdGoal.nome,
        valorAtual: createdGoal.valorAtual,
        valorAlvo: createdGoal.valorAlvo,
        dataAtual: new Date(),
        dataFim: createdGoal.dataFim || "Indeterminado"
      };
      setGoals((prev) => [...prev, mappedGoal]);
      window.dispatchEvent(new CustomEvent('goalsUpdated'));
    };

    window.addEventListener('goalCreated', handleGoalCreated);
    return () => window.removeEventListener('goalCreated', handleGoalCreated);
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteGoal(confirmDelete.id);
      setGoals((prev) => prev.filter((goal) => goal.id !== confirmDelete.id));
      setConfirmDelete({ show: false, id: null });
    } catch (error) {
      console.error("Erro ao excluir meta:", error);
      showToast(`Não foi possível excluir a meta: ${error.message}`, "error");
      setConfirmDelete({ show: false, id: null });
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const handleGoalCreated = (createdGoal) => {
    const mappedGoal = {
      id: createdGoal.id,
      nome: createdGoal.nome,
      valorAtual: createdGoal.valorAtual,
      valorAlvo: createdGoal.valorAlvo,
      dataAtual: new Date(),
      dataFim: createdGoal.dataFim || "Indeterminado"
    };

    setGoals((prev) => [...prev, mappedGoal]);
    window.dispatchEvent(new CustomEvent('goalsUpdated'));
  };

  const handleEdit = (goal) => {
    setEditingGoalId(goal.id);
    setEditForm({
      nome: goal.nome,
      valorAtual: goal.valorAtual.toString(),
      valorAlvo: goal.valorAlvo.toString(),
      dataFim: goal.dataFim && goal.dataFim !== 'Indeterminado' ? goal.dataFim.split('T')[0] : ''
    });
  };

  const handleEditSave = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const updateData = {
        Nome: editForm.nome,
        ValorAtual: parseFloat(editForm.valorAtual.replace(',', '.')),
        ValorAlvo: parseFloat(editForm.valorAlvo.replace(',', '.')),
        DataInicio: new Date().toISOString(),
        DataFim: editForm.dataFim ? new Date(editForm.dataFim).toISOString() : null,
        UsuarioId: parseInt(userId)
      };

      await updateGoal(editingGoalId, updateData);

      setGoals((prev) => prev.map(goal =>
        goal.id === editingGoalId
          ? {
              ...goal,
              nome: editForm.nome,
              valorAtual: parseFloat(editForm.valorAtual.replace(',', '.')),
              valorAlvo: parseFloat(editForm.valorAlvo.replace(',', '.')),
              dataFim: editForm.dataFim || 'Indeterminado'
            }
          : goal
      ));

      setEditingGoalId(null);
      setEditForm({ nome: '', valorAtual: '', valorAlvo: '', dataFim: '' });
      window.dispatchEvent(new CustomEvent('goalsUpdated'));
    } catch (error) {
      console.error("Erro ao editar meta:", error);
      showToast("Erro ao editar meta. Tente novamente.", "error");
    }
  };

  const handleEditCancel = () => {
    setEditingGoalId(null);
    setEditForm({ nome: '', valorAtual: '', valorAlvo: '', dataFim: '' });
  };

  if (isLoading) return <p className="p-6">Carregando metas...</p>;
  if (error) return <p className="p-6 text-red-600 font-medium">{error}</p>;

  return (
    <section className="p-3">
      {location.pathname === "/" && (
        <div className='flex justify-between items-center mb-4 mt-5'>
        <h2 className="text-[#131711] text-[20px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">
          Progresso nas Metas <i className="fa-solid fa-bullseye"></i>
        </h2>
        <button
          onClick={() => navigate('/goals')}
          className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#45a049] transition"
        >
          Ver Todas as Metas
        </button>
        </div>
      )}

      {goals.length === 0 && (
        <p className="p-6 text-center text-[#366348]">
          Nenhuma meta cadastrada ainda. Clique em <strong>Nova Meta</strong> para começar.
        </p>
      )}

      <div className="flex flex-col gap-5 mt-9">
        {(() => {
          const displayedGoals = location.pathname === "/" ? goals
            .map(goal => ({ ...goal, percent: goal.valorAlvo > 0 ? Math.min((goal.valorAtual / goal.valorAlvo) * 100, 100) : 0 }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 3) : goals;
          return displayedGoals.map((goal) => {
          const percent = goal.valorAlvo > 0 ? Math.min((goal.valorAtual / goal.valorAlvo) * 100, 100) : 0;
          const isDone = percent >= 100;
          const isValidDate = goal.dataFim && !isNaN(new Date(goal.dataFim));

          return (
            <div key={goal.id} className={`flex flex-col gap-3 rounded-xl border p-5 transition ${isDone ? "bg-[#D0EAD2] border-[#81C784] hover:shadow-md" : "bg-[#ffffff] border-[#dfe8df] hover:shadow-md"
              }`}>
              {editingGoalId === goal.id ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-sm font-medium text-[#264533]">Nome da Meta</label>
                    <input
                      type="text"
                      value={editForm.nome}
                      onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
                      className="w-full border border-[#dfe8df] rounded-lg p-2 mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-[#264533]">Valor Atual</label>
                      <input
                        type="number"
                        value={editForm.valorAtual}
                        onChange={(e) => setEditForm({...editForm, valorAtual: e.target.value})}
                        className="w-full border border-[#dfe8df] rounded-lg p-2 mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-[#264533]">Valor Alvo</label>
                      <input
                        type="number"
                        value={editForm.valorAlvo}
                        onChange={(e) => setEditForm({...editForm, valorAlvo: e.target.value})}
                        className="w-full border border-[#dfe8df] rounded-lg p-2 mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#264533]">Data Fim</label>
                    <input
                      type="date"
                      value={editForm.dataFim}
                      onChange={(e) => setEditForm({...editForm, dataFim: e.target.value})}
                      className="w-full border border-[#dfe8df] rounded-lg p-2 mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#264533] font-semibold text-lg">{goal.nome}</p>
                    <div className="flex items-center gap-2 text-sm text-[#366348]">
                      <CalendarDays size={14} />
                      <span>
                        Prazo: {isValidDate ? new Date(goal.dataFim).toLocaleDateString("pt-BR") : goal.dataFim}
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
              )}

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-700 ${isDone ? "bg-[#388E3C]" : "bg-[#4CAF50]"}`} style={{ width: `${percent}%` }} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {editingGoalId === goal.id ? (
                  <>
                    <button
                      onClick={handleEditSave}
                      className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium transition"
                    >
                      <Check size={16} /> Salvar
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium transition"
                    >
                      <X size={16} /> Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(goal)}
                      className="flex items-center gap-1 text-[#4CAF50] hover:text-[#388E3C] text-sm font-medium transition"
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition"
                    >
                      <Trash2 size={16} /> Excluir
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        });
        })()}
      </div>
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
            <p className="text-[#264533] mb-6">Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.</p>
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
    </section>
  );
}

export default GoalsProgress;
