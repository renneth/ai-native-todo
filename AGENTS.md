<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project contract

This repo is a sandbox for an AI-native development workflow. The todo app is intentionally small so git, PRs, GitHub Actions, and Vercel stay the focus.

## Git and PRs

- Never push commits to `main`. Create a feature branch (`feat/...`, `fix/...`) and open a pull request.
- Fill in `.github/pull_request_template.md`.
- Before opening a PR, run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- GitHub Actions (`.github/workflows/ci.yml`) is the merge gate. Do not add a Vercel deploy job. Vercel Git integration deploys preview URLs on PRs and production on `main`.

## App constraints

- Next.js App Router only. Add `'use client'` only on interactive components.
- Todos persist in `localStorage` only. Do not add a database, auth, or secrets unless the user explicitly asks.
- Keep domain logic in `lib/todos.ts` so it stays unit-testable.

## Verification

- After Vercel is connected, verify UI changes on the PR preview URL, not only locally.
