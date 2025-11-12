                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    console.log("🚀 Starting login process");
    console.log("📧 Email:", email);
    console.log("🔒 Password:", senha ? "***" : "empty");

    try {
      const response = await login(email, senha);
      console.log("💾 Storing session data");
      console.log("🔍 Full response:", response);
      console.log("🔍 Token:", response.token);
      console.log("🔍 Usuario object:", JSON.stringify(response.usuario, null, 2));
      console.log("🔍 Usuario ID:", response.usuario?.Id);
      console.log("🔍 Usuario id (lowercase):", response.usuario?.id);

      const userId = response.usuario?.Id || response.usuario?.id;
      if (response.token && userId) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('user', JSON.stringify(response.usuario));
        console.log("✅ Login successful, redirecting to /");
        navigate("/");
      } else {
        console.error("❌ Invalid response structure - missing token or userId:", { token: !!response.token, userId: userId });
        setErro("Resposta inválida do servidor.");
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      setErro("Email ou senha incorretos.");
      alert("Email ou senha incorretos.");
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
            Bem-vindo de volta! Por favor, acesse sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
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
            <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#1dc92e] py-2 px-4 text-sm font-bold text-black hover:bg-[#1dc92e]/90 focus:outline-none focus:ring-2 focus:ring-[#1dc92e] focus:ring-offset-0">
              Fazer Login
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-300">
          Não tem uma conta?
          <a className="font-medium text-[#1dc92e] hover:text-[#1dc92e]/80" href="#">
            {" "} Criar conta
          </a>
        </p>
      </div>
    </div>
  );
}
