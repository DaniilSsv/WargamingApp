# WotKal (Next.js) — Open-source WoT companion

This repository is an open-source Next.js (React) reimplementation inspired by popular World of Tanks companion sites.

Features included in the scaffold:

- Next.js + TypeScript
- Tailwind CSS
- Server-side API proxy routes for Wargaming API (use your application id)
- Pages: Home, Players search, Matches, Guides

Setup

1. Install dependencies:

```powershell
npm install
```

2. Create `.env.local` with your Wargaming application id:

```
WG_APP_ID=your_app_id_here
```

3. Run in dev mode:

```powershell
npm run dev
```

Notes

- This is a starter scaffold. Replace or extend the UI, add caching, rate limiting, and comply with Wargaming API terms.
