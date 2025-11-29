# :money_with_wings: Finansable - Sua Plataforma de Gestão Financeira

O **Finansable** é um sistema completo de **gestão financeira pessoal**,
combinando um backend em **.NET 8**, frontend em **React** e um **Chatbot Inteligente treinado com IA**,
utilizando **Python** e o modelo **Gemma-2-9b**.

O projeto une boas práticas de arquitetura, integração entre tecnologias
e uma experiência fluida para o usuário, tudo desenvolvido com foco
acadêmico e educacional.


> [!IMPORTANT]
> :scroll: Licença:
> 
> Projeto desenvolvido para fins educacionais. Livre para modificar e evoluir.
>
> **Obs:** Todas as informações sobre os colaboradores e a Universidade se encontram no fim deste README.


## :dart: Objetivos de Aprendizagem

-   Estruturar a aplicação backend usando princípios como **camadas,
    SRP, injeção de dependência e repositórios**.
-   Construir um frontend **React modular**, organizado e reutilizável.
-   Utilizar **Python** para processamento de linguagem natural e
    integração com o backend.
-   Incorporar um modelo de IA real (**Gemma-2-9b**) para respostas
    inteligentes via Chatbot.
-   Gerar **relatórios em PDF** através do **@react-pdf/renderer**.
-   Consolidar um ecossistema completo: API + IA + UI.

---

## :sparkles: Funcionalidades

### :small_blue_diamond: Gestão de Metas Financeiras

-   Criar, editar e excluir metas.
-   Acompanhamento visual de progresso.
-   Nova página dedicada: **GoalsPage**.

### :small_blue_diamond: Controle de Transações

-   Registros de entrada e saída.
-   Resumo financeiro com cálculos automáticos.
-   Tabela dinâmica e responsiva.

### :small_blue_diamond: Relatórios em PDF

-   Criados diretamente no frontend usando **React PDF Renderer**.
-   Incluem:
    -   resumo financeiro,
    -   progresso de metas,
    -   transações do período.

### :small_blue_diamond: Chatbot com Inteligência Artificial

-   Backend em Python dedicado ao chatbot.
-   Modelo **Gemma-2-9b** ajustado e treinado para:
    -   responder dúvidas financeiras,
    -   orientar o usuário no sistema.

Fluxo: React → API .NET → Serviço Python → Modelo Gemma.

### :small_blue_diamond: Sessão e Autenticação

-   JWT seguro.
-   Validação no backend e proteção de rotas no React.

---

## :heavy_check_mark: Como Executar

### Pré-requisitos

-   Node.js 18+
-   .NET 8
-   MySQL
-   Python 3.10+
-   Pip + virtualenv
-   NPM ou Yarn

---

## :heavy_check_mark: Boas Práticas Aplicadas

### Domínio Puro no .NET

Entidades, regras e lógica do sistema isoladas na camada `Domain`.

### Camadas Claras

-   **Domain** → regras e entidades
-   **Application** → casos de uso
-   **Infrastructure** → MySQL, repositórios
-   **API** → autenticação e endpoints
-   **IA Service (Python)** → execução do Gemma-2-9b
-   **Frontend (React)** → interface e relatórios

### Inversão de Dependência

Interfaces garantem baixo acoplamento.

### Front React Componentizado

Componentes: `FinancialSummary`, `TransactionsTable`, `GoalsProgress`,
`GoalsPage`.

### Geração de PDF

Feitos com:

    @react-pdf/renderer

### Chatbot com Gemma-2-9b

Integração Python + .NET + React.


## Informacões Adicionais
## :busts_in_silhouette: Desenvolvedores

- **Nome:** André Luis da Silva Reis         | **RA:** 1987363  :man_technologist:
- **Nome:** Daniel Victor Costa              | **RA:** 1989218 :man_technologist:
- **Nome:** Felipe Souza Garcia              | **RA:** 1990279 :man_technologist:
- **Nome:** Gustavo Henrique Vieira da Silva | **RA:** 1992080 :man_technologist:
- **Nome:** Joaquim Fernando Santana Moreira | **RA:** 1993917 :man_technologist:
- **Nome:** José Vitor de Almida Lima        | **RA:** 1994104 :man_technologist:

### Informações Acadêmicas
- **Universidade:** UNIMAR - Universidade de Marília :school:
- **Curso:** Analise e Desenvolvimento de Sistemas :mortar_board:
- **Disciplinas:** Fábrica de Projetos Ageis IV | Arquitetura de Software e Desenvolvimento Full Stack | Design Patterns e Clean Code :computer:
