# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-08-03
- Primary product surfaces: Japan-facing QueryPie AI marketing site, especially the top page and solution entry points.
- Evidence reviewed: `README.md`, `AGENTS.md`, `src/app/page.tsx`, `src/components/sections/home/hero-section.tsx`, `src/app/globals.css`, and `src/components/layout/floating-conversion-cta.tsx`.

## Brand

- Personality: Calm, credible, enterprise-focused, and action-oriented.
- Trust signals: Security certifications, role-based access control, auditability, and specialist support.
- Avoid: Consumer-style hype, absolute AI-quality claims, or visual noise that weakens credibility.

## Product goals

- Goals: Help Japanese enterprise decision makers identify the right AI-adoption path and start a sales conversation with confidence.
- Non-goals: Replacing detailed solution pages or forcing a premature product choice.
- Success signals: Visitors understand the two solution paths, choose a clear next action, and reach the correctly prefilled contact flow.

## Personas and jobs

- Primary personas: Enterprise decision makers, business owners, product leaders, and IT/security stakeholders.
- User jobs: Evaluate a safe AI-adoption path; compare internal-efficiency and embedded-AI outcomes; request a consultation or demo.
- Key contexts of use: Desktop research and mobile review before an internal discussion or vendor contact.

## Information architecture

- Primary navigation: Services, apps, solutions, demos, resources, and company information.
- Core routes/screens: `/`, `/solutions/ai-crew`, `/solutions/ai-dashi`, and `/contact-us`.
- Content hierarchy: Hero conversion first; immediately after it, the AX message explains the business purpose, followed by the two solution choices; delivery roadmap and platform requirements follow.

## Design principles

- Make the first action explicit: use one primary conversion action and one secondary research action.
- Preserve decision context: keep the AX message intact, then present the two solution paths in parallel immediately after the hero.
- Earn trust with concrete mechanisms, not absolute promises.
- Tradeoffs: Mobile trust indicators must remain concise and never obscure the core hero message.

## Visual language

- Color: White and slate enterprise base, restrained blue for AI Crew and warm orange for AI Dashi.
- Typography: QueryPie Sans with Japanese font support; large concise hero typography and readable 15–16px body copy.
- Spacing/layout rhythm: Wide desktop containers, stacked mobile layout, rounded panels and cards.
- Shape/radius/elevation: Soft 1.8–2rem cards with low-contrast borders and restrained shadows.
- Motion: Gentle reveal and hero copy transitions; all motion respects `prefers-reduced-motion`.
- Imagery/iconography: Product and enterprise-work imagery; Lucide icons used as supporting cues.

## Components

- Existing components to reuse: `TopPageSections`, `FloatingConversionCta`, `RevealOnScroll`, and existing Link/button visual patterns.
- New/changed components: No new design-system component; evolve hero proof-pill presentation, the existing CTA destination, the existing solution-choice copy, and the shared simple CTA button in place.
- Variants and states: Primary CTA is high contrast; secondary CTA supports research. Shared simple CTA buttons end with a right-arrow icon to make navigation explicit, especially when actions are grouped. Mobile proof pills may scroll horizontally without wrapping.
- Token/component ownership: Hero layout behavior stays in `HeroProofPillGroup`; page-level message and destination changes stay in `src/app/page.tsx`.

## Accessibility

- Target standard: WCAG 2.1 AA-oriented implementation.
- Keyboard/focus behavior: All links remain visible and focusable with existing focus styles.
- Contrast/readability: Keep hero text and proof-pill text against the dark image overlay readable.
- Screen-reader semantics: Proof indicators are an unordered list; CTAs use descriptive Japanese labels.
- Reduced motion and sensory considerations: Preserve the existing reduced-motion override.

## Responsive behavior

- Supported breakpoints/devices: Mobile-first through desktop Tailwind breakpoints.
- Layout adaptations: Hero CTAs stack on small screens; proof indicators stay available in a compact horizontal scroller and expand into wrapped desktop pills.
- Touch/hover differences: Do not rely on hover to convey the CTA or trust information.

## Interaction states

- Loading: Existing Next.js page behavior.
- Empty: Not applicable to static marketing content.
- Error: Standard route error handling.
- Success: Contact-flow success is owned by the destination form.
- Disabled: Do not present disabled conversion controls.
- Offline/slow network, if applicable: Hero content must remain understandable before non-critical media or motion completes.

## Content voice

- Tone: Clear, specific, respectful, and advisory.
- Terminology: Use established product names (QueryPie AI, AI Crew, AI Dashi, AIP, FDE) consistently.
- Microcopy rules: State the next action clearly; qualify AI-performance claims as risk reduction or support rather than guarantees.

## Implementation constraints

- Framework/styling system: Next.js App Router, TypeScript, React, and Tailwind CSS v4.
- Design-token constraints: Reuse existing visual classes and component patterns; add no dependency.
- Performance constraints: Avoid new hero media or blocking client work.
- Compatibility constraints: Preserve existing contact query-prefill contract in `AGENTS.md`.
- Test/screenshot expectations: Source-level content assertions plus lint, typecheck, test, build, and local browser verification for visual changes.

## Open questions

- [x] Primary consultation and demo CTAs prefill `inquiry=ai-consulting&product=aip` in the contact flow. Owner: Product marketing. Impact: contact-form relevance.
- [ ] Define analytics events for hero and final CTA clicks before measuring conversion impact. Owner: Growth. Impact: success measurement.
