import React, { useState, useEffect } from "react";
import { createTransaction, updateTransaction, getGoals } from "../api";

export default function FormTransaction({ onClose, onSuccess, transactionToEdit }) {
  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [tipoMovimentacao, setTipoMovimentacao] = useState(1);
  const [data, setData] = useState("");
  const [poupancaId, setPoupancaId] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [goals, setGoals] = useState([]);
  const [errors, setErrors] = useState({});

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

    // Define data padrão como hoje
    const today = new Date().toISOString().split('T')[0];
    setData(today);
  }, []);

  useEffect(() => {
    if (transactionToEdit) {
      setCategoria(transactionToEdit.tipoCategoria?.toString() || "");
      setNome(transactionToEdit.nome || "");
      setValor(Math.abs(transactionToEdit.valor)?.toString() || "");
      setTipoMovimentacao(transactionToEdit.tipoMovimentacao?.toString() || "1");
      setData(transactionToEdit.data ? new Date(transactionToEdit.data).toISOString().split('T')[0] : "");
      setPoupancaId(transactionToEdit.poupancaId?.toString() || "");
      if (transactionToEdit.tipoCategoria === 5) {
        setSelectedGoalId(transactionToEdit.poupancaId?.toString() || "");
      }
    }
  }, [transactionToEdit]);

  // Quando categoria mudar para meta, limpar erros
  useEffect(() => {
    if (categoria !== "5") {
      setSelectedGoalId("");
      setErrors({});
    }
  }, [categoria]);

  // Atualizar nome automaticamente quando meta for selecionada
  useEffect(() => {
    if (selectedGoalId && categoria === "5") {
      const selectedGoal = goals.find(g => g.id.toString() === selectedGoalId);
      if (selectedGoal && nome.startsWith("Meta: ")) {
        // Se já começa com "Meta: ", apenas atualizar o nome da meta
        setNome(`Meta: ${selectedGoal.nome}`);
      } else if (selectedGoal) {
        setNome(`Meta: ${selectedGoal.nome}`);
      }
    }
  }, [selectedGoalId, goals, categoria]);

  const validateForm = () => {
    const newErrors = {};

    // Validar se meta foi selecionada quando categoria for "meta"
    if (categoria === "5" && !selectedGoalId) {
      newErrors.goalId = "Selecione uma meta para transações da categoria Meta";
    }

    // Validar data (não pode ser no futuro)
    const selectedDate = new Date(data);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fim do dia atual
    
    if (selectedDate > today) {
      newErrors.data = "A data não pode ser no futuro";
    }

    // Validar valor de saída quando categoria for meta
    if (categoria === "5" && tipoMovimentacao === "0" && selectedGoalId) {
      const selectedGoal = goals.find(g => g.id.toString() === selectedGoalId);
      if (selectedGoal) {
        const valorAtualMeta = parseFloat(selectedGoal.valorAtual);
        const valorRetirada = parseFloat(valor);
        
        if (valorRetirada > valorAtualMeta) {
          newErrors.valor = `O valor de retirada (R$ ${valorRetirada.toFixed(2)}) não pode ser maior que o valor atual da meta (R$ ${valorAtualMeta.toFixed(2)})`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userId = localStorage.getItem('userId');

    // Ajustar nome se categoria for meta e meta foi selecionada
    let finalNome = nome;
    if (categoria === "5" && selectedGoalId) {
      const selectedGoal = goals.find(g => g.id.toString() === selectedGoalId);
      if (selectedGoal && !nome.startsWith("Meta: ")) {
        finalNome = `Meta: ${selectedGoal.nome}`;
      }
    }

    const dataToSend = {
      usuarioId: parseInt(userId),
      nome: finalNome,
      valor: parseFloat(valor),
      tipoCategoria: parseInt(categoria),
      tipoMeioPagamento: 0, // Default
      tipoMovimentacao: parseInt(tipoMovimentacao),
      data: new Date(data).toISOString(),
      poupancaId: categoria === "5" && selectedGoalId ? parseInt(selectedGoalId) : null,
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

  const isMetaCategory = categoria === "5";
  const availableGoals = goals;

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
        <option value="5">Meta ★</option>
      </select>

      {isMetaCategory && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Categoria Meta:</strong> Para transações relacionadas às suas metas financeiras.
            <br />• Entradas: Adicionar valor à meta
            <br />• Saídas: Retirar valor da meta (não pode ser maior que o valor atual)
          </p>
        </div>
      )}

      {isMetaCategory && (
        <select
          value={selectedGoalId}
          onChange={(event) => setSelectedGoalId(event.target.value)}
          className="w-full border rounded-lg p-2"
          required
        >
          <option value="">Selecione uma meta</option>
          {availableGoals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.nome} - Atual: R$ {goal.valorAtual.toLocaleString('pt-BR')} / Meta: R$ {goal.valorAlvo.toLocaleString('pt-BR')}
            </option>
          ))}
        </select>
      )}
      {errors.goalId && <p className="text-red-500 text-sm">{errors.goalId}</p>}

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
        step="0.01"
        min="0"
      />
      {errors.valor && <p className="text-red-500 text-sm">{errors.valor}</p>}

      <select
        value={tipoMovimentacao}
        onChange={(event) => setTipoMovimentacao(event.target.value)}
        className="w-full border rounded-lg p-2"
        required
      >
        <option value="1">Entrada</option>
        <option value="0">Saída</option>
      </select>

      <div>
        <input
          type="date"
          value={data}
          onChange={(event) => setData(event.target.value)}
          className="w-full border rounded-lg p-2"
          required
          max={new Date().toISOString().split('T')[0]} // Não permite datas futuras
        />
        {errors.data && <p className="text-red-500 text-sm">{errors.data}</p>}
      </div>

      {!isMetaCategory && (
        <select
          value={poupancaId}
          onChange={(event) => setPoupancaId(event.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Selecione uma meta (opcional)</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.nome} - R$ {goal.valorAtual.toLocaleString('pt-BR')} / R$ {goal.valorAlvo.toLocaleString('pt-BR')}
            </option>
          ))}
        </select>
      )}

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