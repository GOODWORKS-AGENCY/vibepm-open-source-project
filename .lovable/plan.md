

## Plan: Multi-Provider AI Edge Function (Anthropic → OpenAI → Fallback)

Rewrite `callAI` in the edge function to natively support Anthropic's API format as priority 1, OpenAI as priority 2, and any OpenAI-compatible gateway as fallback. The provider is auto-detected from configured secrets.

### Provider Detection Logic

```text
1. If AI_PROVIDER=anthropic OR AI_API_KEY starts with "sk-ant-" → Anthropic
2. If AI_PROVIDER=openai OR AI_API_KEY starts with "sk-" → OpenAI
3. If AI_GATEWAY_URL is set → Generic OpenAI-compatible (OpenRouter, Groq, Ollama, etc.)
4. Fallback: Lovable AI Gateway (LOVABLE_API_KEY)
```

### Changes

**1. `supabase/functions/generate-project/index.ts`** — Major rewrite of `callAI`:

- **Add `callAnthropic` function**: Uses `https://api.anthropic.com/v1/messages` with proper Anthropic format:
  - `x-api-key` header (not Bearer)
  - `anthropic-version: 2023-06-01` header
  - `system` as top-level param (not in messages array)
  - `max_tokens` required
  - Response at `content[0].text` (not `choices[0].message.content`)
  - Default model: `claude-sonnet-4-20250514`

- **Keep `callOpenAI` function**: Current OpenAI-format logic, cleaned up:
  - Remove `response_format: { type: "json_object" }` (not universally supported)
  - Default model: `gpt-4o-mini`

- **Add `detectProvider` function**: Reads `AI_PROVIDER`, `AI_API_KEY`, `AI_GATEWAY_URL`, `LOVABLE_API_KEY` to determine which path to use

- **Add `callWithFallback` router**: Calls the detected provider, with error logging

- **Update error messages**: Provider-specific hints (e.g., "Check your Anthropic API key" vs "Check your OpenAI API key")

**2. `supabase/config.toml`** — Add:
```toml
[functions.generate-project]
verify_jwt = false
```

**3. `README.md`** — Update AI provider table to reflect native multi-provider support:
- Anthropic: just set `AI_API_KEY=sk-ant-...` (auto-detected, native format)
- OpenAI: just set `AI_API_KEY=sk-...` (auto-detected)
- Explicit: set `AI_PROVIDER=anthropic` or `AI_PROVIDER=openai`
- OpenRouter/Groq/Ollama: set `AI_GATEWAY_URL` + `AI_API_KEY` + `AI_MODEL`
- No key at all: falls back to Lovable AI Gateway

### New secrets needed
- `AI_API_KEY` — user's Anthropic or OpenAI key (already expected, no change)
- Optional `AI_PROVIDER` — explicit override (`anthropic`, `openai`, `openrouter`)
- Optional `AI_MODEL` — model override
- Optional `AI_GATEWAY_URL` — custom endpoint override

