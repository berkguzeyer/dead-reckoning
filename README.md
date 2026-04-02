# Dead Reckoning

An archaeological portfolio site. GitHub repositories excavated, catalogued, and presented as ancient artifacts recovered from the field.

Built with React, TypeScript, and Vite.

## What it does

Fetches your pinned GitHub repositories and renders them as specimen catalog entries — complete with excavation dates, material composition, condition ratings, recovery depth, and lab analysis reports. Artifact descriptions are generated via Claude API if a key is configured, or derived locally from README content if not.

## Setup

```bash
npm install
npm run dev
```

Create a `.env` file from `.env.example` and fill in your tokens:

```env
VITE_GITHUB_TOKEN=        # GitHub personal access token (enables pinned repos via GraphQL)
VITE_ANTHROPIC_API_KEY=   # Optional — enables AI-generated catalog entries
VITE_CLAUDE_PROXY_URL=    # Optional — proxy URL if you don't want direct browser API access
```

Both tokens are optional. Without a GitHub token, the site falls back to seed artifact data. Without an Anthropic key, catalog entries are generated locally from README content.

## Stack

- React + TypeScript
- Vite
- GSAP for animations
- GitHub REST + GraphQL APIs
- Claude API (optional)
