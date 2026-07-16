# Editify — Website (Next.js)

The Editify marketing site as a Next.js 15 (App Router) project.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy (free)

**Vercel (recommended for Next.js):** push this folder to a GitHub repo, then import it at vercel.com — it auto-detects Next.js and deploys on every push. Custom domains supported.

**Netlify:** also works — import the repo, build command `npm run build`.

## Structure

- `app/layout.jsx` — root layout, fonts (Inter + Poppins via next/font), metadata
- `app/page.jsx` — the entire site as one client component (scroll timeline, timecode, reveal animations, 3D tilt, counter, demo player)
- `app/globals.css` — all styles (brand gradient: #0229b5 → #0768c2 → #ff3aaa)
- `public/` — ui.jpg (editor screenshot), victoria.jpg, marta.jpg

## Edit quick refs

- Waitlist email + prototype URL: constants at the top of `app/page.jsx`
- Pricing, team bios, copy: all inline in `app/page.jsx`
- Colors: CSS variables at the top of `app/globals.css`
