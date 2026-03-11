# VibePM

AI-powered project scaffolding for vibe coders. Paste a brain dump of your project idea, and VibePM generates a complete development framework — tasks, knowledge files (WAT: Workflows, Agents, Tools), database migrations, agent configs, and a gamified task tracker — all exported as a ready-to-go ZIP.

## Features

- 🧠 **Brain Dump Wizard** — Paste messy project ideas, VibePM structures them into phases, modules, and entities
- 📋 **AI Task Generation** — Automatically creates a prioritized task list with dependencies and XP rewards
- 📚 **WAT Knowledge Files** — Generates Workflows, Agent specs, and Tool docs for your AI coding agents
- 🤖 **Agent Task API** — REST endpoint for Claude Code / Codex to claim and complete tasks autonomously
- 🎮 **Gamified Tracker** — XP, levels, progress rings — because shipping should feel like a game
- 📦 **ZIP Export** — Download everything: migrations, edge functions, knowledge files, CLAUDE.md, AGENTS.md

## Quick Start

```bash
git clone https://github.com/your-org/vibepm.git
cd vibepm
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080). The app works fully offline with localStorage — no backend required for project creation and export.

## Supabase Setup (Optional)

Adding Supabase enables AI-powered analysis, the agent task API, and real-time progress tracking.

### 1. Create a Supabase Project

Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**

Note your **Project URL**, **anon key**, and **project ref** from Settings → API.

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_PROJECT_ID="your-project-ref"
```

### 3. Run Migrations

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 4. Deploy Edge Functions

```bash
supabase functions deploy generate-project
supabase functions deploy agent-tasks
```

### 5. Configure AI Provider

Set your AI provider secrets. The edge function supports any OpenAI-compatible API:

```bash
# Required
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then pick your AI provider:

| Provider | Secrets to Set |
|----------|---------------|
| **OpenAI** (default) | `AI_API_KEY=sk-...` |
| **Anthropic** (via LiteLLM) | `AI_API_KEY=sk-ant-...` `AI_GATEWAY_URL=https://your-proxy/v1/chat/completions` `AI_MODEL=claude-3-haiku-20240307` |
| **Groq** | `AI_API_KEY=gsk_...` `AI_GATEWAY_URL=https://api.groq.com/openai/v1/chat/completions` `AI_MODEL=llama-3.1-70b-versatile` |
| **Ollama** (local) | `AI_GATEWAY_URL=http://host.docker.internal:11434/v1/chat/completions` `AI_MODEL=llama3.1` |
| **Any OpenAI-compatible** | `AI_API_KEY=...` `AI_GATEWAY_URL=https://...` `AI_MODEL=...` |

**Defaults** (if not set): `AI_GATEWAY_URL=https://api.openai.com/v1/chat/completions`, `AI_MODEL=gpt-4o-mini`

## Agent Integration

Once Supabase is set up, your AI agents can autonomously work through tasks:

```bash
# Get next task
curl -X POST $SUPABASE_URL/functions/v1/agent-tasks \
  -H "Authorization: Bearer $JWT" \
  -d '{"action": "next", "agent_id": "claude-code"}'

# Claim → work → complete
curl -X POST $SUPABASE_URL/functions/v1/agent-tasks \
  -H "Authorization: Bearer $JWT" \
  -d '{"action": "claim", "task_code": "P1-01", "agent_id": "claude-code"}'

curl -X POST $SUPABASE_URL/functions/v1/agent-tasks \
  -H "Authorization: Bearer $JWT" \
  -d '{"action": "complete", "task_code": "P1-01", "notes": "Done"}'
```

## Tech Stack

- **Frontend**: React 18 · TypeScript · Vite
- **UI**: shadcn/ui · Tailwind CSS · Framer Motion
- **State**: TanStack Query · localStorage
- **Backend**: Supabase (Postgres + Edge Functions + Realtime)
- **AI**: Any OpenAI-compatible provider

## Project Structure

```
src/
├── pages/          # Route pages (wizard, dashboard, tracker)
├── components/     # UI components
├── templates/      # Output file generators (CLAUDE.md, AGENTS.md, etc.)
├── hooks/          # React hooks (projects, tasks, auth)
├── lib/            # Store, AI client, template engine
└── types/          # TypeScript types

supabase/
├── functions/
│   ├── generate-project/   # AI analysis + task generation
│   └── agent-tasks/        # Agent task API (claim/complete/status)
└── migrations/             # Database schema
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
