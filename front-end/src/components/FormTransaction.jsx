import React, { useState } from "react";

export default function FormTransaction({ onClose }) {
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [data, setData] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const dataToSend = {
      categoria,
      descricao,
      valor: parseFloat(valor),
      tipo,
      data,
    };

    console.log("Nova Movimentação", dataToSend);

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-700 text-center">
        Nova Movimentação
      </h2>

      <select
        value={categoria}
        onChange={(event) => setCategoria(event.target.value)}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Selecione a categoria</option>
        <option value="salario">Salário</option>
        <option value="alimentacao">Alimentação</option>
        <option value="lazer">Lazer</option>
        <option value="outros">Outros</option>
      </select>

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(event) => setDescricao(event.target.value)}
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
        value={tipo}
        onChange={(event) => setTipo(event.target.value)}
        className="w-full border rounded-lg p-2"
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <input
        type="date"
        value={data}
        onChange={(event) => setData(event.target.value)}
        className="w-full border rounded-lg p-2"
        required
      />

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