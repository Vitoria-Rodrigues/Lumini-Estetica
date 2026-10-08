<context-hierarchy src="../AGENTS.md">
  <system-instruction>
    Stop now and read the parent context file before proceeding with any actions in this directory.
  </system-instruction>
</context-hierarchy>

# App Workspace Context

This document serves as the bounded context router (Layer 2) for the `app/` workspace of the **Lumini Estética** project.

## Purpose

To guide AI agents operating within the frontend and backend integration codebase, ensuring strict adherence to the business logic, user profiles, and technology choices defined by the creator, **Vitória Rodrigues Ferreira**.

## Guidelines

- **Source of Truth:** All components, hooks, schemas, and state logic generated MUST reflect the requirements detailed in [README.md](../README.md).
- **Technology Stack:** Exclusively utilize React.js, TypeScript, and Supabase (PostgreSQL). Do not introduce unauthorized libraries or frameworks.
- **Access Control (RBAC):** Any UI or API routes MUST enforce permissions for the Admin, Attendant, and Specialist roles exactly as specified.
- **Data Integrity:** Never implement hard-deletes for `Client` or `Procedure` entities that have associated consultations; always apply logical deletion/archiving.
