function Plans() {
  const handleCheckout = () => {
  window.open(
    "https://buy.stripe.com/test_dRmfZj1zqafhgMS8E6cZa00",
    "_blank",
  );
};


  return (
    <main className="flex-grow">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-[#2E7D32] mb-4">
              Escolha o plano certo para você
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-black/60 dark:text-[#2E7D32]">
              Controle suas finanças com a ferramenta perfeita para suas necessidades.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">

            <div className="border border-black/10 dark:border-white/10 rounded-xl p-8 flex flex-col bg-white/50 dark:bg-[#2E7D32]">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Básico</h3>
                <p className="text-4xl font-extrabold text-black dark:text-white mb-1">
                  Grátis <span className="text-base font-medium text-black/60 dark:text-white/60">para sempre</span>
                </p>
                <p className="text-sm text-black/60 dark:text-white/60 mb-8">
                  Perfeito para começar a organizar suas finanças pessoais.
                </p>

                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-[#38e07b] text-[14px]"></i>
                    </div>
                    <span className="text-black dark:text-white">Gerenciamento de gastos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-[#38e07b] text-[14px]"></i>
                    </div>
                    <span className="text-black dark:text-white">Categorização de transações</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-[#38e07b] text-[14px]"></i>
                    </div>
                    <span className="text-black dark:text-white">Resumos financeiros</span>
                  </li>
                </ul>
              </div>
              <a className="mt-8 w-full text-center bg-black/5 dark:bg-[#264533] text-black dark:text-white font-semibold py-3 rounded-lg hover:bg-black/10 dark:hover:bg-white/20 transition-colors" href="#">
                Começar Grátis
              </a>
            </div>

            <div className="relative border border-[#38e07b] rounded-xl p-8 flex flex-col bg-[#264533]">
              <div className="absolute top-0 right-8 -mt-3">
                <span className="bg-[#38e07b] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Mais Popular
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Premium</h3>
                <p className="text-4xl font-extrabold text-black dark:text-white mb-1">
                  R$ 29,99
                  <span className="text-base font-medium text-black/60 dark:text-white/60">/mês</span>
                </p>
                <p className="text-sm text-black/60 dark:text-white/60 mb-8">
                  Desbloqueie todo o potencial do Finansable.
                </p>

                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-[#38e07b] text-[14px]"></i>
                    </div>
                    <span className="font-semibold text-black dark:text-white">
                      Todos os recursos do plano Básico
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-[#38e07b] text-[14px]"></i>
                    </div>
                    <span className="text-black dark:text-white">Relatórios avançados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-[#38e07b] text-[14px]"></i>
                    </div>
                    <span className="text-black dark:text-white">Orçamentos personalizados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-[#38e07b] text-[14px]"></i>
                    </div>
                    <span className="text-black dark:text-white">Suporte prioritário</span>
                  </li>
                </ul>
              </div>

              <button className="mt-8 w-full text-center bg-[#38e07b] text-white font-semibold py-3 rounded-lg hover:bg-[#38e07b]/90 transition-colors" onClick={handleCheckout}>
                Escolher Plano Premium
              </button>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default Plans;
