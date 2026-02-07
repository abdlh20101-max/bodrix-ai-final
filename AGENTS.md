# AGENTS.md - Bodrix AI Development Guide

## Project Overview

Bodrix AI is an advanced AI chatbot platform built with React (client) + Express/tRPC (server) + MySQL (database).

## Build Commands

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Production build
pnpm build
pnpm start

# Type check
pnpm check

# Run tests
pnpm test

# Database migration
pnpm db:push
```

## Project Structure

```
bodrix-ai-final/
├── client/src/              # React frontend
│   ├── pages/              # Page components
│   ├── components/         # Reusable UI components
│   ├── _core/hooks/        # Core hooks (useAuth, useLanguage)
│   └── lib/                # Utilities (trpc, i18n)
├── server/                 # Express backend
│   ├── _core/              # Core server files
│   │   ├── trpc.ts        # tRPC configuration (procedures)
│   │   ├── oauth.ts       # OAuth authentication
│   │   └── context.ts     # Request context
│   ├── routers/           # API routers
│   └── db.ts              # Database operations
├── drizzle/               # Database schema
└── shared/                # Shared types and constants
```

## Key Patterns

### Authentication
- Uses OAuth with session cookies
- `useAuth()` hook provides `user`, `isAuthenticated`, `loading`
- `protectedProcedure` for authenticated routes
- `adminProcedure` for admin-only routes

### Admin Access Control
- Admin routes use `AdminRoute` component (client/src/App.tsx)
- Server uses `adminProcedure` middleware
- User role stored in `users.role` column

### Security Notes
- Dangerous commands are blocked in `unlimitedAccess.ts`
- Super admin agent has security blocklist in `superAdminAgent.ts`
- Admin dashboard hidden from non-admin users

## Important Files

| File | Purpose |
|------|---------|
| `client/src/App.tsx` | Main routing, ProtectedRoute & AdminRoute guards |
| `server/_core/trpc.ts` | tRPC middleware definitions |
| `server/db.ts` | Database operations |
| `drizzle/schema.ts` | Database schema |

## User Roles

- `user` - Regular users (default)
- `admin` - Full admin access
- `developer` - Developer features
- `premium` - Premium subscription
- `pro` - Pro subscription

## Environment Variables

Required for deployment:
- `DATABASE_URL` - MySQL connection string
- `VITE_OAUTH_PORTAL_URL` - OAuth portal URL
- `VITE_APP_ID` - Application ID
- `OWNER_OPEN_ID` - Admin user OpenID

## Common Tasks

### Add a new page
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Use `ProtectedRoute` or `AdminRoute` wrapper

### Add admin-only feature
1. Use `adminProcedure` in server router
2. Check `user?.role === "admin"` in frontend
3. Use `AdminRoute` for page-level protection

### Modify database
1. Update `drizzle/schema.ts`
2. Run `pnpm db:push`

## Testing

```bash
pnpm test              # Run all tests
pnpm test --watch      # Watch mode
```

Test files are in `server/*.test.ts`
