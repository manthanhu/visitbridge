# Project Tech Stack

This document summarizes the full technology stack used in this repository.

## Core
- Next.js 16 (app router + server actions)
- React 19
- TypeScript

## Frontend
- Tailwind CSS 4 (via PostCSS)
- shadcn-style components (RSC + TSX)
- @base-ui/react
- Framer Motion (animations)
- Icons: Lucide React, React Icons, Simple Icons
- Helpers: clsx, tailwind-merge, tw-animate-css, class-variance-authority

## Forms & Validation
- react-hook-form
- zod
- @hookform/resolvers

## Authentication & Authorization
- better-auth (better-auth, @better-auth/infra)
- Prisma adapter: @prisma/adapter-pg
- Auth models implemented in Prisma (accounts, sessions, verification)

## Backend / Server
- Next.js server (API routes / server actions)
- Node runtime (via Next)
- Postgres client: `pg`

## Database & ORM
- Prisma ORM (`prisma` + `@prisma/client`)
- Datasource: PostgreSQL (see `prisma/schema.prisma`)

## Utilities
- date-fns
- simple-icons

## Dev & Build Tools
- ESLint (+ `eslint-config-next`)
- TypeScript
- PostCSS (Tailwind plugin)
- Prisma CLI (migrations / generate)

## Testing / CI
- No test framework or CI configuration found in repository

## Deployment
- Recommended: Vercel (Next.js-first platform) — README mentions Vercel

## Notable package versions (from package.json)
- next: ^16.2.10
- react: 19.2.4
- typescript: ^5
- tailwindcss: ^4
- prisma: ^7.8.0
- @prisma/client: ^7.8.0
- pg: ^8.22.0
- framer-motion: ^12.42.0
- react-hook-form: ^7.80.0
- zod: ^4.4.3
- better-auth: ^1.6.23

## Quick commands
Run development server:

```bash
npm run dev
```

Generate Prisma client / run migrations (example):

```bash
npx prisma generate
npx prisma migrate dev
```

---
File created: `STACK.md`
