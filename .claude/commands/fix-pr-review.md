Fetch PR Agent review comments from a GitHub PR, filter by relevance, and apply fixes to the codebase.

## Arguments

`$ARGUMENTS` is one of:

- `https://github.com/<owner>/<repo>/pull/<number>` — full PR URL
- `<number>` — PR number, uses current repo's remote
- `<number> <threshold>` — PR number with custom importance threshold (default: 7)
- `<url> <threshold>` — full PR URL with custom importance threshold (default: 7)

## Step 1: Parse arguments

If `$ARGUMENTS` is empty or whitespace, print the following and stop:

```
Usage: /fix-pr-review <pr-url-or-number> [threshold]
  pr-url-or-number  Full GitHub PR URL or bare PR number
  threshold         Minimum importance score to apply (default: 7)
```

From `$ARGUMENTS`:

- If the first argument is a full GitHub URL: extract `owner`, `repo`, and `number` from the URL path segments. The optional second argument is the `threshold`.
- If the first argument is a bare number: run `git remote get-url origin` to get the remote URL, then extract `owner/repo` from it (strip `git@github.com:` prefix or `https://github.com/` prefix and `.git` suffix). The optional second argument is the `threshold`.
- In both forms, `threshold` defaults to `7` if not provided.

## Step 2: Fetch review comments

Run:

```bash
gh pr view <number> --repo <owner>/<repo> --json comments
```

Parse the returned JSON. Each element of the `comments` array has an `author.login` field and a `body` field. Locate two PR Agent comments:

- **Reviewer Guide**: prefer the comment where `author.login` ends with `[bot]` AND `body` contains `## PR Reviewer Guide`. If no bot comment matches, fall back to the first comment whose `body` contains `## PR Reviewer Guide` and note that authorship could not be verified.
- **Code Suggestions**: prefer the comment where `author.login` ends with `[bot]` AND `body` contains `## PR Code Suggestions`. If no bot comment matches, fall back to the first comment whose `body` contains `## PR Code Suggestions` and note that authorship could not be verified.

If `gh` is not found: report "gh CLI not installed or not authenticated" and stop.
If neither comment is found: report "No PR Agent review found on PR #<number>" and stop.

## Step 3: Extract security issues

From the **Reviewer Guide** comment body, find the table row that contains `Security concerns`. Extract every bullet point or paragraph under that heading. These are always relevant — add all of them to the fix list regardless of the threshold.

Also scan the `Recommended focus areas` section. Include an item only if it contains **both** a file path reference (a markdown link to a file in the diff) **and** a quoted code block. If an item has no file path link or no code example, skip it — do not include architectural observations or style notes.

## Step 4: Extract and filter code suggestions

From the **Code Suggestions** comment body, each suggestion is wrapped in a `<details>` block. For each `<details>` block:

1. Extract the **title** from the `<summary>` tag (the first line before any line break).
2. Extract the **importance score** `N` from the literal text `Suggestion importance[1-10]: N` inside the inner `<details>` block, where `[1-10]` is literally those characters (a markdown notation, not a regex), and `N` is the integer that follows the colon and space.
3. Extract the **file path** and **line range** from the markdown link in the outer `<summary>` (format: `[path/to/file.ext [L63-L66]](url)`).
4. Extract the **diff** from the ` ```diff ` code block.

Keep only suggestions where `N >= threshold`. Discard the rest — add them to the skipped list with reason "below threshold (N/<threshold>)".

## Step 5: Apply fixes

Process security issues first, then code suggestions ordered by importance score descending.

For each item:

1. Read the target file.
2. Understand the problem from the description and/or diff.
3. **If the suggested diff applies cleanly to the current file state** — apply it directly (or apply a better version if codebase patterns, project rules, or TypeScript constraints suggest a cleaner approach; note the deviation with one sentence).
4. **If the suggested diff no longer applies cleanly** (surrounding code has changed) — derive the correct fix from the description and apply it to the current state of the file. Only skip with reason "cannot derive fix from description — intent ambiguous" when the description is also too vague to derive a safe fix from.
5. **If the item has no diff** (security issue description only) — read the flagged file and section, understand the vulnerability or bug, apply the appropriate fix. Explain the fix in one sentence before applying.
6. Never use `as any`, `as unknown`, or unsafe type assertions to resolve TypeScript errors introduced by a fix. Resolve them properly.

Do **not** commit after each fix. Collect all changes; the commit happens after all fixes are processed (see Step 7).

If a fix cannot be determined safely (ambiguous intent, would require architectural changes beyond this scope): skip it and add to the skipped list with reason "requires architectural decision".

## Step 6: Quality checks

After all fixes are applied, run from the workspace root:

```bash
pnpm --filter web lint && pnpm --filter web check-types
```

If either check fails: do **not** commit. Record every failing check in the end report under a "Quality check failures" section and instruct the developer to fix them manually before committing.

If both checks pass: proceed to Step 7.

## Step 7: Commit

Stage all changed files and create a single commit:

```
fix: apply PR#<number> review suggestions
```

Only create this commit if at least one fix was applied and both quality checks passed.

## Step 8: End report

After all items are processed, print a summary in this format:

```
Applied (N):
  ✓ <description of fix 1>
  ✓ <description of fix 2>

Skipped (M):
  – <description> (below threshold: 6/7)
  – <description> (cannot derive fix from description — intent ambiguous)
  – <description> (requires architectural decision)

Quality check failures (if any):
  ✗ <check name>: <error summary>
  → Fix the above before committing.

Commit: <sha> (or "No commit created — quality checks failed" / "No commit created — nothing applied")
```

If nothing was applied: report "No relevant issues found above the threshold."
