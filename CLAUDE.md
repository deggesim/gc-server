# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (with hot reload)
npm run start:dev     # uses config/dev.env
npm run start:prod    # uses config/prod.env

# Build
npm run build         # tsc → dist/

# Lint
npm run lint          # tslint over src/**/*.ts
```

No test suite exists in this project.

## Architecture

**gc-server** is a Koa 2 REST API ("Gestione Casa" — household expense tracker) backed by PostgreSQL via TypeORM. It runs on port 5000 by default.

### Dependency Injection

The project uses `typescript-ioc` with `@Singleton` and `@Inject` decorators throughout. Every class (controller, service, repository, route group) is resolved from the IoC container. `GestioneCasa` is the application root, bootstrapped via `Container.get(GestioneCasa)` in `index.ts`.

### Request flow

```
index.ts → GestioneCasa.start()
  → PostgresDataSource.initialize()
  → Koa app setup
    → freeRouter: POST /utente/login, POST /utente  (no JWT)
    → koa-jwt middleware (validates Bearer token using PUBLIC_KEY env var)
    → JWT middleware: hydrates ctx.state.utente and ctx.state.token
    → router: all other routes (JWT required)
```

### Layer structure

- `routes/` — extend abstract `Routes`, implement `getRoutes()` returning `Route[]`, register with `router.register(router)`
- `controllers/` — `@Singleton` classes injected into routes, delegate to services, set `ctx.body` and `ctx.status`
- `services/` — `@Singleton` classes with business logic, delegate to repositories
- `repositories/` — extend abstract `Repository` (which exposes TypeORM repository accessors for all entities); contain all SQL/query logic
- `models/` — TypeORM `@Entity` classes for DB mapping; plain type/interface files for non-entity shapes
- `exceptions/` — `BadRequestEntity` (400) and `EntityNotFoundError` (404) thrown from services/repositories

### Domain entities

| Entity | Description |
|--------|-------------|
| `Andamento` | Individual expense entry (date, description, cost, type) |
| `TipoSpesa` | Expense category (foreign key on Andamento) |
| `Utente` | User account with bcrypt password |
| `Token` | JWT refresh/revocation tokens |

`StatisticheService` aggregates `Andamento` data by `Interval` (date range), grouping by expense category IDs (hardcoded: 1=spesa, 2=carburante, 3=bolletta, 7=casa).

### Configuration

- DB connection from `DATABASE_URL` env var (parsed with `pg-connection-string`), schema: `gc`
- JWT secret from `PUBLIC_KEY` env var
- Environment files live in `config/dev.env` and `config/prod.env`
- SSL is always enabled for PostgreSQL connections

### TypeScript notes

`experimentalDecorators` and `emitDecoratorMetadata` are required for `typescript-ioc` and TypeORM decorators. The codebase uses the `class` keyword extensively (predates the global no-class rule) — follow existing patterns when adding to this project.
