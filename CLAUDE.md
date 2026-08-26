# CLAUDE.md — Quotekit

## Project Overview
SaaS quoting/proposals tool for small businesses.

## Architecture — Backend Configuration
Uses a clean environment-variable pattern (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`), not a hardcoded project ID. `isSupabaseConfigured` gracefully detects and warns when these are absent rather than crashing. This is good practice — preserve it; don't replace with a hardcoded project ID.

Whether a real project is actually configured in the live deployment environment is not verifiable from the repo alone — check the actual deployment platform's environment variables before assuming either way.

## Technology Stack
React, Vite, TypeScript, Supabase (env-var configured).

## CI
Build-only (`npm ci && npm run build`).

## AI Agent Rules
- Keep the graceful-degradation pattern for missing Supabase config — don't hardcode a project ID.
- Verify live environment configuration before assuming backend features work or don't.

## Definition of Done
Build passes. Backend configuration remains environment-variable-based.
