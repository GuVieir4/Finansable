import { useState, useEffect } from 'react';
import { getGoals } from '../api';

function GoalsProgress() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const apiData = await getGoals();
        
        const mappedGoals = apiData.map(item => {
          const progresso = item.valorAlvo > 0 
            ? Math.round((item.valorAtual / item.valorAlvo) * 100) 
            : 0;

          const valorFormatado = `R$ ${item.valorAtual.toLocaleString('pt-BR')} de R$ ${item.valorAlvo.toLocaleString('pt-BR')}`;

          return {
            titulo: item.nome,
            progresso: progresso,
            valor: valorFormatado
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

  if (isLoading) {
    return <p className="p-4">Carregando metas...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600 font-medium">{error}</p>;
  }
  
  if (goals.length === 0) {
    return <p className="p-4">Nenhuma meta cadastrada, crie uma nova meta!</p>;
  }

  return (
    <section>
      {goals.map((meta, index) => (
        <div key={meta.titulo + index} className="flex flex-col gap-3 p-4 border-b border-gray-200">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <p className="text-[#131711] text-base sm:text-lg font-medium leading-normal"> {meta.titulo} </p>
            <p className="text-[#131711] text-sm font-normal leading-normal"> {meta.progresso}% </p> 
          </div>
          <div className="rounded bg-[#dee5dc] w-full">
            <div className="h-2 rounded bg-[#38E07A]" style={{ width: `${meta.progresso}%` }}></div>
          </div>
          <p className="text-[#000] text-sm font-normal leading-normal"> {meta.valor} </p>
        </div>
      ))}
    </section>
  );
}

export default GoalsProgress;