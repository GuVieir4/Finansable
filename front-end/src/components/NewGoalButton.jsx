import { useState } from "react";
import Modal from "./Modal";
import { createGoal } from "../api";
import { Plus } from "lucide-react";
import Toast from "./Toast";

function NewGoalButton({ onGoalCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    nome: '',
    valorAlvo: '',
    valorAtual: '',
    dataFim: ''
  });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showToast('Usuário não autenticado.', 'error');
      return;
    }
    try {
      const goalData = {
        nome: newGoal.nome,
        valorAlvo: parseFloat(newGoal.valorAlvo),
        valorAtual: parseFloat(newGoal.valorAtual) || 0,
        dataInicio: new Date().toISOString(),
        dataFim: newGoal.dataFim ? new Date(newGoal.dataFim).toISOString() : null,
        usuarioId: parseInt(userId)
      };

      const createdGoal = await createGoal(goalData);

      if (onGoalCreated) onGoalCreated(createdGoal);

      setNewGoal({ nome: '', valorAlvo: '', valorAtual: '', dataFim: '' });
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Erro ao criar meta:", error);
      showToast(`Não foi possível criar a meta: ${error.message}`, "error");
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] transition">
        <Plus size={16} /> Nova Meta
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Meta">
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome da Meta</label>
            <input
              type="text"
              value={newGoal.nome}
              onChange={(e) => setNewGoal({ ...newGoal, nome: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Valor Alvo (R$)</label>
            <input
              type="number"
              step="0.01"
              value={newGoal.valorAlvo}
              onChange={(e) => setNewGoal({ ...newGoal, valorAlvo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Valor Atual (R$)</label>
            <input
              type="number"
              step="0.01"
              value={newGoal.valorAtual}
              onChange={(e) => setNewGoal({ ...newGoal, valorAtual: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Data de Fim</label>
            <input
              type="date"
              value={newGoal.dataFim}
              onChange={(e) => setNewGoal({ ...newGoal, dataFim: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg">
              Criar Meta
            </button>
          </div>
        </form>
      </Modal>
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

export default NewGoalButton;