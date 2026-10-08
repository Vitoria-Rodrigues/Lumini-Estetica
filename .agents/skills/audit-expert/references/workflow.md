# Auditoria Document Update Workflow

This document defines the strict step-by-step execution loop for evaluating and writing updates to the `AUDITORIA.md` file.

## 1. Document Context Retrieval
Before drafting any new content, you MUST fully read the current state of `AUDITORIA.md`. 
Analyze the existing Table of Contents and headers to understand the current context blocks.

## 2. Content Integration Analysis
Instead of blindly appending new topics to the end of the document:
- **Zero Redundancy Rule**: Vigorously check for overlapping or duplicate explanations across the entire document. If a concept (like pnpm Workspaces, caching, or Typescript) is already explained elsewhere, you MUST NOT create a redundant section. Instead, unify the information robustly into a single, cohesive block. Delete the old redundant block if you merge its unique data elsewhere.
- Identify if the new information naturally belongs to an existing section (e.g., adding ESLint enterprise rules to an existing ESLint or Quality section).
- If an existing section matches the theme, **merge and integrate** the new content there. You may rename sub-headers or alter the flow to maintain cohesion and didactic clarity, but you MUST preserve the original core meaning and historical data while eliminating duplicate explanations.
- Only create new top-level sections if the new information introduces an entirely novel architectural layer or workflow that does not fit anywhere else.

## 3. Structural Constraints
- **The Conclusion Rule**: The document MUST end with a "Conclusão" (Conclusion) section. Whenever you add new content or sections, you MUST verify the position of the Conclusion and move it to the very bottom of the document if it was displaced.
- **Formal Headers**: Avoid colorful markdown alerts (`> [!IMPORTANT]`) or decorative elements at the header of the document or inside new sections. Emulate a formal, professional corporate paper.

## 4. Execution Step-by-Step
1. Read `AUDITORIA.md`.
2. Map the new requested information to existing sections.
3. Draft the integrated text ensuring a humble, didactic, and non-arrogant tone.
4. Update the document, ensuring sections flow logically.
5. Guarantee the Conclusion section is the final section.
6. Run the markdown-expert checks mentally to ensure GFM compliance.
7. **Version Control Mandate**: After updating `AUDITORIA.md`, you MUST immediately stage, commit, and push *only* this file to preserve the change history (e.g., `git add AUDITORIA.md && git commit -m "docs(audit): update..." && git push`).
