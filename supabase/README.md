# Lumini Estética - Supabase Backend

> [!NOTE]
> **Project Creator:** Vitória Rodrigues Ferreira
> **Tech Stack:** Supabase, PostgreSQL, Deno, TypeScript

This workspace contains the database architecture, migrations, and backend logic (Edge Functions) for the Lumini Estética project. It operates as an independent backend infrastructure within the monorepo ecosystem.

## Core Purpose

To provide a robust, scalable, and secure backend environment that powers the React application, centralizing business data and server-side logic.

## Directory Structure

- `migrations/`: Contains SQL files defining the PostgreSQL database schema and row-level security (RLS) policies.
- `functions/`: Contains Deno-based Edge Functions written in TypeScript for custom server-side business logic.
- `config.toml`: The configuration file for the Supabase CLI, defining local development settings and linked project configurations.

## Development

This workspace is managed using the Supabase CLI. For deployment and continuous integration details, refer to the workflows defined in the `.github/` directory and the root `AUDITORIA.md` document.
