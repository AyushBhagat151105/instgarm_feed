# instgarm_feed

This file provides context about the project for AI assistants.

## Project Overview

- **Ecosystem**: Typescript

## Tech Stack

- **Runtime**: bun
- **Package Manager**: bun

### Frontend

- Framework: tanstack-router, native-bare
- CSS: tailwind
- UI Library: shadcn-ui
- State: zustand

### Backend

- Framework: express
- Validation: zod

### Database

- Database: postgres
- ORM: prisma

### Additional Features

- Testing: vitest
- Logging: pino

## Project Structure

```
instgarm_feed/
├── apps/
│   ├── web/         # Frontend application
│   ├── native/      # Mobile application (React Native)
│   └── server/      # Backend API
├── packages/
│   └── db/          # Database schema
```

## Common Commands

- `bun install` - Install dependencies
- `bun dev` - Start development server
- `bun build` - Build for production
- `bun test` - Run tests
- `bun db:push` - Push database schema
- `bun db:studio` - Open database UI

## Better Fullstack project context

`bts.jsonc` is the authority for the current Stack Graph. Its `stackParts` array owns role selection and `ownerPartId` bindings. Top-level option fields are a compatibility projection and must not become a second mutation path.

### Stack Parts, ownership, and evidence

- `aiTooling:universal:mcp`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `aiTooling:universal:skills`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `backend.backendUtilities:typescript:backend-utils`. It belongs to `backend:typescript:express`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `backend.deploy:typescript:docker`. It belongs to `backend:typescript:express`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `backend.logging:typescript:pino`. It belongs to `backend:typescript:express`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `backend.orm:typescript:prisma`. It belongs to `backend:typescript:express`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `backend.runtime:typescript:bun`. It belongs to `backend:typescript:express`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `backend.testing:typescript:vitest`. It belongs to `backend:typescript:express`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `backend.validation:typescript:zod`. It belongs to `backend:typescript:express`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `backend:typescript:express`. Its generated target is `apps/server`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `containerOrchestration:universal:docker-compose`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `continuousIntegration:universal:github-actions`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `database.dbSetup:universal:docker`. It belongs to `database:universal:postgres`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `database:universal:postgres`. Its generated target is `packages/db`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `frontend.css:typescript:tailwind`. It belongs to `frontend:typescript:tanstack-router`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `frontend.dataFetching:typescript:tanstack-query`. It belongs to `frontend:typescript:tanstack-router`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `frontend.deploy:typescript:docker`. It belongs to `frontend:typescript:tanstack-router`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `frontend.forms:typescript:react-hook-form`. It belongs to `frontend:typescript:tanstack-router`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `frontend.httpClient:typescript:axios`. It belongs to `frontend:typescript:tanstack-router`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `frontend.stateManagement:typescript:zustand`. It belongs to `frontend:typescript:tanstack-router`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `frontend.ui:typescript:shadcn-ui`. It belongs to `frontend:typescript:tanstack-router`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `frontend:typescript:tanstack-router`. Its generated target is `apps/web`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `mobile.deepLinking:react-native:expo-linking`. It belongs to `mobile:react-native:native-bare`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `mobile.navigation:react-native:expo-router`. It belongs to `mobile:react-native:native-bare`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.
- `mobile:react-native:native-bare`. Its generated target is `apps/native`. Evidence is `listed` with `unverified` freshness. Verification maintainer: @Marve10s.

### Installed-version authority

Use `bts.jsonc` for the generator and schema version. Use local package manifests and lockfiles for installed dependency versions. Do not assume that documentation for a newer Better Fullstack release matches this project.

### Compatibility and lifecycle safety

Run `create-better-fullstack context --json` for bounded roles, capabilities, evidence, compatibility issues, and safe next actions. Run `create-better-fullstack doctor --json` before repairing graph drift. Existing-project writes must start with a plan and use the exact review token. Use `create-better-fullstack recipes check --json` before editing recipe-owned paths or managed regions, and use recipe history plus project recovery commands to undo a reviewed operation.

User code outside an explicit Better Fullstack managed region is not generator-owned. Missing or changed managed-region hashes stop recipe planning for manual review.

<!-- <better-fullstack:recipes sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855> -->

<!-- </better-fullstack:recipes> -->

## Maintenance

Keep CLAUDE.md updated when:

- Adding/removing dependencies
- Changing project structure
- Adding new features or services
- Modifying build/dev workflows

AI assistants should suggest updates to this file when they notice relevant changes.
