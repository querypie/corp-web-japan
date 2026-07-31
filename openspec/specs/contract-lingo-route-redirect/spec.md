# contract-lingo-route-redirect

## Purpose

This spec defines the durable routing contract for the retired local Lingo
website subtree in `corp-web-japan`.

Lingo is served from its own Japanese website. The QueryPie Japan website no
longer renders or maintains local Lingo pages under `/lingo`.

## Current implementation references

- `next.config.ts`
- `tests/lingo-route-redirect.test.mjs`

## Requirements

### Requirement: route-family redirect

The website SHALL redirect both the exact `/lingo` path and every descendant
path under `/lingo/**` to exactly `https://lingo.querypie.ai/ja`. The redirect
SHALL NOT append the requested descendant path to the destination.

#### Scenario: Lingo root is requested

- GIVEN a visitor requests `/lingo`
- WHEN the routing configuration handles the request
- THEN the visitor is redirected to `https://lingo.querypie.ai/ja`

#### Scenario: known former Lingo page is requested

- GIVEN a visitor requests `/lingo/features/transcription`
- WHEN the routing configuration handles the request
- THEN the visitor is redirected to `https://lingo.querypie.ai/ja`
- AND `/features/transcription` is not appended to the destination

#### Scenario: arbitrary Lingo descendant is requested

- GIVEN a visitor requests any path beginning with `/lingo/`
- WHEN the routing configuration handles the request
- THEN the visitor is redirected to `https://lingo.querypie.ai/ja`

### Requirement: permanent redirect semantics

The `/lingo` route-family redirect SHALL be configured as permanent so clients
and search engines treat the external Japanese Lingo website as the durable
destination.

#### Scenario: redirect configuration is evaluated

- GIVEN the Next.js redirect configuration is loaded
- WHEN the `/lingo/:path*` rule is inspected
- THEN its `permanent` property is `true`

### Requirement: local Lingo implementation removal

The repository SHALL NOT retain local Lingo pages or route handlers under
`src/app/lingo/**`. Components, libraries, scoped styles, static assets, and
direct dependencies used only by the retired local Lingo pages SHALL also be
removed.

#### Scenario: repository sources are inspected

- GIVEN the local Lingo pages have been retired
- WHEN the repository is checked for the former Lingo implementation roots
- THEN `src/app/lingo`, `src/components/layout/lingo`,
  `src/components/sections/lingo`, `src/components/lingo`, `src/lib/lingo`, and
  `public/lingo` do not exist
- AND `src/app/globals.css` does not retain `.lingo-scope` styles
