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
| `npm run prettier` | Format all files |

## Swapping the hero photo

Replace the placeholder with your own maternity or family photo:

1. Add your photo to `src/assets/photos/` (e.g. `hero-baby.jpg`)
2. Update line 3 of `src/pages/index.module.css`:
   ```css
   background: url("../assets/photos/hero-baby.jpg") no-repeat center center fixed;
   ```

## Poppylist registry

Registry link: `https://poppylist.com/registry/41126`

Referenced in two places if you ever need to update it:
- `src/pages/index.js` — hero CTA and registry section button
- `src/components/navigation/menu/menu.js` — nav link

## Deployment

Deployed via [Vercel](https://vercel.com). Push to `master` to trigger a deploy.

Build command: `gatsby build`  
Output directory: `public`
