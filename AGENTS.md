# Monorepo Root Context

This document serves as the global context router (Layer 1) for the **Lumini Estética** monorepo, created by **Vitória Rodrigues Ferreira**.

## Purpose

To establish the global guardrails, required skills, and architectural source of truth for all AI agents operating within this repository.

## Required Skills

- `agent-router-expert`
- `markdown-expert`

## Guidelines

- **Source of Truth:** All agent actions, documentation updates, and code generation MUST be strictly aligned with the business rules, user definitions, and constraints outlined in [README.md](./README.md).
- **Language Policy:** All `AGENTS.md` router files and `README.md` headers MUST be written in English (en-US). All technical documentation, architectural briefs, and study plans MUST be written in Portuguese (pt-BR).
- **Prohibited Tokens:** Project names ("Lumini Estética") and the author's name ("Vitória Rodrigues Ferreira") MUST be written explicitly. The use of generic AST tokens (e.g., `%PROJECT_NAME%`) is strictly forbidden.

## Workspaces

- [.agents/](./.agents/AGENTS.md): Contains AI agent skills, local contexts, and execution plans.
- [app/](./app/AGENTS.md): The main application workspace containing the React.js and TypeScript frontend.
- [docs/](./docs/AGENTS.md): The unified Docusaurus documentation portal and technical guides.
- [supabase/](./supabase/AGENTS.md): The independent backend workspace for PostgreSQL database schemas and Deno Edge Functions.
