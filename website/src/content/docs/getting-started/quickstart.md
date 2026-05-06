---
title: Quick Start
description: Get up and running with Sherlock in under five minutes.
section: Getting Started
order: 2
---

This guide assumes you have already [installed Sherlock](/docs/getting-started/installation) and run `sherlock-ai setup`. If not, start there first.

## Launch the REPL

Start an interactive session by running:

```bash
sherlock-ai
```

You are dropped into a conversational REPL where you can ask research questions, run workflows, and interact with agents in natural language. Type your question and press Enter.

## Run a one-shot prompt

If you want a quick answer without entering the REPL, use the `--prompt` flag:

```bash
sherlock-ai --prompt "Summarize the key findings of Attention Is All You Need"
```

Sherlock processes the prompt, prints the response, and exits. This is useful for scripting or piping output into other tools.

## Start a deep research session

Deep research is the flagship workflow. It dispatches multiple agents to search, read, cross-reference, and synthesize information from academic papers and the web:

```bash
sherlock-ai
> /deepresearch What are the current approaches to mechanistic interpretability in LLMs?
```

The agents collaborate to produce a structured research report with citations, key findings, and open questions. The full report is saved to your session directory for later reference.

## Work with files

Sherlock can read and write files in your working directory. Point it at a paper or codebase for targeted analysis:

```bash
sherlock-ai --cwd ~/papers
> /review arxiv:2301.07041
```

You can also ask Sherlock to draft documents, audit code, or compare multiple sources by referencing local files directly in your prompts.

## Explore slash commands

Type `/help` inside the REPL to see all available slash commands. Each command maps to a workflow or utility, such as `/deepresearch`, `/review`, `/draft`, `/watch`, and more. You can also run any workflow directly from the CLI:

```bash
sherlock-ai deepresearch "transformer architectures for protein folding"
```

See the [Slash Commands reference](/docs/reference/slash-commands) for the complete list.
