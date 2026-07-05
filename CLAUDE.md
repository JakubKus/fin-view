# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`fin-view` — small Express API backing a personal cash/portfolio tracker. Reads NAV (net asset value) history from a local SQLite file (`db.sqlite`, gitignored) and renders it as an HTML table.

## Architectural goals

- **Vertical Slice Architecture**: organize by feature/use-case, not by technical layer. Each slice (e.g. `portfolioPerformanceApi.ts`) owns its own route, validation, and data access end-to-end — avoid introducing shared layers (repositories, services, controllers folders) that force changes to spread across files.
- **Event-driven Architecture**: prefer modeling state changes as events over direct synchronous calls between slices. When a slice needs to react to something happening elsewhere, reach for an event/handler pattern rather than importing and calling into another slice directly.
- **CQRS**: separate the read path (queries, e.g. `portfolio-performance`) from the write path (commands) — don't mix query rendering and command/mutation logic in the same handler.
- **Minimal third-party dependencies**: keep the dependency tree as small as possible to reduce npm supply-chain risk. Prefer Node built-ins (`node:sqlite`, `Temporal`, `node:test`) over adding a library. Justify any new dependency before adding it; check if the standard library already covers the need.
- **SSR, no heavy frontend frameworks**: render HTML server-side (as `portfolioPerformanceApi.ts` already does) — no React/Vue/Angular/Next.js etc. For future interactive UI needs, HTMX and Alpine-like small libs are acceptable candidates; don't reach for a SPA framework or build step.

## Access restrictions

- **Never read, open, or edit `.env` or `db.sqlite`.** `.env` holds local secrets/config; `db.sqlite` is local user financial data. Both are gitignored — do not inspect their contents, do not print them, do not include them in commits. This is also enforced via deny rules in `.claude/settings.json`.

## Commands

- `npm run dev` — start the server with `tsx watch`, auto-reloading on change. Loads env vars from `.env` (`ENVIRONMENT_PORT`, default 4000).
- `npm test` — runs all `src/**/*.test.ts` via the built-in Node test runner (`node --test`), executed through `tsx/esm` so TS files run directly, no build step.
  - Run a single test file: `node --import tsx/esm --test src/utils.unit.test.ts`
  - There is no separate build/typecheck/lint script defined in `package.json`; use `npx tsc --noEmit` for a manual typecheck if needed.

## Runtime requirements

- ESM-only (`"type": "module"`), all local imports use explicit `.ts` extensions (`allowImportingTsExtensions` in `tsconfig.json`), and TS files are executed directly via `tsx` — no compiled output is checked in.
- Uses `node:sqlite` (`Sqlite.DatabaseSync`) directly — no ORM.
- Uses the `Temporal` global (native Node Temporal API) instead of `Date` for timestamps — see `src/server.ts` and `src/healthApi.ts`.

## Architecture

- `src/server.ts` is the entrypoint: creates the Express app, builds one shared `Router`, and mounts every API module onto it by calling each module with the router (`api(router)`). New endpoints follow this same pattern: export a function `(router: Router) => void` that registers its routes, then add it to the array in `server.ts`.
- Each API module (`healthApi.ts`, `portfolioPerformanceApi.ts`) owns its own route registration and, where relevant, its own zod schema for validating data shape (see `navSchema` in `portfolioPerformanceApi.ts`) — there is no central schema or model layer.
- `portfolioPerformanceApi.ts` queries the `nav` table (`date`, `cash`, `stock` columns) directly and server-renders an HTML `<table>` fragment (not JSON) — this endpoint is meant to be embedded/fetched as HTML, unlike `healthApi.ts` which returns JSON.
- `src/utils.ts` holds small shared helpers (e.g. `formatNumberWithDecimals`); test files sit next to the code they test using a `*.unit.test.ts` naming convention.
