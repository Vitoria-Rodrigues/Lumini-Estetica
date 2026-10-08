## Description

Describe the changes introduced by this Pull Request. Include relevant context and technical rationale for Lumini Estética.

## Conventional Commit Reference

All commits must follow the Conventional Commits specification. Ensure your PR title matches this standard:

`[type]([scope]): [description]`

- Types: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `chore`
- Scopes: `app` | `docs` | `supabase` | `deps` | `github` | `agents`

---

## Technical Guardrails Checklist

Please verify that your code adheres to all project quality standards before requesting review:

- [ ] Strict English-First (en-US): Technical logic, comments, variable names, and changelogs are written in US English.
- [ ] Zero Emojis: Absolutely no emojis are used in the code, comments, or documentation files.
- [ ] Strict Boolean Logic: Checked that all JSX conditional expressions are written explicitly.
- [ ] Local Verification: Passed all local verification suites (`pnpm lint` and `pnpm typecheck`).

---

## Testing & Quality Assurance

### Manual Test Steps

Detail how to manually verify these changes. Provide exact steps, configuration setup, or commands to execute.

1. Step one
2. Step two

### Automated Test Coverage

- [ ] Automated tests added/updated.
- [ ] No test regressions.

---

## Deployment & Migrations

- [ ] Schema changes or database migrations are required (explain below if checked).
- [ ] New environment variables are required.
