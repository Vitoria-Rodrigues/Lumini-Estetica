<context-hierarchy src="../AGENTS.md">
  <system-instruction>
    Stop now and read the parent context file before proceeding with any actions in this directory.
  </system-instruction>
</context-hierarchy>

# Docs Workspace Context

This document serves as the bounded context router (Layer 2) for the `docs/` workspace of the **Lumini Estética** project, created by **Vitória Rodrigues Ferreira**.

## Purpose

To guide AI agents operating within the documentation portal, ensuring strict adherence to the Docusaurus framework, MDX syntax, and the Diátaxis documentation structure.

## Required Skills

- `docusaurus-expert`
- `markdown-expert`

## Guidelines

- **Source of Truth:** All documentation must align with the business rules, user definitions, and architecture specified in the root [README.md](../README.md) and [AUDITORIA.md](../AUDITORIA.md).
- **Technology Stack:** Exclusively utilize Docusaurus and `.mdx` files for the unified documentation portal.
- **Language Policy:** Technical documentation within this workspace MUST be written in Portuguese (pt-BR), as defined by the global language policy.
