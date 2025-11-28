import { useState, useEffect, useRef } from "react";

function Chatbot({ isFloating = true }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [usuarioId] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check user type
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsPremium(parseInt(user.tipoUsuario || user.TipoUsuario) === 2);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsPremium(false);
      }
    }

    // No longer fetching persisted messages - chat starts fresh
    setLoading(false);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    // Update conversation history (only user messages)
    const userMessagesOnly = conversationHistory.filter(msg => msg.role === "user");
    const updatedHistory = [...userMessagesOnly, { role: "user", content: currentInput }];
    setConversationHistory(updatedHistory);

    // Set typing indicator
    setIsTyping(true);

    try {
      // Debug: Log the conversation memory being sent
      console.log("MEMÓRIA ENVIADA PARA IA:", updatedHistory);

      // Call Python API with conversation history
      const groqResponse = await fetch("http://localhost:8000/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: currentInput,
          conversation_history: updatedHistory,
        }),
      });

      if (!groqResponse.ok) throw new Error("Erro na API do GROQ");
      const groqData = await groqResponse.json();

      // Stop typing
      setIsTyping(false);

      // Add bot response to chat
      const botMessage = { from: "bot", text: groqData.message };
      setMessages((prev) => [...prev, botMessage]);

      // Update conversation history with bot response
      const historyWithBot = [...updatedHistory, { role: "assistant", content: groqData.message }];
      setConversationHistory(historyWithBot);

      // Handle actions (create transaction, goal info, or greeting)
      if (groqData.action === "create_transaction") {
        await createTransactionViaAPI(groqData.data);
        // Reset conversation after successful creation
        setConversationHistory([]);
      } else if (groqData.action === "goal_info" || groqData.action === "greeting") {
        // Just display the message, keep conversation history
      }
      // For other actions, keep conversation history

    } catch (error) {
      console.error("Erro:", error);
      setIsTyping(false);
      const errorMessage = { from: "bot", text: "Desculpe, ocorreu um erro." };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const createTransactionViaAPI = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("http://localhost:5299/api/Transacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          Nome: data.Nome,
          Valor: data.Valor,
          TipoCategoria: data.TipoCategoria,
          TipoMeioPagamento: data.TipoMeioPagamento || 0,
          TipoMovimentacao: data.TipoMovimentacao,
          Data: data.Data || new Date().toISOString(),
          UsuarioId: usuarioId,
          PoupancaId: data.PoupancaId,
        }),
      });

      if (!response.ok) {
        console.error("Erro ao criar transação:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    }
  };

  const createGoalViaAPI = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("http://localhost:5299/api/Poupancas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          Nome: data.Nome,
          ValorAlvo: data.ValorAlvo,
          ValorAtual: data.ValorAtual || 0,
          DataInicio: data.DataInicio || new Date().toISOString(),
          DataFim: data.DataFim,
          UsuarioId: usuarioId,
        }),
      });

      if (!response.ok) {
        console.error("Erro ao criar meta:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    }
  };

  if (!isPremium) {
    if (isFloating) return null;
    return (
      <div className="flex flex-col min-h-screen bg-[#E8F5E9] items-center justify-center">
        <img src="/images/emoji.png" alt="Emoji" className="w-24 h-24 mb-8 rounded-full" />
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-[#264533] text-[32px] font-bold mb-4">
            Acesso Restrito
          </h1>
          <p className="text-[#264533] text-lg mb-6">
            Esta funcionalidade está disponível apenas para usuários premium.
          </p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Faça upgrade para o plano premium para acessar o chatbot com IA e outras funcionalidades exclusivas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isFloating) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#4CAF50] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-[#45a049] transition"
          >
            💬
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border border-gray-300">
            <div className="bg-[#264533] text-white p-3 rounded-t-lg flex justify-between items-center">
              <h3 className="font-bold">Jarbas</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto bg-[#E8F5E9]">
              {loading ? (
                <p className="text-[#264532] text-center">Carregando mensagens...</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {messages.map((message, i) => (
                    <div
                      key={i}
                      className={`flex items-end gap-2 animate-fade-in ${
                        message.from === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.from === "bot" && (
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0"
                          style={{ backgroundImage: `url(/porquinho.png)` }}
                        ></div>
                      )}

                      <div
                        className={`flex flex-col gap-1 ${
                          message.from === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <p
                          className={`text-[11px] font-semibold ${
                            message.from === "bot"
                              ? "text-[#264532]"
                              : "text-[#000000] text-right"
                          }`}
                        >
                          {message.from === "bot" ? "Jarbas" : "Você"}
                        </p>
                        <p
                          className={`text-sm leading-normal max-w-[200px] rounded-lg px-3 py-2 break-words ${
                            message.from === "bot"
                              ? "bg-[#264532] text-white"
                              : "bg-[#4CAF50] text-[#000000]"
                          }`}
                        >
                          {message.text}
                        </p>
                      </div>

                      {message.from === "user" && (
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0"
                          style={{
                            backgroundImage:
                              'url("https://avatars.githubusercontent.com/u/160288170?v=4")',
                          }}
                        ></div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-end gap-2 animate-fade-in">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0"
                        style={{ backgroundImage: `url(/porquinho.png)` }}
                      ></div>
                      <div className="flex flex-col gap-1 items-start">
                        <p className="text-[11px] font-semibold text-[#264532]">
                          Jarbas
                        </p>
                        <div className="bg-[#264532] text-white text-sm leading-normal rounded-lg px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-[#264532] p-3 bg-white rounded-b-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1 h-10 px-3 rounded-lg text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="h-10 px-4 rounded-lg bg-[#38e07b] text-[#122118] font-medium hover:bg-[#2ed06f] transition"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full page layout with absolute input
  return (
    <div className="flex flex-col min-h-screen bg-[#E8F5E9]">
      <div className="flex flex-col flex-1 items-center justify-start py-6 px-4 overflow-y-auto">
        <div className="w-full max-w-[960px] flex flex-col flex-1">
          <h1 className="text-[#264533] text-[22px] font-bold pb-5">
            Jarbas, assistente financeiro
          </h1>

          {loading ? (
            <p className="text-[#264532] text-center mt-10">Carregando mensagens...</p>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-3 p-2 animate-fade-in ${
                    message.from === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.from === "bot" && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                      style={{ backgroundImage: `url(/porquinho.png)` }}
                    ></div>
                  )}

                  <div
                    className={`flex flex-col gap-1 ${
                      message.from === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <p
                      className={`text-[13px] font-normal leading-normal max-w-[360px] ${
                        message.from === "bot"
                          ? "text-[#264532] font-semibold"
                          : "text-[#000000] text-right font-semibold"
                      }`}
                    >
                      {message.from === "bot" ? "Jarbas" : "Você"}
                    </p>
                    <p
                      className={`text-base font-normal leading-normal max-w-[260px] lg:max-w-[400px] rounded-lg px-4 py-3 break-words ${
                        message.from === "bot"
                          ? "bg-[#264532] text-white"
                          : "bg-[#4CAF50] text-[#000000]"
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>

                  {message.from === "user" && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                      style={{
                        backgroundImage:
                          'url("https://avatars.githubusercontent.com/u/160288170?v=4")',
                      }}
                    ></div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end gap-3 p-2 animate-fade-in">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                    style={{ backgroundImage: `url(/porquinho.png)` }}
                  ></div>
                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-[13px] font-normal leading-normal max-w-[360px] text-[#264532] font-semibold">
                      Jarbas
                    </p>
                    <div className="bg-[#264532] text-white text-base font-normal leading-normal rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#264532] flex items-center justify-center p-4 z-40">
        <div className="w-full max-w-[960px] flex gap-2">
          <input
            type="text"
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 h-12 px-4 rounded-lg text-white bg-[#264532] focus:outline-none placeholder:text-[#96c5a9]"
          />
          <button
            type="button"
            onClick={handleSend}
            className="h-12 px-6 rounded-lg bg-[#38e07b] text-[#122118] font-medium hover:bg-[#2ed06f] transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;