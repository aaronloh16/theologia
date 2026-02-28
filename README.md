# Theologia

A theological dictionary web app with 498 terms from the *Pocket Dictionary of Theological Terms* by Grenz, Guretzki & Nordling.

Built to help my brother study for his theology courses.

Built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Features

- 🔍 **Fuzzy search** — Find terms quickly with intelligent matching
- 📚 **498 theological terms** — Complete A–Z coverage
- 🔗 **Cross-referenced** — Click linked terms in definitions
- 🎲 **Random term** — Discover new concepts
- 🌓 **Dark mode** — Clean, readable interface in light or dark
- 📱 **Responsive** — Works beautifully on mobile and desktop
- ⚡ **Fast** — Static generation, no database needed

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/theologia)

Or via CLI:

```bash
vercel
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Landing page
│   ├── terms/
│   │   ├── page.tsx        # A–Z index
│   │   └── [id]/page.tsx   # Individual term
│   └── random/route.ts     # Random term redirect
├── components/
│   ├── Header.tsx          # Sticky header with search
│   ├── SearchBar.tsx       # Fuzzy search dropdown
│   ├── AlphabetNav.tsx     # Letter navigation
│   ├── TermCard.tsx        # Term preview card
│   ├── LinkedDefinition.tsx # Definition with clickable refs
│   ├── ThemeToggle.tsx     # Dark mode switch
│   └── ...
└── lib/
    ├── terms.ts            # Data layer and helpers
    └── utils.ts            # Text parsing utilities
```

## Data

All terms are in `data/terms.json`. The app loads this at build time and generates 500+ static pages.

## License

Content: *Pocket Dictionary of Theological Terms* © Grenz, Guretzki & Nordling  
Code: MIT
