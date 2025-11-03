export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#4C6858] p-5 font-martian">
      <div className="border border-[#38E07A] rounded-2xl w-full lg:max-w-[500px] p-8 flex flex-col justify-center items-center text-center bg-[#1a2b20] backdrop-blur-md shadow-lg">
        <h1 className="text-[#38E07A] text-[90px] font-extrabold w-full break-words">
          404<span role="img" aria-label="thinking">🧐</span>
        </h1>

        <h3 className="text-white mt-4 uppercase text-2xl font-semibold tracking-wide">
          Página não encontrada
        </h3>

        <h6 className="text-gray-300 mt-3 text-base">
          A página que você está procurando não existe.
        </h6>

        <a href="/" className="mt-8 border border-[#38E07A] text-[#38E07A] rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-[#38E07A] hover:text-[#131711] hover:scale-105">
          Voltar para a página principal
        </a>
      </div>
    </div>
  );
}
