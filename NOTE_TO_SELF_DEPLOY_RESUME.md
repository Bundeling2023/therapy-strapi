# Note To Self - Deploy Resume

## Context
- I paused while following the deploy runbook because multiple things failed.
- The lockfile issue appeared during/after Strapi v4 -> v5 dependency changes.
- `npm install` looked stuck locally, but it did update `package-lock.json`.
- Strapi was temporarily restored to normal state.
- Netlify currently shows the latest successful deploy as maintenance mode.
- Current state drift: Netlify is running a previous deploy, and Railway Strapi is back on the 2024 version.
- Conclusion: previous recovery was partial; front-end and CMS are now out of sync.

## Where To Continue
1. In `therapy-strapi`, commit the updated `package-lock.json` (and only intended dependency files).
2. Push the branch used for staging.
3. Re-run the deploy runbook from the staging deploy step.
4. Deploy Strapi v5 target to Railway first and confirm API/version health.
5. Trigger a new Netlify deploy for the matching staging commit (not maintenance mode commit).
6. Verify front-end and CMS are aligned on the same release target.
7. Promote to production only after staging is confirmed healthy end-to-end.

## Known Errors Seen During Fixing
- Postgres connection refused on default port:
  - `Error: connect ECONNREFUSED 127.0.0.1:5432`
- Local dev was eventually runnable with environment override and later plain `pnpm dev`.
- Some commands were interrupted (`Exit Code: 130`) while troubleshooting.

## Guardrails For Next Attempt
- If `npm install` appears stuck, wait for lockfile write completion before cancelling.
- Keep lockfiles in sync with `package.json` before deploy.
- Confirm branch targeting before deploy (`main` vs `staging`).
- If Netlify still shows maintenance deploy, manually redeploy the correct staging commit.

## Immediate Next Action
- Continue from: "commit lockfile update + Railway Strapi v5 deploy + matching Netlify staging redeploy".
