# Project context

## Purpose

`corp-web-japan` is the Japan-facing QueryPie AI public website built with Next.js App Router, React, TypeScript, Tailwind CSS, and npm.

The website serves public marketing, solution, resource, publication, event, demo, glossary, manual, and company routes on `querypie.ai` and related preview/staging environments.

## Environment boundary

Production behavior is determined by the deployment target. The implementation currently treats `VERCEL_TARGET_ENV=production` as the production signal through `src/lib/is-production.ts`.

Capabilities intended only for internal review, staging, preview, or other non-production environments SHALL NOT expose public production-only user flows unless their spec explicitly allows it.

## Public route and preview route boundary

Canonical public pages should use their public routes such as `/resources`, `/whitepapers`, `/events`, `/demo/aip`, and `/platforms/acp`.

The `/t/...` namespace is reserved for preview or historical migration surfaces. Preview helpers may route users to `/t/...` only when the relevant preview capability is enabled and the target path is not already a `/t/...` path.

## Publication gating boundary

Gated publication content uses repository gating helpers and gating cookies. Non-production preview affordances may bypass or auto-unlock gated UI for reviewer verification, but production visitors must follow the normal gated flow unless they already hold the standard gating cookie.

## Reviewer tooling boundary

Reviewer/developer tooling specs may describe internal controls that help implementation review without changing the public marketing experience. Component Name Debug is such a platform capability: it may annotate existing rendered component boundaries for reviewers, but it must not change customer-facing copy, add wrapper-only layout layers, or override the repository code-location conventions.
