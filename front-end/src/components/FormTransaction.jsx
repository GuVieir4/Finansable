import React, { useState, useEffect } from "react";
import { createTransaction, updateTransaction, getGoals } from "../api";

export default function FormTransaction({ onClose, onSuccess, transactionToEdit }) {
  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [tipoMovimentacao, setTipoMovimentacao] = useState(1);
  const [data, setData] = useState("");
  const [poupancaId, setPoupancaId] = useState("");
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const goalsData = await getGoals(userId);
          setGoals(goalsData);
        } catch (error) {
          console.error("Erro ao buscar metas:", error);
        }
      }
    };
    fetchGoals();
  }, []);

  useEffect(() => {
    if (transactionToEdit) {
      setCategoria(transactionToEdit.tipoCategoria?.toString() || "");
      setNome(transactionToEdit.nome || "");
      setValor(Math.abs(transactionToEdit.valor)?.toString() || "");
      setTipoMovimentacao(transactionToEdit.tipoMovimentacao?.toString() || "1");
      setData(transactionToEdit.data ? new Date(transactionToEdit.data).toISOString().split('T')[0] : "");
      setPoupancaId(transactionToEdit.poupancaId?.toString() || "");
    }
  }, [transactionToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem('userId');

    const dataToSend = {
      usuarioId: parseInt(userId),
      nome,
      valor: parseFloat(valor),
      tipoCategoria: parseInt(categoria),
      tipoMeioPagamento: 0, // Default
      tipoMovimentacao: parseInt(tipoMovimentacao),
      data: new Date(data).toISOString(),
      poupancaId: poupancaId ? parseInt(poupancaId) : null,
    };

    try {
      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, dataToSend);
      } else {
        await createTransaction(dataToSend);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={categoria}
        onChange={(event) => setCategoria(event.target.value)}
        className="w-full border rounded-lg p-2"
        required
      >
        <option value="">Selecione a categoria</option>
        <option value="0">Alimentação</option>
        <option value="1">Transporte</option>
        <option value="2">Contas</option>
        <option value="3">Renda</option>
        <option value="4">Despesa</option>
      </select>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
        className="w-full border rounded-lg p-2"
        required
      />

      <input
        type="number"
        placeholder="Valor (R$)"
        value={valor}
        onChange={(event) => setValor(event.target.value)}
        className="w-full border rounded-lg p-2"
        required
      />

      <select
        value={tipoMovimentacao}
        onChange={(event) => setTipoMovimentacao(event.target.value)}
        className="w-full border rounded-lg p-2"
        required
      >
        <option value="1">Entrada</option>
        <option value="0">Saída</option>
      </select>

      <input
        type="date"
        value={data}
        onChange={(event) => setData(event.target.value)}
        className="w-full border rounded-lg p-2"
        required
      />

      <select
        value={poupancaId}
        onChange={(event) => setPoupancaId(event.target.value)}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Selecione uma meta (opcional)</option>
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.nome} - R$ {goal.valorAtual} / R$ {goal.valorAlvo}
          </option>
        ))}
      </select>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="w-1/2 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="w-1/2 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}