---
title: Installation
description: Install Sherlock on macOS, Linux, or Windows with curl or npm.
section: Getting Started
order: 1
---

Sherlock can be installed either as a standalone runtime bundle or as an npm package. For most users, the standalone installer is the simplest path because it downloads a prebuilt native bundle with zero external runtime dependencies.

## One-line installer (recommended)

On **macOS or Linux**, open a terminal and run:

```bash
curl -fsSL https://sherlock-ai.dev/install | bash
```

The installer detects your OS and architecture automatically. On macOS it supports both Intel and Apple Silicon. On Linux it supports x64 and arm64. The launcher is installed to `~/.local/bin`, the bundled runtime is unpacked into `~/.local/share/sherlock-ai`, and your `PATH` is updated when needed.

If you previously installed Sherlock through a package manager and still see local Node.js errors after a curl install, your shell is probably still resolving the older global binary first. Run `which -a sherlock-ai`, then `hash -r`, or launch the standalone shim directly with `~/.local/bin/sherlock-ai`.

On **Windows**, open PowerShell as Administrator and run:

```powershell
irm https://sherlock-ai.dev/install.ps1 | iex
```

This installs the Windows runtime bundle under `%LOCALAPPDATA%\Programs\sherlock-ai`, adds its launcher to your user `PATH`, and lets you re-run the installer at any time to update.

## Alternative: npm install

If you prefer installing Sherlock into an existing Node.js environment, use npm instead:

```bash
npm install -g sherlock-ai
```

This path uses your local Node.js runtime instead of the bundled standalone runtime. It requires a compatible Node.js version that satisfies Sherlock's current engine range: `>=20.19.0 <23`.

## Updating the standalone app

To update the standalone Sherlock app on macOS, Linux, or Windows, rerun the installer you originally used. That replaces the downloaded runtime bundle with the latest tagged release.

`sherlock-ai update` is different: it updates installed Pi packages inside Sherlock's environment, not the standalone app bundle itself.

If you installed Sherlock with npm, upgrade it with:

```bash
npm install -g sherlock-ai@latest
```

## Uninstalling

Sherlock does not currently ship a dedicated `uninstall` command. Remove the standalone launcher and runtime bundle directly, then optionally remove the Sherlock home directory if you also want to delete settings, sessions, and installed package state. If you also want to clear alphaXiv login state, remove `~/.ahub`.

If you installed Sherlock with npm, uninstall it with:

```bash
npm uninstall -g sherlock-ai
```

On macOS or Linux:

```bash
rm -f ~/.local/bin/sherlock-ai
rm -rf ~/.local/share/sherlock-ai
# optional: remove settings, sessions, and installed package state
rm -rf ~/.sherlock-ai
# optional: remove alphaXiv auth state
rm -rf ~/.ahub
```

On Windows PowerShell:

```powershell
Remove-Item "$env:LOCALAPPDATA\\Programs\\sherlock-ai" -Recurse -Force
# optional: remove settings, sessions, and installed package state
Remove-Item "$HOME\\.sherlock-ai" -Recurse -Force
# optional: remove alphaXiv auth state
Remove-Item "$HOME\\.ahub" -Recurse -Force
```

If you added the launcher directory to `PATH` manually, remove that entry as well.

## Skills only

If you only want Sherlock's research skills and not the full terminal runtime, install the skill library separately.

For a user-level install into `~/.codex/skills/sherlock-ai`:

```bash
curl -fsSL https://sherlock-ai.dev/install-skills | bash
```

For a repo-local install into `.agents/skills/sherlock-ai` under the current repository:

```bash
curl -fsSL https://sherlock-ai.dev/install-skills | bash -s -- --repo
```

For an OpenCode project-local install into `.opencode/skills/sherlock-ai`:

```bash
curl -fsSL https://sherlock-ai.dev/install-skills | bash -s -- --opencode
```

On Windows, install the skills into your Codex skill directory:

```powershell
irm https://sherlock-ai.dev/install-skills.ps1 | iex
```

Or install them repo-locally:

```powershell
& ([scriptblock]::Create((irm https://sherlock-ai.dev/install-skills.ps1))) -Scope Repo
```

Or install them into an OpenCode project:

```powershell
& ([scriptblock]::Create((irm https://sherlock-ai.dev/install-skills.ps1))) -Scope OpenCode
```

These installers download the bundled `skills/` and `prompts/` trees plus the repo guidance files referenced by those skills. They do not install the Sherlock terminal, bundled Node runtime, auth storage, or Pi packages.

## Pinned releases

The one-line installer already targets the latest tagged release. To pin an exact version, pass it explicitly:

```bash
curl -fsSL https://sherlock-ai.dev/install | bash -s -- 0.2.31
```

On Windows:

```powershell
& ([scriptblock]::Create((irm https://sherlock-ai.dev/install.ps1))) -Version 0.2.31
```

## Post-install setup

After installation, run the guided setup wizard to configure your model provider and API keys:

```bash
sherlock-ai setup
```

This walks you through selecting a default model, authenticating with your provider, and optionally installing extra packages for features like web search and document preview. See the [Setup guide](/docs/getting-started/setup) for a detailed walkthrough.

## Verifying the installation

Confirm Sherlock is installed and accessible:

```bash
sherlock-ai --version
```

If you see a version number, you are ready to go. Run `sherlock-ai doctor` at any time to diagnose configuration issues, missing dependencies, or authentication problems.
