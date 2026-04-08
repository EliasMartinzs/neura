# Neura - Plataforma de Estudos com IA

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/OpenAI-GPT-412991?style=flat-square&logo=openai" alt="OpenAI">
</p>

> Aprenda mais rápido. Lembre-se para sempre.

**Neura** é uma plataforma de estudos com flashcards e repetição espaçada, impulsionada por IA. Crie baralhos, gere flashcards automaticamente, faça quizzes inteligentes e pratique perguntas abertas com feedback da IA.

## Funcionalidades

### 📚 Decks e Flashcards
- Crie e organize baralhos por tema
- Flashcards manuais ou gerados por IA
- Sistema de repetição espaçada (SM-2)
- Tags, cores e níveis de dificuldade

### 🧠 Sessões de Estudo
- Revise cartões com agendamento inteligente
- Acompanhe acertos/erros
- Trilha de Bloom: Lembre → Entenda → Aplique → Analise → Avalie → Crie

### 🎯 Quiz com IA
- Quizzes gerados dinamicamente por IA
- 4 etapas: Conceito → Exemplo → Comparação → Aplicação
- Estilos: Direto, Cenário Real, Enganoso, Nível Prova
- Explicações detalhadas após cada resposta

### 💡 Explique e Aprenda
- Perguntas abertas sobre qualquer tema
- Avaliação da IA com nota de 0-100
- Feedback sobre pontos faltantes
- Pratique escrever suas próprias respostas

### 📊 Dashboard
- Estatísticas pessoais
- Cartões para revisar hoje
- Atividades diárias
- Logs de atividade

## Stack Tecnológica

| Tecnologia | Por que escolhemos |
|------------|-------------------|
| **Next.js 16** | App Router, Server Components, performance |
| **React 19** | Concurrent features, melhor DX |
| **TypeScript** | Type safety em toda a aplicação |
| **Hono** | API leve, deploy serverless fácil (Vercel) |
| **Prisma 7** | ORM type-safe, migrations simples |
| **PostgreSQL** | Dados relacionais, JSON para flexibilidade |
| **better-auth** | Auth completo com JWT e OAuth |
| **OpenAI** | Geração de flashcards, quizzes e avaliações |
| **Tailwind CSS v4** | Estilização rápida, design system consistente |
| **shadcn/ui** | Componentes acessíveis e customizáveis |
| **Framer Motion** | Animações suaves |
| **Nodemailer** | Emails transacionais (verificação, reset) |
| **Cloudinary** | Upload de imagens otimizado |

## Pré-requisitos

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Conta OpenAI (para APIs de IA)
- Conta Cloudinary (opcional, para avatares)
- Servidor SMTP (para emails)

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/EliasMartinzs/neura.git
cd neura
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# ============================================
# BANCO DE DADOS
# ============================================
DATABASE_URL="postgresql://usuario:senha@localhost:5432/neura"

ARCJET_KEY="sua-chave-secreta"

# ============================================
# AUTENTICAÇÃO (better-auth)
# ============================================
BETTER_AUTH_SECRET="sua-chave-secreta"
BETTER_AUTH_DOMAIN=""
BETTER_AUTH_URL=""

# ============================================
# OPENAI (obrigatório para recursos de IA)
# ============================================
OPENAI_API_KEY="sk-..."

# ============================================
# EMAIL (SMTP)
# ============================================
SMTP_HOST="smtp.seu-servidor.com"
SMTP_PORT="587"
SMTP_USER="seu-email@exemplo.com"
SMTP_PASS="sua-senha"
FROM_EMAIL="neura@seu-dominio.com"

# ============================================
# CLOUDINARY (opcional - para avatares)
# ============================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="seu-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="sua-api-secret"
```

### 4. Configure o banco de dados

```bash
# Push o schema para o banco
pnpm push

# Ou para criar migrations
pnpm dlx prisma migrate dev --name init
```

### 5. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

O projeto estará disponível em `http://localhost:3000`

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Inicia o servidor de produção |
| `pnpm lint` | Executa ESLint |
| `pnpm studio` | Abre Prisma Studio |
| `pnpm push` | Push schema + generate (combinação) |

## API

A documentação da API está disponível em `/api/docs` (Swagger UI).

### Rotas Principais

- `/api/auth/*` - Autenticação
- `/api/deck` - CRUD de baralhos
- `/api/flashcard` - CRUD de flashcards
- `/api/study` - Sessões de estudo
- `/api/quiz` - Quizzes com IA
- `/api/explain-learn` - Perguntas abertas
- `/api/profile` - Perfil do usuário

## Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras plataformas

O projeto usa `hono/vercel` para deploy serverless, compatível com:
- Vercel
- Netlify (com adaptações)
- Cloudflare Workers

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto é open source sob a licença MIT.


