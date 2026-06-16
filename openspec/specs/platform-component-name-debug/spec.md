# platform-component-name-debug

## Purpose

This spec defines the platform-level Component Name Debug capability for the QueryPie AI Japan website.

Component Name Debug is a reviewer and implementer aid for identifying React component boundaries directly on rendered pages. It is not customer-facing marketing content, and it is not tied to one public route, publication family, or demo surface.

The feature is being migrated from the equivalent `querypie/outbound-agent` OpenSpec in PR #347. This corp-web-japan spec keeps the shared platform behavior while adapting implementation guidance to this repository's Next.js App Router public-site architecture.

## Current implementation status

The first `corp-web-japan` implementation is available through the site header reviewer tools control surface. The implementation includes the build-time availability constant, shared mode/storage helpers, `data-component-name` marker helper, `Alt+Shift+N` mode-cycle shortcut, `Alt+Shift+0` off shortcut, global overlay, Clipboard copy labels, and representative header markers. Additional route-local and section markers can be added incrementally without introducing wrapper-only components.

## Intended implementation references

Future implementation should keep the main reusable contract in shared code and avoid page-specific wrappers:

- `src/lib/**` for mode definitions, storage helpers, marker helpers, and shortcut utilities.
- `src/components/ui/**` for reusable primitive controls if a generic control is needed.
- `src/components/layout/**` for a site-wide mode control surface and overlay mounting when the feature is attached to the global website shell.
- `src/components/sections/**` for marked section components that already own page UI responsibility.
- `src/app/**/page.tsx` may apply markers to existing route-local page and section boundaries, but SHALL NOT introduce wrapper components only to make labels appear.
- `tests/**` should include source-level tests for mode ordering, shortcut behavior, marker validation, overlay collection, label placement, and Clipboard copying.

## References

- `openspec/project.md`
- `openspec/specs/platform-preview-toggle/spec.md`
- `docs/code-location-conventions.md`
- `docs/static-page-route-local-authoring.md`
- `AGENTS.md`
- Source OpenSpec: `querypie/outbound-agent` PR #347, `openspec/specs/platform-component-name-debug/spec.md`

## Naming decision

The spec id SHALL be `platform-component-name-debug`.

`show-component-name` describes a possible UI label, but it does not cover marker authoring, runtime mode selection, overlay collection, shortcut handling, label placement, and Clipboard interaction.

`platform-component-name-debug` describes the reusable platform capability and keeps this contract independent from any one route, page shell, or menu placement.

## Requirements

### Requirement: build-time feature availability

Component Name Debug SHALL be treated as a reviewer/debugging capability that MAY be available in production builds. Availability SHALL NOT be controlled by runtime environment variables or mutable operations settings on the same build artifact. Whether the app includes this feature SHALL be decided by an implementation code constant at build time. The default implementation constant SHOULD enable the feature unless a Product Owner decision or launch policy explicitly chooses a disabled build. If a disabled build is required, implementers SHALL change the code constant and produce a new build artifact. Production availability of the overlay and shortcut SHALL NOT imply production availability of a visible debug menu control.

#### Scenario: default build includes Component Name Debug

- GIVEN the website is built with the default Component Name Debug build-time constant
- WHEN a user presses `Alt+Shift+N`
- THEN the shortcut can cycle Component Name Debug modes
- AND the overlay runtime can display labels for the selected mode
- BUT production UI does not render a standalone Component Name Debug menu trigger

#### Scenario: runtime environment does not change availability

- GIVEN the same build artifact runs in production, preview, staging, or development
- WHEN runtime environment variables or deployment settings differ
- THEN Component Name Debug availability does not change because of those runtime values
- AND changing availability requires a new build with a different implementation constant

### Requirement: component name debug marker authoring

Component names SHALL be read from `data-component-name` markers. Marker values SHALL use non-empty React Component Name style identifiers without whitespace. Markers SHALL be attached to existing meaningful component roots, section components, cards, panels, headers, bodies, layout surfaces, or route-local page boundaries that already own UI responsibility. Markers SHALL NOT justify adding page-local wrappers, shells, Page Canvas components, Content Container components, generic `Panel`/`PageSection` components, or other structural layers that exist only to display a component name.

For static marketing pages, route-local authoring rules remain active. `src/app/**/page.tsx` SHOULD keep the readable page composition and real copy, while extracted components under `src/components/sections/**` SHOULD own reusable UI structure and can carry markers when they are the meaningful component boundary.

#### Scenario: existing page and section boundaries provide markers

- GIVEN an implementer adds Component Name Debug markers to a marketing page
- WHEN the route-local page composition and section components are inspected
- THEN markers are applied to existing surfaces such as the route-level main wrapper, shared layout component, hero section, CTA section, publication card, sidebar, or named section component
- AND no wrapper is added only to make a debug label appear

#### Scenario: wrapper-only markers are rejected

- GIVEN a component boundary is unclear on a page
- WHEN an implementer wants to show a label for that area
- THEN the implementer revisits the existing layout owner or extracts a meaningful named component only if it improves normal source ownership
- AND the implementer does not add `FooWrapper`, `FooPageShell`, `PageContent`, or equivalent wrapper-only components for Component Name Debug

### Requirement: component name debug mode control and shortcut

The app SHALL provide at least one mode-changing path when Component Name Debug is included in the build. In `corp-web-japan`, the visible mode selector SHALL be the Show Component Name section inside the non-production Preview Toggle dropdown. It SHALL NOT be implemented as a second standalone header trigger, and production UI SHALL NOT render the Preview Toggle trigger or a visible Show Component Name menu. It SHALL NOT be specified as an Outbound Agent Help menu requirement.

When the visible selector is available, it SHALL provide exactly these modes in this order: `Off`, `Pointer`, `Pointer + Ancestors`, `Always`. The default mode SHALL be `Off`. Pressing `Alt+Shift+N` SHALL cycle modes in this order: `Off` -> `Pointer` -> `Pointer + Ancestors` -> `Always` -> `Off`. Pressing `Alt+Shift+0` SHALL set Component Name Debug to `Off` without cycling. The shortcuts SHALL remain available even when the visible selector is hidden in production. The shortcuts SHALL be ignored while the active target is an input, textarea, select, or contenteditable surface. Mode changes SHALL be stored and propagated so every mounted control and overlay reads the same current mode. Unsupported persisted mode values SHALL fall back to `Off`.

#### Scenario: non-production control surface exposes all modes

- GIVEN Component Name Debug is included in the current build
- AND the website is running outside production
- WHEN a user opens the Preview Toggle dropdown
- THEN `Off`, `Pointer`, `Pointer + Ancestors`, and `Always` are shown in that order
- AND selecting an option changes the current Component Name Debug mode
- AND the control surface may show `Shortcut: Alt+Shift+N / Alt+Shift+0 Off`

#### Scenario: production header exposes no debug menu control

- GIVEN Component Name Debug is included in the current build
- AND the website is running in production
- WHEN the site header renders
- THEN the Preview Toggle trigger is not rendered
- AND a standalone Component Name Debug trigger is not rendered
- AND a visible Show Component Name menu is not rendered

#### Scenario: Alt+Shift+N cycles modes

- GIVEN the current Component Name Debug mode is `Off`
- WHEN the user presses `Alt+Shift+N` on a normal UI surface
- THEN the mode changes to `Pointer`
- WHEN the user presses the shortcut repeatedly
- THEN the mode continues through `Pointer + Ancestors`, `Always`, and back to `Off`

#### Scenario: Alt+Shift+0 turns the feature off

- GIVEN the current Component Name Debug mode is `Always`
- WHEN the user presses `Alt+Shift+0` on a normal UI surface
- THEN the mode changes to `Off`
- AND the mode does not cycle to another Component Name Debug mode

#### Scenario: shortcut is ignored during text entry

- GIVEN focus is inside an input, textarea, select, or contenteditable surface
- WHEN the user presses `Alt+Shift+N` or `Alt+Shift+0`
- THEN Component Name Debug mode does not change
- AND the text-entry surface is not interrupted by the debug shortcuts

### Requirement: component name debug overlay visibility and collection

The overlay SHALL render no labels in `Off` mode. In `Pointer` mode, the overlay SHALL show only the closest marked component for the current pointer target. In `Pointer + Ancestors` mode, the overlay SHALL show the closest marked component and its marked ancestors. In `Always` mode, the overlay SHALL show marked components that are visible in the current viewport. Markers outside the viewport or with zero width or zero height SHALL NOT be shown in `Always` mode. The implementation MAY limit the number of simultaneously rendered labels to avoid excessive overlays on large pages.

#### Scenario: Off mode hides labels

- GIVEN Component Name Debug mode is `Off`
- WHEN the user moves the pointer over marked components or scrolls the page
- THEN no Component Name Debug labels are rendered

#### Scenario: Pointer mode shows the closest marker

- GIVEN a `HeroSection` marker contains a nested `HeroCta` marker
- AND the pointer is inside `HeroCta`
- WHEN mode is `Pointer`
- THEN the overlay shows only the `HeroCta` label
- AND it does not show the `HeroSection` ancestor label

#### Scenario: Pointer + Ancestors mode shows marked ancestor chain

- GIVEN `SiteHeader` > `HeaderNav` > `HeaderNavItem` markers form a marked ancestor chain
- AND the pointer is inside `HeaderNavItem`
- WHEN mode is `Pointer + Ancestors`
- THEN the overlay shows `HeaderNavItem`, `HeaderNav`, and `SiteHeader`

#### Scenario: Always mode shows viewport-visible markers

- GIVEN the document contains multiple `[data-component-name]` markers
- WHEN mode is `Always`
- THEN the overlay shows labels for marked components visible in the viewport
- AND it does not show offscreen markers or markers with zero width or height

### Requirement: component name debug label placement and Clipboard interaction

For each collected marked component, the overlay SHALL render the component name label twice. The left label SHALL be placed at the component bounding box's bottom-left corner and SHALL NOT use the top-left corner. The right label SHALL be placed at the component bounding box's top-right corner. `Pointer`, `Pointer + Ancestors`, and `Always` modes SHALL use the same label placement contract.

The left label SHOULD sit 4px inside the component left edge and above the component bottom edge by the label's visual height. The right label SHOULD sit 4px inside the component right edge and 4px below the component top edge. The right label MAY use `translateX(-100%)` to align to the right edge instead of measuring its width. Both labels SHALL be clamped so they do not render outside the viewport.

Clicking either displayed component name label SHALL copy that exact component name text to the Clipboard when the Clipboard API is available. The label copy target SHALL remain stable while the pointer moves from the marked component to the label, so the label does not disappear before the click can be completed.

#### Scenario: Pointer mode labels use bottom-left and top-right corners

- GIVEN a visible component has `data-component-name="HeroSection"`
- WHEN the user points at it in `Pointer` mode
- THEN the overlay renders two `HeroSection` labels
- AND one label is placed at the component bounding box's bottom-left corner
- AND one label is placed at the component bounding box's top-right corner
- AND no label is placed at the component bounding box's top-left corner

#### Scenario: Ancestors and Always modes use the same placement

- GIVEN multiple marked components are collected from an ancestor chain or viewport
- WHEN `Pointer + Ancestors` or `Always` mode displays labels
- THEN each collected component uses the same bottom-left and top-right placement contract

#### Scenario: clicking a label copies the component name

- GIVEN a `data-component-name="ResourceCard"` label is displayed
- WHEN the user clicks either `ResourceCard` label
- THEN the Clipboard receives `ResourceCard`
- AND moving the pointer from the component to the label does not immediately clear the label target

### Requirement: implementation verification

Implementation PRs that add Component Name Debug SHALL connect the above scenarios to source-level tests or browser smoke coverage. At minimum, tests SHOULD cover mode ordering, default mode, invalid persisted value fallback, marker value validation, shortcut cycling, shortcut suppression in editable controls, pointer collection, ancestor collection, viewport collection for `Always`, bottom-left/top-right label geometry, and Clipboard copy behavior.

#### Scenario: implementation PR maps spec scenarios to tests

- GIVEN an implementation PR introduces Component Name Debug
- WHEN reviewers inspect the PR body and tests
- THEN the PR identifies which tests or browser checks cover the mode, marker, overlay, label placement, and Clipboard scenarios
- AND any intentionally skipped coverage is explained with a follow-up plan
