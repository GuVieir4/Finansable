import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/routes/usuario";
import Toast from "../components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Auto-hide after 5 seconds
  };

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
      showToast("Email ou senha incorretos.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-col min-h-screen">
        <main className="flex flex-1 justify-center items-center px-4 sm:px-10 lg:px-40 py-5">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#264533]">
                  Finansable
                </h1>
                <p className="mt-4 text-sm text-gray-600">
                  Bem-vindo de volta! Por favor, acesse sua conta.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#1dc92e] focus:outline-none focus:ring-1 focus:ring-[#1dc92e] sm:text-sm"
                      placeholder="seu@email.com"
                    />
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
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#1dc92e] focus:outline-none focus:ring-1 focus:ring-[#1dc92e] sm:text-sm"
                      placeholder="••••••••"
                    />
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
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-lg border border-transparent bg-[#1dc92e] py-3 px-4 text-sm font-semibold text-white hover:bg-[#1dc92e]/90 focus:outline-none focus:ring-2 focus:ring-[#1dc92e] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Entrando..." : "Fazer Login"}
                  </button>
                </div>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Não tem uma conta?
                <button
                  className="font-medium text-[#1dc92e] hover:text-[#1dc92e]/80 ml-1 transition-colors"
                  onClick={() => navigate("/register")}
                >
                  Criar conta
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
