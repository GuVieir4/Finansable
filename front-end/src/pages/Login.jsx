import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const users = [
    { user: "Gustavo", email: "1992080@unimar.br", senha: "unimar" },
  ];

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userEncontrado = users.find(
      (user) => user.email === email && user.senha === senha
    );

    if (userEncontrado) {
      setErro("");
      navigate("/");
    } else {
      setErro("Email ou senha incorretos.");
      alert("Email ou senha incorretos.")
    }
  };

  return (
    <div className="bg-[#404240] font-display text-gray-100">
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
              Finansable
            </h1>
            <p className="mt-4 text-sm text-gray-400">
              Bem-vindo de volta! Por favor, acesse sua conta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
                  className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:z-10 focus:border-[#1dc92e] focus:outline-none focus:ring-[#1dc92e] sm:text-sm"/>
              </div>

              <div>
                <input type="password" id="password" name="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" required
                  className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:z-10 focus:border-[#1dc92e] focus:outline-none focus:ring-[#1dc92e] sm:text-sm"/>
              </div>
            </div>

            <div>
              <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#1dc92e] py-2 px-4 text-sm font-bold text-black hover:bg-[#1dc92e]/90 focus:outline-none focus:ring-2 focus:ring-[#1dc92e] focus:ring-offset-[#112113]">
                Fazer Login
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-sm text-gray-400">
            Não tem uma conta?
            <a className="font-medium text-[#1dc92e] hover:text-[#1dc92e]/80" href="#">
              {" "} Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
