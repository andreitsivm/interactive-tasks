# Fix PR Review Command — Design Spec

**Date:** 2026-06-07

---

## Goal

A Claude Code slash command `/fix-pr-review` that fetches PR Agent review comments from a GitHub PR, filters them by relevance, and applies the relevant fixes to the codebase.

---

## Invocation

```
/fix-pr-review <pr-url-or-number> [threshold]
```

Examples:
```
/fix-pr-review https://github.com/owner/repo/pull/1
/fix-pr-review 1
/fix-pr-review 1 6    ← custom importance threshold (default: 7)
```

When a full URL is provided, owner/repo/number are extracted from it.
When only a number is provided, the current repo's remote is used.

---

## Fetch

Use `gh pr view <number> --repo <owner/repo> --json comments` to retrieve all PR comments.

PR Agent always posts exactly two structured comments:
- **"PR Reviewer Guide 🔍"** — contains a Security concerns section and Recommended focus areas
- **"PR Code Suggestions ✨"** — contains code suggestions, each with an importance score

Parse both comments from the JSON response. If neither comment is found, report that no PR Agent review exists and exit.

---

## Relevance Filter

### Code Suggestions (from "PR Code Suggestions")

Each suggestion includes an embedded importance score in the format `importance[1-10]: N`.

Apply suggestions where N ≥ threshold (default 7). Skip everything below.

### Security Concerns (from "PR Reviewer Guide")

Apply all items listed in the **Security concerns** row of the Reviewer Guide table, regardless of score. Security issues are always treated as relevant.

### Recommended Focus Areas (from "PR Reviewer Guide")

Treat these the same as Code Suggestions — apply only if they reference a concrete bug or security problem. Skip architectural observations or style notes without a concrete fix.

---

## Fix Application

PR Agent's suggested diff is a **reference**, not a requirement:

- If the suggestion's diff is correct and applies cleanly to the current file state → apply it directly.
- If codebase context, project conventions, or a better pattern suggests a different approach → apply the better fix and note the deviation with a one-line explanation.
- If the surrounding code has changed since the review was posted and the suggestion no longer applies cleanly → skip it and include it in the skipped report.

For **Security issues** (which have descriptions but no diffs): read the flagged file, understand the problem from the description, derive the appropriate fix. Explain the fix before applying.

Never apply a suggestion blindly if it conflicts with project rules (TypeScript safety, no `as any`, etc.).

---

## Commit Strategy

One commit per fix:

```
fix: guard AUTH_SECRET before signing OTP tokens (PR#1 review)
fix: redirect unauthenticated users to /sign-in (PR#1 review)
```

Each commit message references the PR number so the fix is traceable.

---

## End Report

After all fixes are applied, output a short report:

```
Applied (3):
  ✓ Guard AUTH_SECRET before signing OTP tokens
  ✓ Redirect unauthenticated users to /sign-in
  ✓ Clear OTP attempt counter after successful verification

Skipped (2):
  – Export compiled package output (importance 8, cannot apply cleanly — file changed)
  – Add defaults for user creation (importance 6, below threshold)
```

---

## Command File Location

`.claude/commands/fix-pr-review.md`

This file is picked up automatically by Claude Code as the `/fix-pr-review` slash command.

---

## Constraints

- Commit each fix after it is applied and verified. Invoking the command is explicit authorization to commit individual fixes.
- Never use `as any` or unsafe type assertions when applying TypeScript fixes.
- If `gh` is not installed or not authenticated, report the error and exit cleanly.
- Do not apply fixes to files outside the current working directory.
