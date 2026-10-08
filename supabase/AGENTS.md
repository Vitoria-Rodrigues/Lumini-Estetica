<context-hierarchy src="../AGENTS.md">
  <system-instruction>
    Stop now and read the parent context file before proceeding with any actions in this directory.
  </system-instruction>
</context-hierarchy>

# Supabase Workspace Context

This document serves as the bounded context router (Layer 2) for the `supabase/` workspace of the **Lumini Estética** project, created by **Vitória Rodrigues Ferreira**.

## Purpose

To guide AI agents operating within the database and backend infrastructure, ensuring strict adherence to Supabase's ecosystem, PostgreSQL best practices, and Edge Functions architecture.

## Required Skills

- `agent-router-expert`
- `markdown-expert`

## Guidelines

- **Source of Truth:** All database schemas, migrations, and backend logic must align with the business rules, user definitions, and constraints specified in the root [README.md](../README.md).
- **Technology Stack:** Exclusively utilize Supabase CLI, PostgreSQL for migrations, Deno for Edge Functions, and TypeScript for function development.
- **Language Policy:** Technical documentation within this workspace MUST be written in Portuguese (pt-BR), as defined by the global language policy.
