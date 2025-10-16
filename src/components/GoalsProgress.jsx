function GoalsProgress() {
  const goals = [
    { titulo: "Economia para Viagem", progresso: 60, valor: "R$ 6.000 de R$ 10.000" },
    { titulo: "Compra do Carro", progresso: 30, valor: "R$ 15.000 de R$ 50.000" },
    { titulo: "Moto do Dan", progresso: 40, valor: "R$ 32.000 de R$ 80.000" },
  ];

  return (
    <section>
      {goals.map((meta, index) => (
        <div key={index} className="flex flex-col gap-3 p-4">
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