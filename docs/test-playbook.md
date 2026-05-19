# dsx test playbook

End-to-end smoke for the dsx iteration workflow. Designed to be run start-to-finish in a fresh client session (Claude Code, Codex, Cursor, …) on a clean checkout. Estimated time: 15–25 minutes.

Each step has **Run**, **Expect**, and **Verify** lines. Skip the OPTIONAL sections (fence, multi-client) if you're just smoke-testing the canonical Claude Code path.

---

## 0. Pre-flight

**Run:**
```bash
node --version            # >= 20.0.0
pnpm --version            # >= 10
apm --version             # >= 0.8 (CLI version; spec tag is v0.14)
git status                # working tree clean
```

**Expect:** all four commands succeed; git tree is clean.

**Verify:** if `apm` is missing, install it:
```bash
curl -sSL https://aka.ms/apm-unix | APM_INSTALL_DIR=$HOME/.local/bin sh    # Linux/macOS
# Windows PowerShell:
# irm https://aka.ms/apm-windows | iex
```

---

## 1. Bootstrap (skip if already installed)

**Run:**
```bash
pnpm install                                   # workspace deps
apm install                                    # deploy harness to local clients
pnpm exec playwright install chromium          # optional (visual regression)
pnpm pipeline                                  # seed mirror outputs
```

**Expect:**
- `apm install` reports `Deployed N local primitive(s) from .apm/` with at least 4 agents, 10 prompts, 21 skills, hooks.
- `pnpm pipeline` ends with `pipeline: DESIGN.md → gallery + storybook in ~2000 ms.`

**Verify:**
```bash
ls .claude/skills/ | wc -l                     # 21
ls .claude/agents/                             # 4 files
ls .claude/commands/                           # 10 files
cat .dsx/versions/_index.json | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).length)"   # 5
```

---

## 2. Start the dev stack

**Run (separate terminal):**
```bash
pnpm dev
```

**Expect:** three named processes — `watch` (chokidar), `gallery` (Next.js on :3000), `storybook` (Vite on :6006).

**Verify:**
- Open `http://localhost:3000` → component gallery loads with the Helios amber palette.
- Open `http://localhost:6006` → Storybook with `Smoke/`, `Pages/`, `Sections/` groups in the sidebar (assuming chapter-2 smoke artifacts are present from chapter 2 ship state).

Keep `pnpm dev` running for the rest of the playbook.

---

## 3. Chapter 1 — DESIGN.md workflow

### 3a. `/restore base` (dedupe check)

**Run** (in your client):
```
/restore base
```

**Expect:** Pipeline output ends with `snapshot: no-op snapshot skipped (tokens.css unchanged since vN).` and the version index does **not** grow.

**Verify:**
```bash
node -e "const i=JSON.parse(require('fs').readFileSync('.dsx/versions/_index.json'));console.log('versions:',i.length)"
# should still print 5
```

### 3b. `/design "<brief>"` (new direction)

**Run:**
```
/design "outdoor camping gear store, rugged but inviting, dark forest tones, off-white cards"
```

**Expect:**
- Agent picks a top reference (likely `consumer-vivid.md` or `editorial-heritage.md`) and reports the score.
- A new DESIGN.md is written with a forest-green primary (e.g. `#0d1d28`-ish).
- Pipeline runs; new `vN` slot appears (palette visibly different from base).

**Verify:**
- Reload `http://localhost:3000` → gallery palette has shifted. Components render in the new colours.
- `node -e "const i=JSON.parse(require('fs').readFileSync('.dsx/versions/_index.json'));console.log(i[i.length-1])"` → last entry's `paletteHex[0]` is the new primary.

### 3c. `/snapshot "<name>"` (rename)

**Run:**
```
/snapshot "camping-test"
```

**Expect:** Most-recent `vN` slot is renamed to `camping-test`.

**Verify:**
- Gallery home → version picker shows `camping-test` in the dropdown.

### 3d. `/tweak "<adjustment>"` (surgical edit)

**Run:**
```
/tweak "tighten spacing throughout, make borders 1px lighter, keep colors"
```

**Expect:**
- DESIGN.md mutated in place (no full rewrite); pipeline runs; new `v(N+1)` slot appears with a slightly-different palette (or identical palette → no-op skip).
- Lint passes.

**Verify:**
- Gallery components look denser; border colours softer.

### 3e. `/restore <named>` (revert to a snapshot)

**Run:**
```
/restore camping-test
```

**Expect:** DESIGN.md replaced with the snapshot's content; pipeline runs.

**Verify:** Gallery returns to the camping palette without the spacing tweak.

### 3f. `/restore base` (return to ship state)

**Run:**
```
/restore base
```

**Expect:** Helios amber palette restored.

**Verify:** Gallery and Storybook both show the Helios palette again.

---

## 4. Chapter 2 — Storybook workflow

### 4a. `/page "<brief>"` (new full page)

**Run:**
```
/page "minimal SaaS landing page for an indie analytics tool — hero, three-up features, single CTA band"
```

**Expect:**
- Agent picks the top page reference (likely `landing-saas.stories.tsx`, score ≥ 3).
- New file at `apps/storybook/src/pages/<slug>.stories.tsx`.
- Reply names the reference, the score, the file path, and the Storybook URL.

**Verify:**
- Refresh Storybook → new `Pages/<Name>` entry appears in the sidebar.
- Click into it; the page renders in the active Helios palette.

### 4b. Storybook version picker (story × design matrix)

**Run:** in Storybook, click the paintbrush toolbar icon → select `camping-test` (or `v3`).

**Expect:** Same page re-paints in the camping palette within ~50 ms. No reload, no rebuild.

**Verify:** Right-click → Inspect → look for `<link rel="stylesheet" href="/versions/camping-test/tokens.css" data-dsx-version="camping-test">` at the end of `<head>`.

Switch back to **Active (live DESIGN.md)** to clear the override.

### 4c. `/refine <slug> "<adjustment>"` (surgical edit)

**Run** (replace `<slug>` with the slug from 4a):
```
/refine pages/<slug> "more vertical density — cut hero padding by half, tighten the feature grid gap"
```

**Expect:**
- Surgical edits only (a few lines). Agent reports what changed.
- Storybook hot-reloads; the page is visibly tighter.

**Verify:** `git diff apps/storybook/src/pages/<slug>.stories.tsx` shows a small, focused diff.

### 4d. `/section "<brief>"` (new section)

**Run:**
```
/section "pricing tier card with three plans, monthly/annual toggle, recommended middle plan"
```

**Expect:**
- Reference picked (likely `pricing-tiered`, score ≥ 4).
- New file at `apps/storybook/src/sections/<slug>.stories.tsx`.

**Verify:** Storybook sidebar gets a `Sections/<Name>` entry. Loads with `layout: 'centered'`.

---

## 5. Cross-surface check (DESIGN.md edit re-themes Storybook too)

**Run:**
```
/tweak "shift primary to a slightly warmer amber"
```

**Expect:**
- Pipeline runs; new vN. Both the gallery AND every Storybook story now use the warmer primary.

**Verify:**
- Open the page from 4a in Storybook → primary buttons reflect the new warmth.
- Switch toolbar back to `Active (live DESIGN.md)` if you'd swapped to a saved version.

**Run** (return to clean state):
```
/restore base
```

---

## 6. Visual regression (chapter-1 only — Storybook isn't in the suite)

**Run:**
```bash
pnpm test:visual
```

**Expect:** `6 passed` (home + tokens × 360/768/1280).

**Verify:** If a baseline diverges, `pnpm test:visual:update` regenerates. Don't commit the regen unless you intended the visual change.

---

## 7. OPTIONAL — fence enforcement

The fence is shipped disabled by default during active dev. If you want to verify the constraint works:

**Run:**
```bash
mv .apm/hooks/dsx-fence.json.disabled .apm/hooks/dsx-fence.json
apm install
```

**Run** (in your client): ask the agent to edit a non-surface file, e.g. "rename the Button component to BasicButton".

**Expect:** The Write/Edit tool call is rejected with the dsx surface message and exit code 2.

**Run:** ask the agent to edit DESIGN.md or a story file.

**Expect:** Allowed (exit 0).

**Cleanup:**
```bash
mv .apm/hooks/dsx-fence.json .apm/hooks/dsx-fence.json.disabled
apm install
```

---

## 8. OPTIONAL — multi-client smoke

dsx ships its harness to every locally-installed client via `apm install`. To verify a non-Claude client works:

**Codex CLI** — open Codex in the repo:
- Confirm `ls .codex/agents/` shows `*.toml` files (one per agent).
- Confirm `cat .codex/hooks.json` contains the Stop + PostToolUse blocks.
- Ask Codex in prose: *"compose a new dashboard page for ops monitoring — sidebar nav, KPI strip, status table."*
- Expect the agent to write to `apps/storybook/src/pages/<slug>.stories.tsx`. (No `/page` slash command in Codex — prose carries the same intent.)

**Cursor** — open the repo in Cursor:
- Confirm `ls .cursor/commands/` shows the same prompts.
- Confirm `.cursor/rules/` has the dsx rules in `.mdc` format.
- Run `/page` (Cursor supports slash commands).

**GitHub Copilot CLI** — `cd` into the repo:
- Confirm `ls .github/prompts/` shows `*.prompt.md` files.
- Copilot doesn't support slash commands, so write prose: *"compose a sign-in page with OAuth providers."*

---

## 9. Cleanup

**Run** (in your client, asking the agent to do it):
- Delete the test pages and sections you created in steps 4a, 4d (and any extras). Or just `git restore apps/storybook/src/pages/<slug>.stories.tsx` for each.

**Run:**
```
/restore base
```

**Run:**
```bash
git status
```

**Expect:** Only intentional changes remain. Untracked client trees (`.claude/`, `.codex/`, …) are fine — they're regenerated.

If the playbook generated extra `vN` slots in `.dsx/versions/`, that's expected; they're part of the project history. If you want to prune them: `rm -rf .dsx/versions/vN .dsx/versions/v(N+1) ...` and trim `.dsx/versions/_index.json` accordingly.

---

## What this playbook validates

| Subsystem | Test |
|---|---|
| APM harness deployment | step 1 (counts) |
| Three-server dev stack | step 2 |
| `/restore` dedupe via tokens.css sha256 | step 3a |
| Reference scoring (chapter 1) | step 3b |
| Pipeline → gallery propagation | step 3b verify |
| Snapshot rename | step 3c |
| Surgical `/tweak` edits | step 3d |
| `/restore` to named slot | step 3e |
| Reference scoring (chapter 2) | step 4a |
| Storybook auto-discovery | step 4a verify |
| Version-aware decorator (instant swap) | step 4b |
| Surgical `/refine` edits | step 4c |
| `/section` separate from `/page` | step 4d |
| Cross-surface re-theming | step 5 |
| Visual regression suite | step 6 |
| Agent surface fence | step 7 (optional) |
| Multi-client deployment | step 8 (optional) |

## When something fails

| Symptom | Likely fix |
|---|---|
| `apm: command not found` | Install per step 0. |
| `apm install` deploys 0 primitives | `cd` into repo root; check `.apm/` exists and isn't empty. |
| Slash commands missing in Claude | Run `apm install` (or rerun if `.claude/commands/` is empty). |
| Gallery `/tokens` page 404s | `pnpm pipeline` to regenerate `apps/gallery/app/tokens.active.css`. |
| Storybook toolbar paintbrush empty | `pnpm pipeline` to regenerate `apps/storybook/.storybook/versions.json`. |
| Visual test fails on tokens-1280 | Known transient — `pnpm test:visual:update` once. |
| `/restore base` creates a new vN | Check tokens.css sha256 matches base — if hashes differ, it's a real state change. |
| Fence rejects an allowed surface | Path mismatch — verify the file_path is exactly `DESIGN.md` or matches `apps/storybook/src/**/*.stories.{ts,tsx}`. |
