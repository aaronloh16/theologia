# Theologia — Next.js Web App Plan

A theological dictionary web app built with Next.js and deployed on Vercel.
~498 terms from the *Pocket Dictionary of Theological Terms* (Grenz, Guretzki, Nordling).

---

## Data

We already have `data/terms.json` with all A–Z terms. Each term has:

```
id, term, shortDefinition, fullDefinition, example, nonExample, seeAlso, contrastsWith, tags
```

### Data cleanup needed

- **Zwingli is merged into "wrath of God"** — the last entry's `fullDefinition` contains Zwingli's definition. Split into two separate entries.
- **Strip `*` markup from `fullDefinition`** — asterisks like `*salvation` are source cross-reference markers. Convert them to plain text or use them to generate clickable links at render time.
- **`seeAlso` links should resolve to real term IDs** — currently they hold display names like `"salvation"`. Map these to the actual `id` slugs so they can link to `/terms/[id]`.
- **Empty fields** — `nonExample`, `contrastsWith`, `tags` are empty for most terms. Leave them in the schema for future enrichment.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |
| Data | Static JSON (`data/terms.json`), imported at build time |
| Search | Client-side fuzzy search (fuse.js) |

No database. The JSON is small (~6k lines) and loads fast as a static import.

---

## Pages & routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — search bar, alphabet nav, brief intro |
| `/terms` | Full index — all terms grouped by letter with anchor links |
| `/terms/[id]` | Individual term page — full definition, seeAlso links, share |
| `/random` | Redirect to a random term (fun entry point) |

All pages are statically generated at build time (`generateStaticParams`).

---

## Features (MVP)

### 1. Search
- Prominent search bar on every page (sticky header)
- Fuzzy matching on `term` and `shortDefinition` via fuse.js
- Results appear in a dropdown as you type — click to navigate
- Keyboard accessible (arrow keys, enter, escape)

### 2. Alphabet navigation
- Horizontal letter bar (A–Z) on the index page
- Click a letter to scroll/filter to that section
- Highlight the current letter as you scroll

### 3. Term page
- `term` as the heading
- `shortDefinition` in a callout/highlight box
- `fullDefinition` as the main body, with `*term` references rendered as clickable links to other term pages
- `seeAlso` rendered as pill links at the bottom
- "Random term" button
- Share / copy link button

### 4. Responsive design
- Mobile-first layout
- Clean, readable typography (serif for definitions, sans-serif for UI)
- Light/dark mode via Tailwind + system preference

---

## Design direction

- **Minimal and bookish** — feels like a well-typeset reference book
- Warm off-white background, dark text, subtle accent color (muted gold or deep blue)
- Large, readable type for definitions
- Generous whitespace
- Subtle letter dividers on the index page
- No clutter — the content is the interface

---

## Project structure

```
theologia/
├── data/
│   └── terms.json              # source data (kept as-is)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # root layout, fonts, metadata
│   │   ├── page.tsx            # landing page with search + alphabet
│   │   ├── terms/
│   │   │   ├── page.tsx        # full A–Z index
│   │   │   └── [id]/
│   │   │       └── page.tsx    # individual term
│   │   └── random/
│   │       └── route.ts        # redirect to random term
│   ├── components/
│   │   ├── SearchBar.tsx       # fuzzy search with dropdown
│   │   ├── AlphabetNav.tsx     # horizontal A–Z bar
│   │   ├── TermCard.tsx        # compact term preview (search results, index)
│   │   ├── TermDetail.tsx      # full term view with linked references
│   │   ├── Header.tsx          # sticky header with search
│   │   └── ThemeToggle.tsx     # light/dark switch
│   └── lib/
│       ├── terms.ts            # load + index terms from JSON
│       └── utils.ts            # slugify, linkify asterisk refs, etc.
├── public/
│   └── og-image.png            # Open Graph image for social sharing
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── plan.md
```

---

## Build steps

1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir`
2. Move `data/terms.json` into place (already there)
3. Install fuse.js: `npm install fuse.js`
4. Build `src/lib/terms.ts` — load JSON, create lookup maps, expose helpers
5. Build pages in order: layout → landing → index → term detail → random
6. Build components: Header → SearchBar → AlphabetNav → TermCard → TermDetail
7. Add dark mode toggle
8. Add OG metadata for social sharing
9. Deploy to Vercel

---

## Future ideas (post-MVP)

- **Daily term** — highlight a term of the day on the landing page
- **Flashcard mode** — show term, reveal definition (study tool)
- **Tags / categories** — group terms by doctrine area (Christology, Soteriology, etc.)
- **Scripture index** — link terms to Bible references mentioned in definitions
- **Bookmarks** — save terms to a personal list (localStorage)
- **Print stylesheet** — clean printable version of the full dictionary
