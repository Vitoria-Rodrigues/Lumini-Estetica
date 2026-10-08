<context-hierarchy src="../AGENTS.md">
  <system-instruction>
    Stop now and read the parent context file before proceeding with any actions in this directory.
  </system-instruction>
</context-hierarchy>

# Agents & Automation Context

This document serves as the bounded context router (Layer 2) for the `.agents/` workspace of the
**Lumini Estética** project, created by **Vitória Rodrigues Ferreira**.

## Purpose

This directory manages all AI agent behaviors, skills, and user-driven execution plans for Lumini
Estética. All new contexts and architectures MUST be strictly based on the core rules defined in
the [../README.md](../README.md).

## Required Skills

- `skill-expert`
- `agent-router-expert`

## Workspaces

- [skills/](./skills/): Contains all custom agent skills, formatted according to the `skill-expert`
  guidelines.
- [plans/](./plans/): Directory dedicated to study and execution plans authored by the user.

## Tooling and MCP Integration Guidelines

- **Web Scraping and Research**: Agents MUST prioritize using the `firecrawl-mcp` server (via
  `call_mcp_tool` with `firecrawl_scrape` or `firecrawl_search`) for fetching official documentation
  or deep web scraping, instead of relying on generic search tools.
- **Documentation Queries**: Agents MUST use the `context7-mcp` server (via `call_mcp_tool` with
  `query-docs`) for precise library documentation lookups when resolving technical implementations.
- **Tool Execution**: Agents MUST evaluate the need for specialized MCP tools before falling back
  to generic search tools, ensuring high-fidelity data extraction for architectural plans.

## Guidelines

- Agents MUST strictly follow the directives in [skills/](./skills/) when performing tasks.
- The [plans/](./plans/) directory is the primary source of truth for upcoming development goals
  and architectural milestones.
- Any new agent logic or documentation generated MUST adhere to the business rules, user definitions,
  and requirements specified in [../README.md](../README.md).

## Script Execution Policy

- **Strict Script Location**: Any script created for agent tasks (e.g., Python, Node/CJS, Shell) MUST be placed inside the `[skills/skill-expert/scripts/](./skills/skill-expert/scripts/)` directory.
- **No Scripts in Root**: Creating temporary or persistent scripts in the repository root or outside the designated directory is strictly forbidden.
- **Lifecycle Management**: 
  - If a script is reusable, it should be kept in the `scripts/` directory for future use.
  - If a script is a one-off or temporary (scratch script), it MUST still be created inside `skills/skill-expert/scripts/`, executed, and then immediately DELETED after use.
