---
name: publish-site
description: Publish pending changes to the LineMaster 2.4GHz ToolBox website (this repo) by committing them and pushing to GitHub, which triggers a live rebuild on GitHub Pages at www.linemaster24ghz.com. Use this whenever the user asks to publish, deploy, go live, or "subir"/"publicar"/"sube los cambios"/"publica la página" — even if they don't say the word "skill", "deploy", or "commit" explicitly. Also use it when the user asks whether the site is "up to date" or what's pending to publish.
---

# Publish Site

This repo (`LineMaster-2.4GHz-ToolBox`) is a static site — no build step. GitHub Pages serves it directly from the `main` branch, so **publishing = committing the pending changes and pushing `main` to `origin`**. A few minutes after the push lands, GitHub Pages rebuilds and the live site at www.linemaster24ghz.com reflects it.

Because a push here is not just a local git operation — it updates a public repo and triggers a live deploy of a real website — treat it with the same care as any action visible to others. Never skip the confirmation step below, even if the user has approved a push earlier in the same session: each publish is its own decision.

## Steps

### 1. See what's actually pending
Run `git status` and `git diff` (staged + unstaged) to see exactly what changed. Run `git log --oneline -10` too — this repo's history uses Conventional Commits (`feat:`, `fix:`, `chore:`) written in English, even though chat with the user happens in Spanish. Match that convention for the commit message; don't switch to Spanish just because the conversation is in Spanish.

If there's nothing pending (`git status` is clean and local `main` already matches `origin/main`), just tell the user the site is already up to date — there's nothing to publish.

### 2. Summarize the changes for the user
Before touching anything, give a short human-readable list of what changed (which pages/files, and roughly why, based on the diff and recent conversation context) — not a raw `git status` dump.

### 3. Stage deliberately
Stage the files that belong to this publish with `git add <specific paths>`. Don't reach for `git add -A` or `git add .` on autopilot — glance at what's untracked first so a stray scratch file, credential, or unrelated experiment doesn't hitch a ride into the commit.

### 4. Commit
Write a Conventional Commit message (`feat:`, `fix:`, `chore:`, etc.) in English, focused on *why* the change was made, not a restatement of the filenames. Create a new commit — don't amend, don't use `--no-verify`.

### 5. Show the push preview and get explicit confirmation
Before running `git push`, tell the user plainly:
- which branch and remote (`main` → `origin`, i.e. `https://github.com/hardwork91/LineMaster-2.4GHz-ToolBox.git`)
- the commit(s) about to go out (`git log origin/main..HEAD --oneline`)

Then ask a direct yes/no question — something like "¿Confirmas el push a `main`? Esto dispara el rebuild en vivo de GitHub Pages." Wait for a clear yes. Don't infer consent from the original "publish the site" request — that request authorizes the workflow up to this checkpoint, not the push itself.

### 6. Push
Only after explicit confirmation, run `git push origin main`. Never `--force`, never push to any branch other than what the user confirmed.

### 7. Close the loop
Tell the user the push succeeded and that GitHub Pages typically takes a couple of minutes to rebuild before www.linemaster24ghz.com shows the update. If they want to watch the build, point them at `https://github.com/hardwork91/LineMaster-2.4GHz-ToolBox/actions` (or the repo's Pages settings) rather than fetching it yourself.

## If something's off

- Uncommitted work that looks unrelated to the current task (e.g. someone else's in-progress edit): flag it and ask before including or discarding it — don't silently sweep it into the commit or stash it away.
- Local `main` behind `origin/main`: stop and tell the user rather than force-pushing or rebasing on your own judgment.
- Merge conflicts: surface them plainly; don't resolve by discarding either side without asking.
