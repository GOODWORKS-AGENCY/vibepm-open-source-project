# VibePM

AI-powered project scaffolding tool that takes a "brain dump" of project ideas, analyzes them via AI, and generates a complete development framework — tasks, knowledge files (WAT framework: Workflows, Agents, Tools), config files, CLAUDE.md templates, and database migrations. Output is exported as a ZIP.

## Features

- **AI Analysis**: Paste a brain dump → get structured project breakdown (entities, modules, phases)
- **Task Generation**: Auto-generates prioritized, dependency-aware task lists
- **WAT Framework**: Generates Workflows, Agents, and Tools knowledge files
- **Export**: Download everything as a ZIP (migrations, edge functions, tracker UI, config files)
- **Gamification**: XP and levels for task completion
- **Real-time Tracker**: Live task board powered by Supabase Realtime

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui (Radix) + Tailwind CSS + Framer Motion
- **Backend**: Supabase (auth, database, edge functions, realtime)
- **AI**: Any OpenAI-compatible API (OpenAI, Anthropic, Google, etc.)

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- An AI API key (OpenAI, Anthropic, Google, or any OpenAI-compatible provider)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for deploying edge functions)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/your-org/vibepm.git
cd vibepm
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### 3. Set up the database

Run the migration in your Supabase SQL Editor (or via CLI):

```bash
supabase db push
```

### 4. Deploy edge functions

```bash
supabase login
supabase link --project-ref your-project-id
supabase functions deploy generate-project
supabase functions deploy agent-tasks
```

### 5. Configure AI secrets

```bash
# Required: your AI provider API key
supabase secrets set AI_API_KEY=your-api-key

# Optional: custom gateway URL and model (defaults to OpenAI gpt-4o)
supabase secrets set AI_GATEWAY_URL=https://api.openai.com/v1/chat/completions
supabase secrets set AI_MODEL=gpt-4o
```

### 6. Start development

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

## Edge Function Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_API_KEY` | Yes | — | Your AI provider API key |
| `AI_GATEWAY_URL` | No | `https://api.openai.com/v1/chat/completions` | OpenAI-compatible endpoint |
| `AI_MODEL` | No | `gpt-4o` | Model identifier |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 8080) |
| `npm run build` | Production build |
| `npm run test` | Run tests (vitest) |
| `npm run lint` | ESLint |

## License

MIT
