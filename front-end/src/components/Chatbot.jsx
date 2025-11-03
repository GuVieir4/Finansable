import { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Olá! Como posso ajudar você hoje com suas finanças?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Entendi! Posso te mostrar um resumo dos seus gastos mensais se quiser 😊",
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#E8F5E9]">
      <div className="flex flex-col flex-1 items-center justify-start py-6 px-4 overflow-y-auto">
        <div className="w-full max-w-[960px] flex flex-col flex-1">
          <h1 className="text-[#264533] text-[22px] font-bold pb-5">
            Chatbot Financeiro
          </h1>

          {/* Os ifs são pra definir as classes dependendo de quem mandou a mensagem*/}
          <div className="flex flex-col gap-4">
            {messages.map((message, i) => (
              <div key={i} className={`flex items-end gap-3 p-2 ${message.from === "user" ? "justify-end" : ""}`}>
                {message.from === "bot" && (
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                    style={{ backgroundImage: `url(/porquinho.png)` }}>
                </div>
                )}

                <div className={`flex flex-col gap-1 ${message.from === "user" ? "items-end" : "items-start"}`}>
                    {/* Definindo a cor de como aparece o nome de quem mandou a mensagem */}
                  <p className={`text-[13px] font-normal leading-normal max-w-[360px] ${
                      message.from === "bot"
                        ? "text-[#264532] font-semibold"
                        : "text-[#000000] text-right font-semibold"
                    }`}>
                    {/* Definindo o nome de quem mandou a mensagem */}
                    {message.from === "bot" ? "Finansable Bot" : "Você"}
                  </p>
                    <p
                    // Definindo a cor do balão de mensagem e cor do texto dependendo de quem mandou a mensagem
                    className={`text-base font-normal leading-normal max-w-[260px] lg:max-w-[400px] rounded-lg px-4 py-3 break-words ${
                        message.from === "bot"
                        ? "bg-[#264532] text-white"
                        : "bg-[#4CAF50] text-[#000000]"
                    }`}
                    >
                    {/* Mensagem que foi enviada */}
                    {message.text}
                    </p>
                </div>

                {/* Colocando a minha foto, se foi eu que enviei a mensagem */}
                {message.from === "user" && (
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                    style={{ backgroundImage: 'url("https://avatars.githubusercontent.com/u/160288170?v=4")' }}>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campo de enviar a mensagem / Input */}
      <div className="w-full border-t border-[#264532] flex items-center justify-center p-4">
        <div className="w-full max-w-[960px] flex gap-2">
          <input type="text" placeholder="Digite sua pergunta..." value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 h-12 px-4 rounded-lg text-white bg-[#264532] focus:outline-none placeholder:text-[#96c5a9]"/>
          <button onClick={handleSend} className="h-12 px-6 rounded-lg bg-[#38e07b] text-[#122118] font-medium hover:bg-[#2ed06f] transition">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
