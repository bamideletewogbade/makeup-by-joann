# Beauty By Joann — Architecture

## Tech Stack

- **Framework:** Vite 8 + React 19
- **Language:** TypeScript ~6.0
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4 (with `@theme` design tokens)
- **Animations:** Framer Motion
- **State Management:** Zustand (installed, available for future use)
- **Icons:** Lucide React
- **Backend:** Express 5 (Node.js API server)
- **Fonts:** Playfair Display (headings), Inter (body) via Google Fonts

## Directory Structure

```
public/
├── images/                 # Hero slides & before/after pairs (1.png, 1A.png, 2.png, etc.)
├── favicon.svg
└── icons.svg
src/
├── components/             # Shared components
│   ├── Header.tsx          # Responsive navigation with scroll-aware styling
│   ├── Footer.tsx          # Brand info, links, contact details
│   ├── HeroSlider.tsx      # Cinematic full-screen rotating hero
│   ├── LiveLookbook.tsx    # Featured before/after portfolio grid
│   └── ProcessTimeline.tsx # Behind-the-scenes process timeline
├── pages/
│   ├── Home.tsx            # Home page (hero + lookbook + process + CTA)
│   ├── Services.tsx        # Service categories grid
│   ├── Portfolio.tsx       # Full lookbook gallery (with category filters)
│   └── Contact.tsx         # Booking & inquiries form
├── lib/
│   ├── utils.ts            # cn(), delay(), getBeforeAfterPair()
│   ├── flickr.ts           # Flickr API client (not yet implemented)
│   └── ai.ts               # AI integration helpers (not yet implemented)
├── store/                  # Zustand stores (not yet created)
│   ├── quiz-store.ts       # Style quiz state
│   └── ui-store.ts         # UI preferences
├── App.tsx                 # Root component with Routes
├── main.tsx                # Entry point with BrowserRouter
└── index.css               # Global styles & design system
server/
└── index.js                # Express server (API proxy, contact form, stubs)
```

## Data Flow

1. **Public pages** → React components fetch data → Server API endpoints (proxied via Vite)
2. **Flickr API** → Server-side proxy route (TODO) → Masonry gallery on Portfolio page
3. **Contact form** → POST `/api/contact` → Server logs (TODO: wire to email/database)
4. **AI Endpoints** → API routes (stubs) → Future components (StyleQuiz, BeautyAssistant)
5. **Zustand stores** → Client-side state (quiz answers, UI preferences — not yet implemented)

## Route Structure

| Route | Purpose | Component |
|-------|---------|-----------|
| `/` | Home page | Hero, Live Lookbook, Process Timeline, CTA |
| `/services` | Service categories | Services grid with icons |
| `/portfolio` | Full lookbook gallery | Category filters + masonry grid |
| `/contact` | Booking & inquiries | Contact form → POST `/api/contact` |
| `/quiz` | AI style quiz (TODO) | — |
| `/virtual-try-on` | Virtual try-on (TODO) | — |

## Server API Endpoints

| Endpoint | Method | Status | Purpose |
|----------|--------|--------|---------|
| `/api/health` | GET | ✅ Done | Health check |
| `/api/contact` | POST | 🟡 Logs only | Contact form submissions |
| `/api/flickr/:albumId` | GET | 🟡 Stub | Flickr photo proxy |
| `/api/ai/style-quiz` | POST | 🟡 Stub | AI style quiz |
| `/api/ai/assistant` | POST | 🟡 Stub | AI beauty assistant |

## Design Principles

1. **Image-first** — 70% visual, 30% copy
2. **Luxury studio aesthetic** — Not a salon website
3. **Truthful AI** — Never fabricate business info
4. **Performance** — Optimized images, minimal JS
5. **Animations** — Subtle, purposeful, smooth (Framer Motion)

## Development

```bash
# Run frontend + backend concurrently
npm run dev:all

# Frontend only (http://localhost:5173)
npm run dev

# Backend only (http://localhost:3001)
npm run server

# Production build
npm run build:all
```

Vite proxies `/api/*` requests to the Express server at `http://localhost:3001`.

## Next Priorities

See [BUSINESS_CONTEXT.md](./BUSINESS_CONTEXT.md) for brand guidelines and feature roadmap.


- **Images:** Populate portfolio with real images, wire Flickr API
- **Contact:** Connect form to email service (e.g., SendGrid, Resend)
- **AI Features:** Style quiz, beauty assistant
- **Stores:** Create Zustand stores for quiz & UI state
- **Routes:** `/quiz`, `/virtual-try-on`
