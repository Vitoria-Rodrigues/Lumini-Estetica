---
name: markdown-expert
description: Use this skill to write, analyze, or update general Markdown files (.md), package READMEs, or skill instructions using GitHub Flavored Markdown (GFM).
---

# Markdown Expert

This skill defines the standards, structure, design patterns, and validation workflow for general Markdown documentation in the monorepo.

## 1. Global Documentation Standards

The following rules apply to all documentation tasks, regardless of file extension or location.

### A. Tone of Voice

- Maintain a highly didactic, clear, and encouraging educational tone. The primary reader is an architect focused on learning, not a software developer.
- Explain concepts thoroughly when writing plans or documentation. Break down complex steps so they are easy to study.
- Keep the structure clean and direct, avoiding robotic chatter but remaining welcoming and instructive.

### B. Bilingual Language Policy

- All router files (`AGENTS.md`) and package/directory headers (`README.md`) MUST be written in English (en-US).
- All technical documentation, extracted knowledge, and architectural briefs (especially within `docs/`) MUST be written in Portuguese (pt-BR).
- All execution and study plans (especially within `.agents/plans/`) MUST be written in Portuguese (pt-BR).

### C. Zero Emojis

- Emojis are strictly forbidden in all technical documents, READMEs, and skill files to maintain a professional, corporate appearance.

### D. Mermaid Diagram Standards

- Always define layout direction explicitly (e.g., `direction TD` or `direction LR`).
- Use clear node labels wrapped in double quotes (e.g., `node["label"]`) to prevent parser issues with special characters.
- Use subgraphs to explicitly illustrate Bounded Context boundaries (e.g., separating `extension/` logic from `studio/` logic).
- Do not use HTML formatting tags within Mermaid labels; rely on plain Markdown where supported.

### E. Zero Placeholders

- Never include empty sections, "TBD", or "TODO" notes in documentation. If a section is not yet ready, omit it completely.

### F. Prettier Formatting Standards

- All files must comply with the root Prettier formatting rules (2-space indentation, max 100-character line width, hyphen-based unordered lists, and proper JavaScript/TypeScript code block styling).

### G. Prohibited Absolute Paths

- Absolute filesystem paths or local protocol URLs (e.g., file scheme paths or `/absolute/path/...`) are strictly forbidden in all Markdown links and document references.
- All references must use:
  1. Standard relative paths (e.g., `./relative-file.md` or `../sibling/file.md`).
  2. Fully-qualified public web URLs with explicit domains (e.g., `https://example.com` or external domain references).

### H. Project Variables (Atualizado para Lumini Estética)

- **Contexto Central**: O projeto atual é o **Lumini Estética**, de autoria de **Vitória Rodrigues Ferreira**.
- **Regra de Nomenclatura**: O nome do projeto e da autora DEVEM ser utilizados explicitamente em todos os arquivos Markdown. Fica estritamente proibido o uso de variáveis genéricas, placeholders ou tokens de AST (como `%PROJECT_DOMAIN%` ou `%PROJECT_NAME%`).
- **Configuração**: Esta abordagem direta substitui a antiga configuração centralizada (`@monorepo/shared-config...`), mantendo a clareza e autoria evidentes na documentação.

---

## 2. Document Guidelines

Use these guidelines when creating, updating, or analyzing general repository documentation, package READMEs, or files under the `.agents/` folder.

- **Syntax Standard**: Must adhere to standard GitHub Flavored Markdown (GFM).
- **GFM Callouts**: Use GFM blockquote alerts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`) for admonitions.
- **Reference Files**:
  - GFM syntax and formatting: [syntax.md](./references/syntax.md)
  - Code examples and GitHub patterns: [patterns.md](./references/patterns.md)
  - Validation and verification workflow: [workflow.md](./references/workflow.md)

---

## 3. Build and Content Validation Workflow

Before completing any documentation task, you must execute the verification steps defined in the workflow guide:

- Follow the validation steps in [workflow.md](./references/workflow.md).
