# Weize Xu — personal site

Academic homepage + blog, built with [Astro](https://astro.build) and deployed to GitHub Pages.
Minimal, typography-first, light/dark aware.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the built site locally
```

## Structure

```
src/
  pages/            index · projects · about · blog/ · tags/ · 404 · rss.xml.js
  layouts/Base.astro
  components/       Nav · Footer · Social · ProjectCard
  content/blog/     posts (Markdown, one file each)
  data/             site.ts · projects.ts · news.ts
  styles/global.css the whole theme
  utils/date.ts
public/             static assets served as-is (assets, images, examples, slides, 3d, pages)
```

## Customize

- **Identity & links** — `src/data/site.ts` (name, role, affiliation, email, github, twitter;
  fill in `scholar` / `orcid` to show those icons).
- **Photo** — replace `public/assets/img/avatar.svg` with a real photo and update `site.photo`.
- **Projects / News** — `src/data/projects.ts` and `src/data/news.ts`.
- **Bio** — the paragraphs in `src/pages/index.astro`.
- **Accent color** — `--accent` in `src/styles/global.css` (currently Stanford Cardinal).

## Writing

Add a Markdown file under `src/content/blog/`. Frontmatter:

```yaml
---
title: My post
pubDate: 2026-07-23
tags: [notes, bioinformatics]
math: true          # optional, enables KaTeX
# jump: https://…   # optional: a link-out entry with no local page
---
```

The URL is `/blog/<filename>/`. Code is highlighted with Shiki; math with KaTeX.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml` (build with Astro → GitHub Pages).
Repo **Settings → Pages → Source** must be set to **GitHub Actions**.

## History

Previously a Jekyll site on the [windows-95](https://github.com/h01000110/windows-95) theme —
that version lives in the git history.
