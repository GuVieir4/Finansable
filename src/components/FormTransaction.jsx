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
      <h2 className="text-xl font-semibold mb-2 text-gray-700">
        Nova Movimentação
      </h2>

      <select value={categoria} onChange={(event) => setCategoria(event.target.value)}
        className="w-full border rounded-lg p-2">
        <option value="">Selecione a categoria</option>
        <option value="salario">Salário</option>
        <option value="alimentacao">Alimentação</option>
        <option value="lazer">Lazer</option>
        <option value="outros">Outros</option>
      </select>

      <input type="text" placeholder="Descrição" value={descricao} onChange={(event) => setDescricao(event.target.value)}
        className="w-full border rounded-lg p-2" required />

      <input type="number" placeholder="Valor (R$)" value={valor} onChange={(event) => setValor(event.target.value)}
        className="w-full border rounded-lg p-2"required />

      <select value={tipo} onChange={(event) => setTipo(event.target.value)}
        className="w-full border rounded-lg p-2">
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <input type="date" value={data} onChange={(event) => setData(event.target.value)}
        className="w-full border rounded-lg p-2" required />

      <div className="flex justify-end gap-3 mt-4">
        <button type="button" onClick={onClose}
          className="px-3 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
          Cancelar
        </button>

        <button type="submit" className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
          Salvar
        </button>
      </div>
    </form>
  );
}