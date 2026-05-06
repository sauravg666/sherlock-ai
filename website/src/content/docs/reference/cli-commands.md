---
title: CLI Commands
description: Complete reference for all Sherlock CLI commands and flags.
section: Reference
order: 1
---

This page covers the dedicated Sherlock CLI commands and flags. Workflow commands like `sherlock-ai deepresearch` are also documented in the [Slash Commands](/docs/reference/slash-commands) reference since they map directly to REPL slash commands.

## Core commands

| Command | Description |
| --- | --- |
| `sherlock-ai` | Launch the interactive REPL |
| `sherlock-ai chat [prompt]` | Start chat explicitly, optionally with an initial prompt |
| `sherlock-ai help` | Show CLI help |
| `sherlock-ai setup` | Run the guided setup wizard |
| `sherlock-ai setup preview` | Install or verify preview dependencies |
| `sherlock-ai doctor` | Diagnose config, auth, Pi runtime, and preview dependencies |
| `sherlock-ai status` | Show the current setup summary (model, auth, packages) |

## Model management

| Command | Description |
| --- | --- |
| `sherlock-ai model list` | List available models in Pi auth storage |
| `sherlock-ai model login [id]` | Authenticate a model provider with OAuth or API-key setup |
| `sherlock-ai model logout [id]` | Clear stored auth for a model provider |
| `sherlock-ai model set <provider/model>` | Set the default model for all sessions |

These commands manage your model provider configuration. The `model set` command updates `~/.sherlock-ai/settings.json` with the new default. It accepts either `provider/model-name` or `provider:model-name`, for example `anthropic/claude-sonnet-4-20250514` or `anthropic:claude-sonnet-4-20250514`. Running `sherlock-ai model login google` or `sherlock-ai model login amazon-bedrock` routes directly into the relevant API-key setup flow instead of requiring the interactive picker.

## AlphaXiv commands

| Command | Description |
| --- | --- |
| `sherlock-ai alpha login` | Sign in to alphaXiv |
| `sherlock-ai alpha logout` | Clear alphaXiv auth |
| `sherlock-ai alpha status` | Check alphaXiv auth status |

AlphaXiv authentication enables Sherlock to search and retrieve papers, access discussion threads, and pull citation metadata. The `alpha` CLI is also available directly in the agent shell for paper search, Q&A, and code inspection.

## Package management

| Command | Description |
| --- | --- |
| `sherlock-ai packages list` | List all available packages and their install status |
| `sherlock-ai packages install <preset>` | Install an optional package preset |
| `sherlock-ai update [package]` | Update installed packages, or a specific package by name |

Use `sherlock-ai packages list` to see which optional packages are available on your platform and which are already installed. Core packages already include memory and session search. The `all-extras` preset installs every optional package available on the current platform.

## Utility commands

| Command | Description |
| --- | --- |
| `sherlock-ai search status` | Show Pi web-access status and config path |

## REPL hotkeys

Inside the interactive REPL, use `/hotkeys` to show the live keyboard map. The default reasoning controls are:

| Hotkey | Action |
| --- | --- |
| `Shift+Tab` | Cycle thinking/reasoning level |
| `Ctrl+T` | Toggle thinking block visibility |

## Workflow commands

All research workflow slash commands can also be invoked directly from the CLI:

```bash
sherlock-ai deepresearch "topic"
sherlock-ai lit "topic"
sherlock-ai review artifact.md
sherlock-ai audit 2401.12345
sherlock-ai replicate "claim"
sherlock-ai compare "topic"
sherlock-ai draft "topic"
```

These are equivalent to launching the REPL and typing the corresponding slash command.

## Flags

| Flag | Description |
| --- | --- |
| `--prompt "<text>"` | Run one prompt and exit (one-shot mode) |
| `--model <provider/model|provider:model>` | Force a specific model for this session |
| `--thinking <level>` | Set thinking level: `off`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `--cwd <path>` | Set the working directory for all file operations |
| `--session-dir <path>` | Set the session storage directory |
| `--new-session` | Start a new persisted session |
| `--alpha-login` | Sign in to alphaXiv and exit |
| `--alpha-logout` | Clear alphaXiv auth and exit |
| `--alpha-status` | Show alphaXiv auth status and exit |
| `--doctor` | Alias for `sherlock-ai doctor` |
| `--setup-preview` | Alias for `sherlock-ai setup preview` |
