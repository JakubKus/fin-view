# FinView

A personal portfolio tracker.

## Architecture Objectives

- **VSA (Vertical Slice Architecture)** - code is organized by feature/use-case rather than by technical layer. Each slice owns its route, validation, and data access end-to-end.
- **EDA (Event-Driven Architecture)** - state changes are modeled as events. Slices react to events instead of calling into each other directly.
- **SSR (Server-Side Rendering)** - HTML is rendered on the server, no SPA framework or client-side build step.\
Small progressive-enhancement libraries (HTMX, Alpine) may be added later for interactivity.
- **CQRS (Command Query Responsibility Segregation)** - the read operations (queries) is separated from the write operations (commands).
- **TDD (Test-Driven Development)** - Testability and also type-safety is a high priority here.
