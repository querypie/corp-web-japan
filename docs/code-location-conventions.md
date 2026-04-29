# Code Location Conventions

This document records the current agreed code-location conventions for the contact-us rollout and related implementation work.

## Current contact-us rollout locations

- Feature-flag page: `/t/contact-us`
- Submit endpoint: `/contact-us/submit`

## Route and implementation rules

- Keep App Router route files thin.
- Route files should primarily compose page content, call shared helpers, and define route-local metadata or HTTP handling.
- Backend and integration implementation should live in reusable shared code locations instead of growing route-local logic.

## Preferred shared code locations

- Reusable non-UI logic should primarily live under `src/lib/**`.
- Reusable UX primitive components should primarily live under `src/components/ui/**`.
- Page- or domain-specific composed UI should primarily live under `src/components/sections/**`.

## Practical guidance

- When adding contact-us rollout behavior, keep route handlers and page files focused on request/response wiring and composition.
- Move shared submit handling, validation helpers, API integration code, and similar non-UI logic into `src/lib/**`.
- Keep reusable presentational primitives in `src/components/ui/**`, and assemble page-specific sections from those primitives in `src/components/sections/**`.
