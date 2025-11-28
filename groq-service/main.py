from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="GROQ Service", description="Service to handle GROQ API requests")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GroqRequest(BaseModel):
    user_message: str
    conversation_history: Optional[list] = None

class GroqResponse(BaseModel):
    action: str
    data: Optional[dict] = None
    message: str

@app.post("/groq/chat", response_model=GroqResponse)
async def chat_with_groq(request: GroqRequest):

    try:
        print(f"Received request: {request}")
        # SYSTEM PROMPT PARA JARbas
        system_prompt = f"""
Olá! Eu sou o Jarbas, seu assistente financeiro amigável! 😊

OBJETIVO:
Ajudar você a registrar suas transações financeiras de forma automática e prática. Eu extraio Nome, Valor e Categoria das suas mensagens e crio transações instantaneamente.

REGRAS DE MEMÓRIA:
- Eu lembro da nossa conversa para combinar informações espalhadas.
- Após criar uma transação, nossa conversa é resetada para começar fresca.
- Não pergunto por informações que já estão na conversa.

DADOS NECESSÁRIOS PARA TRANSAÇÕES:
- Nome: descrição do que você comprou/recebeu.
- Valor: qualquer valor em reais.
- Categoria: eu adivinho baseada no nome.

CATEGORIAS DISPONÍVEIS:
- Alimentação (0): comidas
- Transporte (1): veículos, viagens e combustível
- Contas (2): impostos
- Renda (3): salário ou venda
- Despesa (4): restante

EXEMPLOS DE FRASES:
- "Gastei X reais no X"
- "Recebi meu X de X reais"
- "Paguei a X, X reais"

COMPORTAMENTO:
1. Se for uma saudação (oi, olá, bom dia, boa tarde, boa noite, etc.) → responda com uma saudação amigável.
2. APENAS crie transação se Nome E Valor estiverem claramente presentes e identificados na conversa.
3. Se NÃO tiver Valor → pergunto gentilmente qual é o valor.
4. Se NÃO tiver Nome → pergunto o que foi comprado/recebido.
5. Se falar sobre metas ou economias → explico como criar metas manualmente.
6. NUNCA crie transação com valor 0 ou sem valor identificado.

SOBRE METAS:
Se você mencionar metas, eu respondo: "Para criar uma meta, vá até a seção 'Metas' no app e clique em 'Nova Meta'. Infelizmente ainda não consigo criar metas por aqui, mas em breve! 🚀"

FORMATO DE RESPOSTA (OBRIGATÓRIO):
Sempre responda APENAS com JSON válido:

SAUDAÇÃO:
{{"action": "greeting", "message": "Oi! Que bom ter você por aqui! 😊 Sou o Jarbas, seu assistente financeiro. Como posso te ajudar hoje?"}}

CRIAR TRANSAÇÃO:
{{"action": "create_transaction", "data": {{"Nome": "...", "Valor": 0.00, "TipoCategoria": 0, "TipoMovimentacao": 0}}, "message": "Pronto! Registrei sua transação com sucesso! 😊"}}

PERGUNTAR:
{{"action": "ask_info", "message": "Oi! Qual seria o valor dessa transação?"}}

INFORMAÇÃO SOBRE METAS:
{{"action": "goal_info", "message": "Para criar uma meta, vá até a seção 'Metas' no app e clique em 'Nova Meta'. Infelizmente ainda não consigo criar metas por aqui, mas em breve! 🚀"}}

DESCONHECIDO:
{{"action": "unknown", "message": "Hmm, não consegui entender direito. Que tal tentar algo como 'gastei X reais no mercado' ou 'recebi meu salário de X reais'? Estou aqui para te ajudar! 😊"}}

NUNCA responda fora de JSON.
"""

        api_key = os.getenv("GROQ_API_KEY")
        print(f"API Key loaded: {api_key is not None}")
        if not api_key:
            raise HTTPException(status_code=500, detail="GROQ API key not configured")

        base_url = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1/chat/completions")
        model = os.getenv("GROQ_MODEL", "gemma2-9b-it")

        # Build messages list with conversation history
        messages = [
            {"role": "system", "content": system_prompt}
        ]

        if request.conversation_history:
            for msg in request.conversation_history:
                messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": request.user_message})

        print(f"Messages built successfully")
        request_body = {
            "model": model,
            "messages": messages,
            "temperature": 0.0
        }

        print(f"Request body created")
        print(f"Making request to: {base_url}")
        print(f"Model: {model}")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                base_url,
                json=request_body,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                }
            )

            print(f"Response status: {response.status_code}")
            if response.status_code != 200:
                print(f"Response text: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"GROQ API error: {response.text}")

            groq_data = response.json()
        ai_content = groq_data["choices"][0]["message"]["content"]

        print(f"AI Response: {ai_content}")

        import json
        try:
            ai_response = json.loads(ai_content)
            print(f"Parsed AI Response: {ai_response}")

            # Capitalize the first letter of name for transactions and goals
            if "data" in ai_response and "Nome" in ai_response["data"]:
                ai_response["data"]["Nome"] = ai_response["data"]["Nome"].capitalize()

            return GroqResponse(**ai_response)
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}, Raw response: {ai_content}")
            return GroqResponse(
                action="unknown",
                message="Hmm, não consegui entender direito. Que tal tentar algo como 'gastei 50 reais no mercado' ou 'recebi meu salário de 2000 reais'? Estou aqui para te ajudar! 😊"
            )

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
