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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setErro("Erro ao criar conta. Verifique os dados.");
      alert("Erro ao criar conta. Verifique os dados.");
    } finally {
      setLoading(false);
    }
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
              <input type="text" id="nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required
                className="relative block w-full appearance-none rounded-md border border-gray-500 bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:z-10 focus:border-[#1dc92e] focus:outline-none focus:ring-[#1dc92e] sm:text-sm"/>
            </div>

            <div>
              <input type="text" id="cpf" name="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" required
                className="relative block w-full appearance-none rounded-md border border-gray-500 bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:z-10 focus:border-[#1dc92e] focus:outline-none focus:ring-[#1dc92e] sm:text-sm"/>
            </div>

            <div>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
                className="relative block w-full appearance-none rounded-md border border-gray-500 bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:z-10 focus:border-[#1dc92e] focus:outline-none focus:ring-[#1dc92e] sm:text-sm"/>
            </div>

            <div>
              <input type="password" id="password" name="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" required
                className="relative block w-full appearance-none rounded-md border border-gray-500 bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:z-10 focus:border-[#1dc92e] focus:outline-none focus:ring-[#1dc92e] sm:text-sm"/>
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#1dc92e] py-2 px-4 text-sm font-bold text-black hover:bg-[#1dc92e]/90 focus:outline-none focus:ring-2 focus:ring-[#1dc92e] focus:ring-offset-0 disabled:opacity-50">
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