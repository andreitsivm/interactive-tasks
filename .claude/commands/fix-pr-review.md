Fetch PR Agent review comments from a GitHub PR, filter by relevance, and apply fixes to the codebase.

## Arguments

`$ARGUMENTS` is one of:

- `https://github.com/<owner>/<repo>/pull/<number>` — full PR URL
- `<number>` — PR number, uses current repo's remote
- `<number> <threshold>` — PR number with custom importance threshold (default: 7)

## Step 1: Parse arguments

From `$ARGUMENTS`:

- If a full GitHub URL is provided: extract `owner`, `repo`, and `number` from the URL path segments.
- If only a number is provided: run `git remote get-url origin` to get the remote URL, then extract `owner/repo` from it (strip `git@github.com:` prefix or `https://github.com/` prefix and `.git` suffix).
- The `threshold` is the second argument if present, otherwise default to `7`.

## Step 2: Fetch review comments

Run:

```bash
gh pr view <number> --repo <owner>/<repo> --json comments
```

Parse the returned JSON. Locate two PR Agent comments in the `comments` array:

- **Reviewer Guide**: `body` contains `## PR Reviewer Guide`
- **Code Suggestions**: `body` contains `## PR Code Suggestions`

If `gh` is not found: report "gh CLI not installed or not authenticated" and stop.
If neither comment is found: report "No PR Agent review found on PR #<number>" and stop.

## Step 3: Extract security issues

From the **Reviewer Guide** comment body, find the table row that contains `Security concerns`. Extract every bullet point or paragraph under that heading. These are always relevant — add all of them to the fix list regardless of the threshold.

Also scan the `Recommended focus areas` section for items that describe a concrete bug with a code reference. Include those that have a clear, actionable fix. Skip items that are purely architectural observations or style notes.

## Step 4: Extract and filter code suggestions

From the **Code Suggestions** comment body, each suggestion is wrapped in a `<details>` block. For each `<details>` block:

1. Extract the **title** from the `<summary>` tag (the first line before any line break).
2. Extract the **importance score** `N` from the pattern `Suggestion importance[1-10]: N` inside the inner `<details>` block.
3. Extract the **file path** and **line range** from the markdown link in the outer `<summary>` (format: `[path/to/file.ext [L63-L66]](url)`).
4. Extract the **diff** from the ` ```diff ` code block.

Keep only suggestions where `N >= threshold`. Discard the rest — add them to the skipped list with reason "below threshold (N/<threshold>)".

## Step 5: Apply fixes

Process security issues first, then code suggestions ordered by importance score descending.

For each item:

1. Read the target file.
2. Understand the problem from the description and/or diff.
3. **If the suggested diff applies cleanly to the current file state** — apply it directly (or apply a better version if codebase patterns, project rules, or TypeScript constraints suggest a cleaner approach; note the deviation with one sentence).
4. **If the suggested diff no longer applies cleanly** (surrounding code has changed) — derive the correct fix from the description and apply it to the current state of the file.
5. **If the item has no diff** (security issue description only) — read the flagged file and section, understand the vulnerability or bug, apply the appropriate fix. Explain the fix in one sentence before applying.
6. Never use `as any`, `as unknown`, or unsafe type assertions to resolve TypeScript errors introduced by a fix. Resolve them properly.
7. After each fix is applied and the file is saved: commit with the message format:
   ```
   fix: <short description of what was fixed> (PR#<number> review)
   ```

If a fix cannot be determined safely (ambiguous intent, would require architectural changes beyond this scope): skip it and add to the skipped list with reason "requires architectural decision".

## Step 6: End report

After all items are processed, print a summary in this format:

```
Applied (N):
  ✓ <description of fix 1>
  ✓ <description of fix 2>

Skipped (M):
  – <description> (below threshold: 6/7)
  – <description> (cannot apply cleanly — context changed)
  – <description> (requires architectural decision)
```

If nothing was applied: report "No relevant issues found above the threshold."
