# QuoteKit

**A quote-and-proposal builder for small service businesses — quick proposals, a client portal, lead forms, scheduling, and automations in one dashboard.**

![Status](https://img.shields.io/badge/status-active_development-yellow)
![License](https://img.shields.io/badge/license-proprietary-red)
![Stack](https://img.shields.io/badge/stack-React_%2F_Vite-blue)

## What this is

QuoteKit is a web app for small businesses to build and send quotes/proposals quickly, track clients and projects, and run light CRM workflows. Current screens include a dashboard, a proposal builder, a "QuickPropose" fast-quote flow, client and project management, lead capture forms, a scheduler, an inbox, a content library, automations, analytics, and a client-facing portal.

[ADD SCREENSHOT HERE]

## Status: In active development

The frontend is substantially built out across most core flows, but there's no backend wired up yet — data is currently local/mocked. Not ready for real customer use.

### Roadmap
- Wire up a real backend/data layer
- Auth hardening (an `AuthGuard`/`LoginPage` shell currently exists but is unverified)
- Clarify and remove any leftover cross-project references in the codebase

## Quickstart

```bash
npm i
npm run dev
```

## Folder overview

- `src/app/components/pages/` — main app screens (Dashboard, Builder, Clients, Projects, Scheduler, etc.)
- `src/app/components/auth/` — login/auth guard
- `src/i18n/` — localization

## Contributing

See the [org-wide CONTRIBUTING.md](https://github.com/creova-gif/.github/blob/main/CONTRIBUTING.md) for guidelines, including our AI-assisted contribution policy.

## License

Proprietary — © CREOVA. All rights reserved.
