# `docs/wiki/` — GitHub Wiki staging area

The published wiki lives at <https://github.com/Bantarus/xtreme-design/wiki>. This folder is the **staging copy** — author here, push to the wiki repo when ready. Single source of truth, reviewable via normal PRs.

## Layout

```
docs/wiki/
├── Home.md       landing page (becomes the wiki root)
├── Quickstart.md fresh-clone-to-first-iteration walkthrough
├── Manual.md     comprehensive reference (scaffold + TODO markers)
├── _Sidebar.md   left-side navigation rendered on every wiki page
└── README.md     this file (does not get pushed to the wiki)
```

GitHub Wiki is a separate git repo at `https://github.com/Bantarus/xtreme-design.wiki.git`. Filenames map directly to URL slugs: `Quickstart.md` → `/wiki/Quickstart`. The wiki is flat — no subdirectories. Filenames starting with `_` (like `_Sidebar.md`, `_Footer.md`) are special metadata pages that GitHub renders on every page.

## First-time setup

1. **Enable the wiki feature**. On GitHub, go to the repo's **Settings → General → Features** and tick **Wikis**.
2. **Initialize the wiki**. The wiki repo doesn't exist until you create at least one page. Go to <https://github.com/Bantarus/xtreme-design/wiki> in your browser, click **Create the first page**, paste anything (a placeholder works — we'll overwrite), and save. GitHub now creates the `.wiki.git` repo.
3. **Clone the wiki repo** somewhere outside this main repo (so the two stay independent):
   ```bash
   cd ~/DEV
   git clone https://github.com/Bantarus/xtreme-design.wiki.git
   ```

## Push the staged pages

From the wiki clone you just made:

```bash
cd ~/DEV/xtreme-design.wiki
cp ~/DEV/design-system/docs/wiki/{Home,Quickstart,Manual,_Sidebar}.md .
git add -A
git commit -m "sync from docs/wiki/ staging"
git push
```

That's it. The wiki re-renders within a few seconds of the push.

## Updating later

The staging copy is the source of truth. Whenever you edit a page:

1. Edit the file under `docs/wiki/` in this repo. Commit and push to `main` as part of normal PR review.
2. The [`Sync GitHub Wiki`](../../.github/workflows/sync-wiki.yml) Action runs automatically when `docs/wiki/**` changes on `main`. It clones the wiki repo, copies the four published pages over, and pushes — idempotent, skips the push when nothing changed.
3. Trigger it manually for an out-of-cycle sync: **Actions → Sync GitHub Wiki → Run workflow**.

### Falling back to manual sync

If the Action is disabled, fails, or you want to dry-run a change before merging:

```bash
cp ~/DEV/design-system/docs/wiki/{Home,Quickstart,Manual,_Sidebar}.md ~/DEV/xtreme-design.wiki/
cd ~/DEV/xtreme-design.wiki && git add -A && git commit -m "sync" && git push
```

This mirrors what the Action does. Useful when iterating offline or testing wiki rendering before committing to `main`.

## Why a staging area instead of editing the wiki directly?

- **PR review** for documentation changes — same workflow as code.
- **Single clone** — contributors don't have to clone two repos and sync between them manually.
- **History travels with the code** — `git log docs/wiki/` shows doc evolution alongside the features they describe.
- **Discoverability** — a developer reading the repo locally sees the docs without leaving their editor.

The trade-off is the one extra push step. Worth it.
