# CLAUDE.md

Guidance for working in this repo.

## Content lives in `src/App.js`

There's no CMS or data layer — `PROJECTS`, `EXPERIENCE`, and `NOTES` are plain
arrays at the top of `src/App.js`. Editing the site means editing that file
directly.

## Keep search tags current

The search bar on the work tab filters `PROJECTS` (by title/desc/stack/org)
and `EXPERIENCE` (by org/role/desc/`tags`). Whenever you add or edit an
`EXPERIENCE` entry:

- Give it a `tags` array if it doesn't have one — untagged entries only match
  on the literal text in `desc`/`org`/`role`, which misses most searches.
- Mix **general** category labels with **specific** ones. If a specific tag
  is present, its general parent should be too — e.g. `"fastapi"` pairs with
  `"backend"`, `"pytorch"` pairs with `"ai"`/`"ml"`, `"react"` pairs with
  `"frontend"`/`"full stack"`.
- Include both the acronym and the spelled-out form where either is a
  plausible search term — e.g. `"ai"` and `"artificial intelligence"`,
  `"ci/cd"` and `"continuous integration"`, `"gcp"` and `"google cloud"`.

## Update the footer date

`pf-footer-txt` at the bottom of the page ("last updated ...") should reflect
the month/year of the most recent real content change — not just any commit.
Bump it whenever you edit `PROJECTS`, `EXPERIENCE`, `NOTES`, or the resume.

## Resume

`public/resume.pdf` is the single source of truth — it's the only copy CRA
copies into the build output and the only thing the download link
(`/portfolio/resume.pdf`) actually serves. Don't create a duplicate at the
repo root or anywhere else; a second copy will silently drift out of sync
with what's deployed.

## Deploying

```bash
git add -A && git commit -m "..." && git push origin main
npm run deploy   # builds, then publishes build/ to the gh-pages branch
```

Both steps are needed — pushing to `main` alone does not update the live
site; `npm run deploy` is what actually publishes to GitHub Pages.
