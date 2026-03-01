# Theologia
<img width="936" height="594" alt="Screenshot 2026-03-01 at 5 18 19 PM" src="https://github.com/user-attachments/assets/30fd83e2-4524-4436-8ffd-e2fb96e4cc0d" />

A theological dictionary web app built for Redeemer University students. includes all 499 terms from the *Pocket Dictionary of Theological Terms* by Grenz, Guretzki & Nordling.

## Features

- 🔍 **Fuzzy search** — Find terms quickly with intelligent matching
- 📚 **498 theological terms** — Complete A–Z coverage
- ✏️ **Add your own** — Create custom terms from lectures and readings
- 📖 **Flashcards** — Study saved terms with flip cards
- 🔗 **Cross-referenced** — Click linked terms in definitions
- 🎲 **Random term** — Discover new concepts
- 🌓 **Dark mode** — Clean, readable interface
- 📱 **Responsive** — Works on mobile and desktop

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project structure

```
src/
├── app/
│   ├── add/               # Add custom terms
│   ├── saved/             # Saved study list
│   ├── flashcards/        # Flashcard study mode
│   ├── terms/
│   │   ├── page.tsx       # A–Z index
│   │   └── [id]/page.tsx  # Individual term
│   └── random/route.ts     # Random term redirect
├── components/
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   ├── TermCard.tsx
│   └── ...
└── lib/
    ├── terms.ts
    └── customTerms.ts      # Custom term storage (localStorage)
```

## Data

All dictionary terms are in `data/terms.json`. Custom terms are stored in the browser (localStorage).

## License

Content: *Pocket Dictionary of Theological Terms* © Grenz, Guretzki & Nordling  
Code: MIT

