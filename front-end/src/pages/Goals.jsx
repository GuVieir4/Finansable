import { useState, useEffect } from "react";
import { PlusCircle, CalendarDays, Pencil, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Modal from "../components/Modal";
import { getGoals, createGoal, deleteGoal, updateGoal } from "../api/routes/usuario";
import Toast from "../components/Toast";

function Goals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, index: null });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.index === null) return;
    try {
      const goalId = goals[confirmDelete.index].id;
      await deleteGoal(goalId);
      setGoals((prev) => prev.filter((_, i) => i !== confirmDelete.index));
      setConfirmDelete({ show: false, index: null });
      // Notify dashboard to recalculate happiness
      window.dispatchEvent(new CustomEvent('goalsUpdated'));
    } catch (error) {
      console.error("Erro ao excluir meta:", error);
      showToast("Erro ao excluir meta. Tente novamente.", "error");
      setConfirmDelete({ show: false, index: null });
    }
  };

  useEffect(() => {
    const fetchGoals = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Usuário não autenticado.');
        setIsLoading(false);
        return;
      }

      try {
        const apiData = await getGoals(userId);
        const mappedGoals = apiData.map(item => ({
          id: item.id,
          title: item.nome,
          target: item.valorAlvo,
          progress: item.valorAtual,
          deadline: item.dataFim || 'Indeterminado'
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
  }, []);

  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editProgress, setEditProgress] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalProgress = goals.reduce((sum, g) => sum + g.progress, 0);
  const totalPercent = totalTarget === 0 ? 0 : Math.round((totalProgress / totalTarget) * 100);
  const COLORS = ["#4CAF50", "#C8E6C9"];

  const handleSave = async (e) => {
    e.preventDefault();
    const parsedTarget = parseFloat(String(newTarget).replace(",", "."));
    if (!newTitle.trim() || !parsedTarget || parsedTarget <= 0 || !newDeadline.trim()) {
      showToast("Preencha todos os campos corretamente!", "error");
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const goalData = {
        nome: newTitle.trim(),
        valorAlvo: parsedTarget,
        valorAtual: 0,
        dataFim: newDeadline,
        usuarioId: parseInt(userId)
      };

      const createdGoal = await createGoal(goalData);
      const mappedGoal = {
        id: createdGoal.id,
        title: createdGoal.nome,
        target: createdGoal.valorAlvo,
        progress: createdGoal.valorAtual,
        deadline: createdGoal.dataFim || 'Indeterminado'
      };

      setGoals((prev) => [mappedGoal, ...prev]);
      setNewTitle("");
      setNewTarget("");
      setNewDeadline("");
      setIsModalOpen(false);
      // Notify dashboard to recalculate happiness
      window.dispatchEvent(new CustomEvent('goalsUpdated'));
    } catch (error) {
      console.error("Erro ao criar meta:", error);
      showToast("Erro ao criar meta. Tente novamente.", "error");
    }
  };

  const openEditModal = (index) => {
    const goal = goals[index];
    setEditingGoalIndex(index);
    setEditTitle(goal.title);
    setEditTarget(goal.target);
    setEditProgress(goal.progress);
    setEditDeadline(goal.deadline);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const parsedTarget = parseFloat(String(editTarget).replace(",", "."));
    const parsedProgress = parseFloat(String(editProgress).replace(",", "."));
    if (!editTitle.trim() || parsedTarget <= 0 || parsedProgress < 0 || !editDeadline.trim()) {
      showToast("Preencha todos os campos corretamente!", "error");
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const goalId = goals[editingGoalIndex].id;
      const updateData = {
        nome: editTitle.trim(),
        valorAtual: parsedProgress,
        valorAlvo: parsedTarget,
        dataInicio: new Date().toISOString(),
        dataFim: new Date(editDeadline).toISOString(),
        usuarioId: parseInt(userId)
      };

      await updateGoal(goalId, updateData);

      // Update local state
      setGoals((prev) =>
        prev.map((g, i) =>
          i === editingGoalIndex
            ? { ...g, title: editTitle, target: parsedTarget, progress: parsedProgress, deadline: editDeadline }
            : g
        )
      );

      setIsEditModalOpen(false);
      // Notify dashboard to recalculate happiness
      window.dispatchEvent(new CustomEvent('goalsUpdated'));
    } catch (error) {
      console.error("Erro ao editar meta:", error);
      showToast("Erro ao editar meta. Tente novamente.", "error");
    }
  };

  const handleDelete = (index) => {
    setConfirmDelete({ show: true, index });
  };

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
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#4CAF50] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#3b8d40] transition"
          >
            <PlusCircle size={20} />
            Nova Meta
          </button>
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

        <div className="p-6">
          <h2 className="text-[#264533] text-[22px] font-bold pb-3">Metas Financeiras</h2>
          <div className="flex flex-col gap-5">
            {goals.map((goal, index) => {
              const percent = Math.min((goal.progress / goal.target) * 100, 100);
              const isDone = percent >= 100;
              return (
                <div
                  key={index}
                  className={`flex flex-col gap-3 rounded-xl border p-5 transition ${
                    isDone
                      ? "bg-[#e8f5e9] border-[#81C784]"
                      : "bg-[#ffffff] border-[#dfe8df] hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#264533] font-semibold text-lg">{goal.title}</p>
                      <div className="flex items-center gap-2 text-sm text-[#366348]/70">
                        <CalendarDays size={14} />
                        <span>
                          Prazo:{" "}
                          {goal.deadline && goal.deadline !== 'Indeterminado' && !isNaN(new Date(goal.deadline))
                            ? new Date(goal.deadline).toLocaleDateString("pt-BR", { timeZone: "UTC" })
                            : goal.deadline || 'Indeterminado'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#264533] text-sm font-medium">
                        R$ {goal.progress.toLocaleString()} / R$ {goal.target.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          isDone ? "text-[#388E3C]" : "text-[#366348]/70"
                        }`}
                      >
                        {percent.toFixed(0)}% concluído
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        isDone ? "bg-[#388E3C]" : "bg-[#4CAF50]"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => openEditModal(index)}
                      className="flex items-center gap-1 text-[#4CAF50] hover:text-[#388E3C] text-sm font-medium transition"
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition"
                    >
                      <Trash2 size={16} /> Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-bold text-[#264533] mb-4">Adicionar Nova Meta</h3>
        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          <div>
            <label className="text-sm font-medium text-[#264533]">Título</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Viagem dos sonhos"
              className="w-full border border-[#dfe8df] rounded-lg p-2 outline-none focus:border-[#4CAF50]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#264533]">Valor (R$)</label>
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="Ex: 5000"
              className="w-full border border-[#dfe8df] rounded-lg p-2 outline-none focus:border-[#4CAF50]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#264533]">Prazo</label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full border border-[#dfe8df] rounded-lg p-2 outline-none focus:border-[#4CAF50]"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-[#4CAF50] text-white py-2 rounded-lg hover:bg-[#3b8d40] transition"
            >
              Salvar Meta
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 border border-[#dfe8df] py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h3 className="text-xl font-bold text-[#264533] mb-4">Editar Meta</h3>
        <form className="flex flex-col gap-4" onSubmit={handleEditSave}>
          <div>
            <label className="text-sm font-medium text-[#264533]">Título</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-[#dfe8df] rounded-lg p-2 outline-none focus:border-[#4CAF50]"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-[#264533]">Valor Total (R$)</label>
              <input
                type="number"
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value)}
                className="w-full border border-[#dfe8df] rounded-lg p-2 outline-none focus:border-[#4CAF50]"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-[#264533]">Progresso (R$)</label>
              <input
                type="number"
                value={editProgress}
                onChange={(e) => setEditProgress(e.target.value)}
                className="w-full border border-[#dfe8df] rounded-lg p-2 outline-none focus:border-[#4CAF50]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#264533]">Prazo</label>
            <input
              type="date"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              className="w-full border border-[#dfe8df] rounded-lg p-2 outline-none focus:border-[#4CAF50]"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-[#4CAF50] text-white py-2 rounded-lg hover:bg-[#3b8d40] transition"
            >
              Salvar Alterações
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 border border-[#dfe8df] py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
      {confirmDelete.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-[#264533] text-xl font-bold">Confirmar Exclusão</h2>
              <button
                onClick={() => setConfirmDelete({ show: false, index: null })}
                className="text-[#366348] hover:text-[#264533]"
              >
                ✕
              </button>
            </div>
            <p className="text-[#264533] mb-6">Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete({ show: false, index: null })}
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
    </div>
  );
}

export default Goals;