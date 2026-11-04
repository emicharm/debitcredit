# debitcredit (old iteration, cloned from GitHub emicharm/debitcredit)

Branch `preview-dec31-data`.

An earlier iteration of the money tracker, kept as a design reference for
cash-grab. Cloned from `git@github.com:emicharm/debitcredit.git`.

The branch starts at `d20f569` (2025-12-31, "feat: pages and inputs"), the last
commit where the app loads its data on startup. Later commits on `main` removed
that and switched to a simpler model, so `main` starts empty.

## Launch in the browser

Needs Node (tested with v26.10.0). No backend: the Svelte app keeps everything
in the browser's IndexedDB, so the Go code in the repo is not needed.

```sh
./preview.sh          # http://localhost:5174/  (PORT=... to change)
```

Log when started in the background: `/tmp/debitcredit-preview.log`.

## Data

- `frontend/src/lib/database/transactions.json`: 113 transactions, 2025-10-06 to
  2025-12-23, plus a few examples written into `frontend/src/lib/database/index.ts`.
- On every page load the app deletes and recreates the IndexedDB database
  `DebitCredit`, then loads that file. Edits made in the browser don't persist.

## Pages

- `/transactions`: list grouped by day (`/` redirects here)
- `/details`: one transaction
- `/create`: new-transaction form
- `/accounts`: accounts and balances

## Changes on this branch

Only preview helpers: `preview.sh`, this README, and `frontend/src/routes/+page.ts`
(the redirect). The app code is as it was on Dec 31.
