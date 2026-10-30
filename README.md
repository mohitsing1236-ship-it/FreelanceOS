# FreelanceOS

FreelanceOS is a React + TypeScript + Vite frontend for managing a freelance business: clients, projects, tasks, proposals, invoices, payments, expenses, time entries, calendar events and analytics.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript check
npm run build      # TypeScript check and production build
```

## Current implementation notes

- The current prototype stores account and workspace data in browser `localStorage`.
- Workspace records are separated by the locally stored user ID, but this is not server-enforced security or multi-device synchronization.
- Passwords are currently stored in browser storage and must not be used with real or reused passwords.
- Password recovery is a local prototype flow; it does not send a verified email reset link.
- The demo login is `demo@freelanceos.com` / `demo123`.

## Source layout

```text
src/
  App.tsx                       App shell, navigation and landing page
  components/AuthFlow.tsx       Login, signup, onboarding and password UI
  components/WorkspacePages.tsx Workspace pages and CRUD interactions
  data/models.ts                Workspace data types
  data/storage.ts               Browser-local prototype storage and demo data
  styles.css                    Application and responsive styles
```

## Production readiness

Before using real customer data, add a backend with server-side authentication, password hashing, verified password recovery, authorization checks on every record, and a persistent database. Do not treat browser `localStorage` account separation as a security boundary.
