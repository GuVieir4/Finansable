import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../api";
import Modal from "../components/Modal";

export default function Register() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validacoes, setValidacoes] = useState({
    cpf: { valido: null, mensagem: "" },
    email: { valido: null, mensagem: "" },
    senha: { valido: null, mensagem: "" },
    nome: { valido: null, mensagem: "" }
  });
  const navigate = useNavigate();

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  // Funções de validação
  const validarCpf = (cpf) => {
    if (!cpf) return { valido: false, mensagem: "CPF é obrigatório" };
    
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    if (cpfLimpo.length !== 11) return { valido: false, mensagem: "CPF deve ter 11 dígitos" };
    
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return { valido: false, mensagem: "CPF inválido" };
    
    // Calcula primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    
    // Calcula segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cpfLimpo.charAt(9)) !== digito1 || parseInt(cpfLimpo.charAt(10)) !== digito2) {
      return { valido: false, mensagem: "CPF inválido" };
    }
    
    return { valido: true, mensagem: "" };
  };

  const validarEmail = (email) => {
    if (!email) return { valido: false, mensagem: "Email é obrigatório" };
    
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) return { valido: false, mensagem: "Email inválido" };
    
    return { valido: true, mensagem: "" };
  };

  const validarSenha = (senha) => {
    if (!senha) return { valido: false, mensagem: "Senha é obrigatória" };
    
    if (senha.length < 8) return { valido: false, mensagem: "Senha deve ter pelo menos 8 caracteres" };
    
    const caracteresEspeciais = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!senha.split('').some(char => caracteresEspeciais.includes(char))) {
      return { valido: false, mensagem: "Senha deve conter pelo menos um caractere especial" };
    }
    
    return { valido: true, mensagem: "" };
  };

  const validarNome = (nome) => {
    if (!nome || nome.trim().length === 0) return { valido: false, mensagem: "Nome é obrigatório" };
    if (nome.trim().length < 2) return { valido: false, mensagem: "Nome deve ter pelo menos 2 caracteres" };
    if (nome.length > 100) return { valido: false, mensagem: "Nome deve ter no máximo 100 caracteres" };
    
    return { valido: true, mensagem: "" };
  };

  const handleInputChange = (campo, valor) => {
    let validacao;
    
    switch (campo) {
      case 'cpf':
        setCpf(valor);
        validacao = validarCpf(valor);
        break;
      case 'email':
        setEmail(valor);
        validacao = validarEmail(valor);
        break;
      case 'senha':
        setSenha(valor);
        validacao = validarSenha(valor);
        break;
      case 'nome':
        setNome(valor);
        validacao = validarNome(valor);
        break;
    }
    
    setValidacoes(prev => ({
      ...prev,
      [campo]: validacao
    }));
  };

  const isFormValido = () => {
    const nomeValidacao = validarNome(nome);
    const cpfValidacao = validarCpf(cpf);
    const emailValidacao = validarEmail(email);
    const senhaValidacao = validarSenha(senha);
    
    return nomeValidacao.valido && cpfValidacao.valido && emailValidacao.valido && senhaValidacao.valido;
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!isFormValido()) {
      setErro("Por favor, corrija os erros no formulário");
      return;
    }

    setErro("");
    setStep(2);
  };

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
    handleSubmit(planType);
  };

  const handleSubmit = async (tipoUsuario) => {
    setLoading(true);
    setErro("");

    try {
      const userData = {
        Nome: nome,
        CPF: cpf,
        Email: email,
        Senha: senha,
        TipoUsuario: tipoUsuario
      };

      const response = await createUser(userData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("❌ Registration failed:", error);

      let mensagemErro = "Erro ao criar conta. Verifique os dados.";

      if (error.response && error.response.data) {
        if (error.response.data.message) {
          mensagemErro = error.response.data.message;
        } else if (error.response.data.errors) {
          // Se há erros de validação do backend
          const erros = Object.values(error.response.data.errors).flat();
          mensagemErro = erros.join(', ');
        }
      }

      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErro("");
  };

  const formatarCpf = (valor) => {
    const cpfLimpo = valor.replace(/[^\d]/g, '');
    if (cpfLimpo.length <= 11) {
      return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return valor;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex flex-1 justify-center items-center px-4 sm:px-10 lg:px-40 py-5">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-[#264533]">
                Finansable
              </h1>
              <p className="mt-4 text-sm text-gray-600">
                {step === 1 ? "Crie sua conta para começar a gerenciar suas finanças." : "Escolha o plano que melhor se adapta às suas necessidades."}
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Seu nome completo"
                      required
                      className={`block w-full appearance-none rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm ${
                        validacoes.nome.valido === false
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-[#1dc92e] focus:ring-[#1dc92e]'
                      }`}
                    />
                    {validacoes.nome.valido === false && (
                      <p className="mt-1 text-xs text-red-600">{validacoes.nome.mensagem}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={cpf}
                      onChange={(e) => handleInputChange('cpf', formatarCpf(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength="14"
                      required
                      className={`block w-full appearance-none rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm ${
                        validacoes.cpf.valido === false
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : validacoes.cpf.valido === true
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#1dc92e] focus:ring-[#1dc92e]'
                      }`}
                    />
                    {validacoes.cpf.valido === false && (
                      <p className="mt-1 text-xs text-red-600">{validacoes.cpf.mensagem}</p>
                    )}
                    {validacoes.cpf.valido === true && (
                      <p className="mt-1 text-xs text-green-600">✓ CPF válido</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className={`block w-full appearance-none rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm ${
                        validacoes.email.valido === false
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : validacoes.email.valido === true
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#1dc92e] focus:ring-[#1dc92e]'
                      }`}
                    />
                    {validacoes.email.valido === false && (
                      <p className="mt-1 text-xs text-red-600">{validacoes.email.mensagem}</p>
                    )}
                    {validacoes.email.valido === true && (
                      <p className="mt-1 text-xs text-green-600">✓ Email válido</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={senha}
                      onChange={(e) => handleInputChange('senha', e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`block w-full appearance-none rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm ${
                        validacoes.senha.valido === false
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : validacoes.senha.valido === true
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#1dc92e] focus:ring-[#1dc92e]'
                      }`}
                    />
                    {validacoes.senha.valido === false && (
                      <p className="mt-1 text-xs text-red-600">{validacoes.senha.mensagem}</p>
                    )}
                    {validacoes.senha.valido === true && (
                      <p className="mt-1 text-xs text-green-600">✓ Senha segura</p>
                    )}

                    {/* Dicas de senha */}
                    {senha && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Dica: Use pelo menos 8 caracteres com símbolos como !@#$%</p>
                      </div>
                    )}
                  </div>
                </div>

                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {erro}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading || !isFormValido()}
                    className="group relative flex w-full justify-center rounded-lg border border-transparent bg-[#1dc92e] py-3 px-4 text-sm font-semibold text-white hover:bg-[#1dc92e]/90 focus:outline-none focus:ring-2 focus:ring-[#1dc92e] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Carregando..." : "Próximo"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2 transition-colors"
                >
                  <i className="fas fa-arrow-left"></i> Voltar
                </button>

                <div className="grid grid-cols-1 gap-4">
                  <div className="border border-gray-200 rounded-xl p-6 flex flex-col bg-gray-50">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Básico</h3>
                      <p className="text-2xl font-extrabold text-gray-900 mb-1">Grátis</p>
                      <p className="text-sm text-gray-600 mb-6">Perfeito para começar a organizar suas finanças pessoais.</p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-xs"></i>
                          </div>
                          <span className="text-gray-900 text-sm">Gerenciamento de gastos</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-xs"></i>
                          </div>
                          <span className="text-gray-900 text-sm">Categorização de transações</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => handlePlanSelect(1)}
                      disabled={loading}
                      className="mt-6 w-full text-center bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Criando..." : "Selecionar Básico"}
                    </button>
                  </div>

                  <div className="relative border border-[#38e07b] rounded-xl p-6 flex flex-col bg-[#f0fdf4]">
                    <div className="absolute top-0 right-4 -mt-2">
                      <span className="bg-[#38e07b] text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                        Mais Popular
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                      <p className="text-2xl font-extrabold text-gray-900 mb-1">R$ 29,99 <span className="text-sm font-medium">/mês</span></p>
                      <p className="text-sm text-gray-600 mb-6">Desbloqueie todo o potencial do Finansable.</p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-xs"></i>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">Todos os recursos do plano Básico</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-xs"></i>
                          </div>
                          <span className="text-gray-900 text-sm">Acesso a um chatbot com IA e relatórios</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-xs"></i>
                          </div>
                          <span className="text-gray-900 text-sm">Orçamentos personalizados</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#38e07b]/20 text-[#38e07b] rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-xs"></i>
                          </div>
                          <span className="text-gray-900 text-sm">Suporte prioritário</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => handlePlanSelect(2)}
                      disabled={loading}
                      className="mt-6 w-full text-center bg-[#38e07b] text-white font-semibold py-3 rounded-lg hover:bg-[#38e07b]/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Criando..." : "Selecionar Premium"}
                    </button>
                  </div>
                </div>

                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {erro}
                  </div>
                )}
              </div>
            )}

            <p className="text-center text-sm text-gray-600 mt-6">
              Já tem uma conta?
              <button
                className="font-medium text-[#1dc92e] hover:text-[#1dc92e]/80 ml-1 transition-colors"
                onClick={() => navigate("/login")}
              >
                Fazer Login
              </button>
            </p>
          </div>
        </div>
      </main>

      <Modal isOpen={showSuccessModal} onClose={handleModalClose} title="Conta Criada!">
        <div className="text-center">
          <img
            src="/images/porco_comemorando.jpg"
            alt="Porco comemorando"
            className="w-32 h-32 mx-auto mb-4"
          />
          <p className="text-gray-700 mb-4">
            Conta criada com sucesso! Faça o login para começar.
          </p>
          <button
            onClick={handleModalClose}
            className="bg-[#1dc92e] text-white px-6 py-2 rounded-lg hover:bg-[#1dc92e]/90 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </Modal>
    </div>
  );
}