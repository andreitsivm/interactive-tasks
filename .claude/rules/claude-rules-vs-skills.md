# Rules vs Skills — How to Divide Responsibilities

When adding new agent guidance, decide whether it belongs in `.claude/rules/` or `.claude/skills/` before writing it.

## Rules (`.claude/rules/`)

A rule answers: **"What constraint must be followed every time?"**

Rules contain:

- Architectural decisions ("always", "never", "must", "must not")
- Naming conventions and file placement
- What belongs in a package/layer and what does not
- Short illustrative snippets (1-5 lines) that clarify a constraint
- Checklists an agent follows on every feature

Rules do NOT contain:

- Full implementation code (10+ line code blocks that scaffold something)
- Step-by-step setup guides
- Code that only runs once (e.g. setting up a module, configuring a library)

**Test:** If the content would still be relevant on the 100th feature built in this codebase, it's a rule. If it's only needed the first time something is set up, it's a skill.

## Skills (`.claude/skills/<name>/SKILL.md`)

A skill answers: **"How do I implement this specific thing?"**

Skills contain:

- Full code scaffolds and templates
- Step-by-step setup guides for libraries or patterns
- Code that is generated once and then lives in the codebase
- Numbered implementation sequences

Skills do NOT contain:

- Constraints or "always/never" statements — those belong in rules
- Duplicate content that already exists in rules — reference the rule instead

**Test:** If an agent would only need this content when setting something up for the first time (or when explicitly asked to scaffold), it's a skill.

## References between files

Rules reference skills when a constraint has an associated implementation:

```
See `@.claude/skills/nestjs-create-module` for the full scaffold with code templates.
```

Skills reference rules at the top when the implementation must follow constraints:

```
Always read nestjs-module-structure.md and nestjs-dtos-drizzle.md rules first.
```

## Skill frontmatter

Every skill must include a frontmatter block with `name`, `description`, and trigger phrases so the agent knows when to invoke it:

```markdown
---
name: skill-name
description: >
  Use when [specific trigger]. Triggers on: "[phrase1]", "[phrase2]".
  [One sentence on what it covers.]
  Always read [relevant-rule.md] first.
---
```

## Quick reference

| Content type                            | Location          |
| --------------------------------------- | ----------------- |
| "Always use X", "Never do Y"            | `.claude/rules/`  |
| Naming convention table                 | `.claude/rules/`  |
| Architectural boundary rule             | `.claude/rules/`  |
| Short clarifying snippet (≤5 lines)     | `.claude/rules/`  |
| Feature checklist                       | `.claude/rules/`  |
| Full module scaffold (all files + code) | `.claude/skills/` |
| Library setup guide (first-time config) | `.claude/skills/` |
| Code templates with placeholders        | `.claude/skills/` |
| Step-by-step numbered sequence          | `.claude/skills/` |
