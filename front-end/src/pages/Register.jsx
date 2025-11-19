import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../api";

export default function Register() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [validacoes, setValidacoes] = useState({
    cpf: { valido: null, mensagem: "" },
    email: { valido: null, mensagem: "" },
    senha: { valido: null, mensagem: "" },
    nome: { valido: null, mensagem: "" }
  });
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValido()) {
      setErro("Por favor, corrija os erros no formulário");
      return;
    }
    
    setLoading(true);
    setErro("");

    try {
      const userData = {
        Nome: nome,
        CPF: cpf,
        Email: email,
        Senha: senha,
        TipoUsuario: 1
      };

      const response = await createUser(userData);
      alert("Conta criada com sucesso! Faça o login.");
      navigate("/login");
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

  const formatarCpf = (valor) => {
    const cpfLimpo = valor.replace(/[^\d]/g, '');
    if (cpfLimpo.length <= 11) {
      return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return valor;
  };

  return (
    <div className="bg-cover bg-center min-h-screen font-display text-gray-100 flex" style={{backgroundImage: 'url(/images/background.jpg)'}}>
      <div className="flex-1"></div>
      <div className="w-96 min-h-screen backdrop-blur-md bg-white/10 border-l border-gray-600 p-8 flex flex-col justify-center space-y-8">
        <div className="text-center">
          <h1 className="text-[2.53rem] font-bold tracking-tight font-zalando">
            <span className="text-[#a2e8ae]">Finan</span><span className="text-[#2ba13f]">sable</span>
          </h1>
          <p className="mt-4 text-sm text-gray-300">
            Crie sua conta para começar a gerenciar suas finanças.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Nome"
                required
                className={`relative block w-full appearance-none rounded-md border bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:z-10 focus:outline-none focus:ring- sm:text-sm ${
                  validacoes.nome.valido === false
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-500 focus:border-[#1dc92e] focus:ring-[#1dc92e]'
                }`}
              />
              {validacoes.nome.valido === false && (
                <p className="mt-1 text-xs text-red-400">{validacoes.nome.mensagem}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={cpf}
                onChange={(e) => handleInputChange('cpf', formatarCpf(e.target.value))}
                placeholder="CPF"
                maxLength="14"
                required
                className={`relative block w-full appearance-none rounded-md border bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:z-10 focus:outline-none focus:ring- sm:text-sm ${
                  validacoes.cpf.valido === false
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : validacoes.cpf.valido === true
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-500 focus:border-[#1dc92e] focus:ring-[#1dc92e]'
                }`}
              />
              {validacoes.cpf.valido === false && (
                <p className="mt-1 text-xs text-red-400">{validacoes.cpf.mensagem}</p>
              )}
              {validacoes.cpf.valido === true && (
                <p className="mt-1 text-xs text-green-400">✓ CPF válido</p>
              )}
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email"
                required
                className={`relative block w-full appearance-none rounded-md border bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:z-10 focus:outline-none focus:ring- sm:text-sm ${
                  validacoes.email.valido === false
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : validacoes.email.valido === true
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-500 focus:border-[#1dc92e] focus:ring-[#1dc92e]'
                }`}
              />
              {validacoes.email.valido === false && (
                <p className="mt-1 text-xs text-red-400">{validacoes.email.mensagem}</p>
              )}
              {validacoes.email.valido === true && (
                <p className="mt-1 text-xs text-green-400">✓ Email válido</p>
              )}
            </div>

            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                placeholder="Senha"
                required
                className={`relative block w-full appearance-none rounded-md border bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:z-10 focus:outline-none focus:ring- sm:text-sm ${
                  validacoes.senha.valido === false
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : validacoes.senha.valido === true
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-500 focus:border-[#1dc92e] focus:ring-[#1dc92e]'
                }`}
              />
              {validacoes.senha.valido === false && (
                <p className="mt-1 text-xs text-red-400">{validacoes.senha.mensagem}</p>
              )}
              {validacoes.senha.valido === true && (
                <p className="mt-1 text-xs text-green-400">✓ Senha segura</p>
              )}
              
              {/* Dicas de senha */}
              {senha && (
                <div className="mt-2 text-xs text-gray-300">
                  <p>Dica: Use pelo menos 8 caracteres com símbolos como !@#$%</p>
                </div>
              )}
            </div>
          </div>

          {erro && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
              <p className="text-sm">{erro}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !isFormValido()}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#1dc92e] py-2 px-4 text-sm font-bold text-black hover:bg-[#1dc92e]/90 focus:outline-none focus:ring-2 focus:ring-[#1dc92e] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Criando..." : "Criar Conta"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-300">
          Já tem uma conta?
          <Link to="/login" className="font-medium text-[#1dc92e] hover:text-[#1dc92e]/80">
            {" "} Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}