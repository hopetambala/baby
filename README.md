# Baby Website

Hope & Carly's baby announcement website. Built with [Gatsby](https://www.gatsbyjs.com/) and React.

## Stack

- **Gatsby 5** — static site generator
- **React 18** — UI
- **Framer Motion** — floating ambient animations
- **CSS Modules** — component-scoped styles
- **Recoleta** — custom serif font

## Getting started

```bash
nvm use
npm install
npm run develop   # http://localhost:8000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run develop` | Start dev server at `localhost:8000` |
| `npm run build` | Production build to `/public` |
| `npm run serve` | Preview production build locally |
| `npm run clean` | Clear Gatsby cache |
| `npm run optimize-images` | Regenerate photo derivatives into `static/` |
| `npm run prettier` | Format all files |

## Photos

No Gatsby image plugin is installed, so nothing resizes the camera originals
automatically. `npm run optimize-images` does it instead — see
`src/scripts/optimize.js` — writing WebP (and one JPEG social card) into
`static/`. The derivatives are committed, because Vercel builds from git and
never runs the script.

Re-run it after adding or removing any photo.

### Swapping the hero photo

1. Replace `src/assets/photos/landing-engagement.jpeg` with your photo, keeping
   the filename — or add a new one and update the `STANDALONE` entries in
   `src/scripts/optimize.js` to point at it.
2. Run `npm run optimize-images`.
3. If you changed the filename, update the two places that reference the
   derivative: the `.landing` background in `src/pages/index.module.css` and
   `HERO_IMAGE` in `src/pages/index.js`.

The hero doubles as the social preview card, so step 2 also recrops
`static/og-image.jpg` to the 1200x630 that link previews expect.

## Poppylist registry

Registry link: `https://poppylist.com/registry/hopeandcarly`

Referenced in two places if you ever need to update it:
- `src/pages/index.js` — hero CTA and registry section button
- `src/components/navigation/menu/menu.js` — nav link

## Deployment

Deployed via [Vercel](https://vercel.com). Push to `main` to trigger a deploy.
Settings live in `vercel.json`.

Build command: `npm run clean && npm run build`  
Output directory: `public`

The `clean` is load-bearing. Vercel restores Gatsby's `public/` from its build
cache between builds, and `gatsby build` only ever adds to that directory — it
never removes files it no longer owns. Without the clean, anything deleted from
`static/` keeps getting served in production indefinitely. That is exactly what
happened to the old hand-written `static/sitemap.xml`, which outlived its own
deletion by a full deploy.

### Sitemap

Generated at build time by `gatsby-plugin-sitemap` at `/sitemap-index.xml`
(the plugin's `output` is a folder, so the index filename can't be changed).
`static/robots.txt` points crawlers at it, and `vercel.json` keeps the older
`/sitemap.xml` URL alive as a 301.
