# Blog rendering preview restore

This branch exists only to restore the pre-removal local blog rendering state for visual comparison in Preview Deployment.

Base historical commit: `f7afba3` (`refactor: split event resource data (#59)`)

Why this branch exists:
- restore the last main-line state before `fix: keep blog index and remove local blog detail content (#56)`
- compare the older local blog post rendering against the current implementation
- trigger a Vercel Preview Deployment with a minimal docs-only branch-local change

This document is intentionally small and does not change the restored historical application behavior.
