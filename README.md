# AI Native Todo

A small Next.js todo list used to practice an **AI-native** software workflow: agent implements on a branch, GitHub Actions gates the merge, Vercel deploys the preview and production.

The app is the sandbox. Persistence is **localStorage** in this browser only — no database, no auth.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts (the same ones CI runs):

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Pipeline (commit → production)

```
spec → feature branch → pull request → GitHub Actions CI
                                    → Vercel preview URL
                         you review both → merge to main → Vercel production
```

| Step | Who does it | What you should see |
|---|---|---|
| Implement | You or the Cursor agent | Commits on `feat/...` or `fix/...`, never on `main` |
| PR | Human or agent via `gh pr create` | Description filled from `.github/pull_request_template.md` |
| CI | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | lint, typecheck, unit tests, `next build` |
| Preview | Vercel Git integration | Unique URL commented on the PR |
| Production | Vercel Git integration | New production deploy when `main` updates |

GitHub Actions does **not** deploy. That avoids two deploys per push. After you import this repo in Vercel, leave preview deployments on and keep Production Branch = `main`.

### Connect Vercel (one-time)

1. Open [vercel.com/new](https://vercel.com/new) and import `renneth/ai-native-todo`.
2. Framework: Next.js. Root directory: `/`. No environment variables.
3. Deploy. Confirm production branch is `main`.
4. In GitHub: **Settings → Branches → Add rule** for `main`. Require a pull request and require the `ci` status check.

Do not add a `VERCEL_TOKEN` GitHub secret. Actions has no deploy job.

### First follow-up after Vercel is linked

Open a tiny PR (copy change, empty-state tweak) so you can watch: Actions go green → Vercel preview comment → merge → production. That is the loop this repo exists to teach.

## Traditional vs vibe coding vs AI-native

**Traditional:** you write the code; CI/CD is a safety net after humans already decided the design. Conventions live in your head or a wiki.

**Vibe coding:** you prompt until the UI looks right. Fast, often on `main`, little durable contract. The next session (or the next model) does not inherit how this repo is supposed to work.

**AI-native (this repo):** the agent is the default implementer. You own the spec, review, and merge. That only works if the *system* encodes the workflow:

- [`AGENTS.md`](AGENTS.md) and [`.cursor/rules/`](.cursor/rules/) are the contract every future agent reads.
- The PR description is the spec for the change.
- CI is mechanical. Red means do not merge, including when an agent wrote the code.
- The Vercel preview URL is the review surface — verify behavior there, not only locally.

You still decide what ships. AI-native is not autonomous production. It is a pipeline designed so an agent can participate at every stage without tribal knowledge.
