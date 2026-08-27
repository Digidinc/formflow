<p align="center">
  <img src="assets/logo.jpg" alt="FormFlow" width="120" height="120" />
</p>

<h1 align="center">FormFlow website</h1>

Single-page static website for the FormFlow Strapi plugin. It is Vite + React and builds to plain static files in `dist/`, so it works on GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub Pages

The included workflow deploys `dist/` from the `main` branch using GitHub Pages Actions.
The production site is served from the root of `https://formflow.digid.ca`, so the default
Vite base is `/`.

For a fork deployed under a GitHub Pages project path, override the base before building:

```bash
PAGES_BASE_PATH=/your-repo-name/ npm run build
```

The repository's GitHub Actions variable `PAGES_BASE_PATH` should be `/` for the custom domain.

## Product screenshots

Real captures of the FormFlow admin live in `public/shots/` (`builder.png`, `inbox.png`,
`integrations.png`, `forms-list.png`) and render in the "Inside the admin" gallery section. To
refresh them, replace the files in `public/shots/` (keep the names and a ~16:10 ratio) and rebuild.

## Stack

Vite + React + TypeScript, no runtime data fetching — a fully static single page. Type face stack is
Bricolage Grotesque (display) · Hanken Grotesk (UI) · JetBrains Mono (code), loaded from Google Fonts.
