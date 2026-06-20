# ⛧ arcana-community

**Self-improving AI agent CLI** — community edition. Skills, memory, gateway, coding, and cron in one terminal. Open-source, MIT-licensed, no monetization.

[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![version](https://img.shields.io/badge/version-0.2.25-purple)](https://github.com/Lento47/arcana-community/releases)

```sh
arcana doctor            # check system health
arcana run "query"       # one-shot agent session
arcana skills list       # browse 174 available skills
arcana memory sessions   # view past sessions
arcana cron list         # list scheduled jobs
arcana gateway           # start chat bots (Telegram, Discord, Slack, WhatsApp)
arcana learn list        # view accumulated knowledge
```

## Install

### Option 1: Download binary (fastest)

Download the latest binary from [GitHub Releases](https://github.com/Lento47/arcana-community/releases/latest) for your platform:

```sh
# Windows (PowerShell)
Invoke-WebRequest -Uri https://github.com/Lento47/arcana-community/releases/latest/download/arcana-win-x64.exe -OutFile arcana.exe
.\arcana.exe

# macOS / Linux
curl -L https://github.com/Lento47/arcana-community/releases/latest/download/arcana-linux-x64 -o arcana
chmod +x arcana
./arcana
```

### Option 2: Build from source

Requires [Bun](https://bun.sh) >= 1.3.14.

```sh
git clone https://github.com/Lento47/arcana-community.git
cd arcana-community
bun install
bun packages/arcana/src/index.ts   # run directly

# Or link as global command
cd packages/arcana && bun link
arcana
```

> **Windows users:** if `bun install` produces missing package errors at runtime (e.g. `Cannot find package 'ai'`), delete `bun.lock` and re-run `bun install`. This is a [known bun issue](https://github.com/oven-sh/bun/issues) with package catalog resolution on Windows.

## Quick start

```sh
# Set your API key (or use provider-specific env var)
export OPENAI_API_KEY=sk-...

# Verify everything is ready
arcana doctor

# Launch the terminal UI
arcana

# Or use the CLI
arcana run "explain this codebase"

# Browse and resume past sessions
arcana history list
arcana history resume --id <session-id>

# Search memory
arcana memory search --query "deployment config"
```

### Gateway (chat bots)

Configure in `~/.arcana/config.json`:
```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "gateway": {
    "telegram": { "token": "111:xxx" },
    "discord": { "token": "xxx" },
    "slack": { "botToken": "xoxb-xxx", "signingSecret": "xxx" }
  }
}
```

```sh
arcana gateway
```

### Cron

```sh
# Every 4 hours: run code review
arcana cron add "review PRs" "0 */4 * * *" "review open PRs for bugs"

# Daily summary
arcana cron add "daily digest" "@daily" "summarize today's changes"

# List / remove
arcana cron list
arcana cron remove <job-id>
```

## Packages

| Package | Description |
|---------|-------------|
| `@arcana/arcana` | CLI entry + agent runner |
| `@arcana/core` | Effect-based agent runtime, tools, session, database |
| `@arcana/engine` | Agent/session/tool/provider engine + TUI host (SolidJS + OpenTUI) |
| `@arcana/tui` | Terminal UI components, branding, theme |
| `@arcana/ui` | Web UI component library (SolidJS) |
| `@arcana/llm` | Multi-provider LLM routing (OpenAI, Anthropic, Gemini, Bedrock, etc.) |
| `@arcana/sdk` | JS SDK — typed API client + server spawner |
| `@arcana/server` | Hono + Effect HTTP API server |
| `@arcana/gateway` | Chat platform adapters (Telegram, Discord, Slack) |
| `@arcana/memory` | SQLite-backed conversation memory + FTS5 search |
| `@arcana/cron` | Scheduled agent jobs |
| `@arcana/skills` | 174 skill files across 28 categories |
| `@arcana/plugin` | Plugin system (30+ lifecycle hooks) |
| `@arcana/http-recorder` | VCR-style HTTP cassette recorder for Effect-based testing |

## Deep Dive

### `arcana memory` — FTS5-powered session memory

Search past session conversations, extracted facts, artifacts, and skill observations:
```sh
arcana memory search "deployment config"
arcana memory sessions --limit 10
arcana memory facts
arcana memory stats
```

### `arcana history` — browse and resume past sessions

```sh
arcana history list
arcana history show --id <session-id>
arcana history resume --id <session-id>
```

### `arcana learn` — self-improving knowledge pipeline

```sh
arcana learn list
arcana learn show --slug kebab-case-slug
arcana learn moc       # show map of consciousness
```

### `arcana doctor` — system health diagnostics

```sh
arcana doctor
```

### Gateway — Telegram, Discord, Slack, and WhatsApp

Four chat platform adapters with per-chat agent sessions:
```sh
arcana gateway
```

### Cron daemon — scheduled autonomous agents

```sh
arcana cron add "daily-review" --schedule "0 9 * * *" --prompt "review today's changes"
arcana cron list
arcana cron start     # run daemon (blocking)
```

## Skills

174 skills across categories: software-development, devops, security, data-science, blockchain, web-development, creative, productivity, research, and more.

```sh
arcana skills list
arcana skills search "python testing"
```

Skills live in `skills/` and `~/.arcana/skills/`. Each is a `SKILL.md` with YAML frontmatter — add your own.

## Configuration

`~/.arcana/config.json`:
```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "apiKey": "sk-...",
  "dataDir": "~/.arcana/data",
  "memory": { "enabled": true, "maxSessions": 1000 },
  "cron": { "enabled": true, "intervalSeconds": 60 }
}
```

Env overrides: `ARCANA_PROVIDER`, `ARCANA_MODEL`, `ARCANA_API_KEY`, `OPENAI_API_KEY`.

## Dev

```sh
bun install
bun run typecheck
bun run build
bun run test
```

### Arcana TUI

```sh
bun run dev:tui          # from repo root
# or
bun run --cwd packages/engine --conditions=browser packages/engine/src/index.ts
```

### Arcana CLI (standalone, no TUI)

```sh
bun packages/arcana/src/index.ts run "hello"
```

## Themes

7 arcane themes. `⛧ themes` in the TUI or set in `~/.config/arcana/tui.json`:
```json
{ "theme": "dragon" }
```

Themes: arcana (default), bloodmoon, coven, crypt, dragon, lich, wraith.

## Differences from arcana (main)

This community edition is the fully open-source, MIT-licensed version. The main [arcana](https://github.com/Lento47/arcana) repo includes additional features under a commercial license:

| Feature | Community | Main |
|---------|-----------|------|
| TUI + CLI agent | ✓ | ✓ |
| 174 skills | ✓ | ✓ |
| Gateway (Telegram, Discord, Slack, WhatsApp) | ✓ | ✓ |
| Cron scheduler | ✓ | ✓ |
| Memory + FTS5 search | ✓ | ✓ |
| Self-improving learn pipeline | ✓ | ✓ |
| Multi-provider LLM routing (30+ providers) | ✓ | ✓ |
| Enterprise dashboard | ✗ | ✓ |
| Team/organization features | ✗ | ✓ |
| Session sharing | ✗ | ✓ |
| Proxy + pay-as-you-go billing | ✗ | ✓ |
| Commercial license | ✗ | ✓ |

## Thanks

Arcana builds on incredible open-source work:

- **[OpenCode](https://github.com/anomalyco/opencode)** — the TUI engine (SolidJS + OpenTUI), provider system, tools, and CLI architecture.
- **[Hermes Agent](https://github.com/Lento47/hermes-agent)** — autonomous AI agent framework with sandboxing, memory, and multi-provider routing.
- **[models.dev](https://models.dev)** — community model catalog powering arcana's provider auto-discovery (200+ models across 33 providers).
- **[Effect](https://effect.website)** — typed functional effect system for reliable concurrency, error handling, and dependency injection.
- **[Bun](https://bun.sh)** — JavaScript runtime, bundler, and compiler.
- **[SolidJS](https://solidjs.com)** + **[OpenTUI](https://github.com/opentui/core)** — reactive UI framework + terminal rendering engine.
- **[AI SDK](https://sdk.vercel.ai)** — unified LLM provider interface (OpenAI, Anthropic, Google, Bedrock, and 30+ more).
- 174 skills from the open-source community across 28 categories.

## License

MIT — see [LICENSE](LICENSE).
