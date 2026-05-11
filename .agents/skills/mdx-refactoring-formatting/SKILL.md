---
name: mdx-refactoring-formatting
description: Refactor MDX source formatting in corp-web-japan while preserving valid MDX structure. Covers prose wrapping, indentation cleanup, and table indentation normalization as a separate cross-cutting skill.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, mdx, formatting, refactor, legal, content]
---

# Refactor MDX formatting in corp-web-japan

Use this skill when the task is specifically to clean up or normalize the
formatting of an existing `.mdx` file without changing its user-facing meaning.

This is a cross-cutting formatting skill.
It should stay separate from page-migration skills and publication-content
workflow skills so responsibilities remain mutually exclusive and collectively
exhaustive.

## Role boundary

This skill covers only MDX formatting refactors.
It does not decide:
- what route should exist
- what page structure should be migrated
- what copy should be rewritten semantically
- what CTA or UI contract should change

Use this skill for formatting-only or formatting-first work such as:
- rewrapping long MDX prose lines
- removing unnecessary leading whitespace indentation
- normalizing raw HTML block indentation inside MDX
- making route-adjacent legal/policy `content.mdx` files easier to review

Do not use it for:
- writing new publication frontmatter from scratch
- changing page routing or metadata
- changing the actual meaning of the copy
- redesigning component usage or MDX rendering contracts

## Goal

Normalize MDX source so that it is:
- readable in GitHub diffs and editor views
- structurally valid as MDX
- consistent across prose, lists, HTML blocks, and route-adjacent legal files
- safe to review without mixing formatting cleanup with semantic rewrites

## MECE formatting domains

Apply the rules below by domain.
The domains are intentionally mutually exclusive and collectively exhaustive.
Every formatting edit should fall into exactly one of these buckets.

### 1. Prose paragraph reflow

Use this domain for ordinary prose paragraphs.

Rules:
- wrap prose to an 80-column target width
- wrap only at word boundaries
- do not split words just to satisfy the width target
- preserve intentional hard line breaks only when the source meaning depends on
  them
- keep headings, frontmatter keys, URLs, and inline code intact unless a safe
  word-boundary wrap is obvious

Apply this to:
- ordinary body paragraphs
- long explanatory legal text
- long note/admonition prose inside MDX when it is still plain paragraph text

Do not apply this domain to:
- lists as lists
- tables as tables
- raw HTML block indentation

### 2. Block indentation normalization

Use this domain for unnecessary leading whitespace that does not express real
list nesting or code nesting.

Rules:
- remove unnecessary leading indentation from ordinary prose blocks
- keep only the indentation that is structurally required by Markdown or MDX
- preserve indentation required for:
  - nested bullet lists
  - nested numbered lists
  - mixed nested lists where numbered lists and bullet lists are combined
  - blockquotes
  - fenced code blocks
  - JSX/MDX component children when indentation reflects the actual tree
- when numbered lists, bullet lists, or mixed list types form a nested list,
  apply the indentation required by valid Markdown syntax rather than visually
  aligning items by ad hoc spacing
- do not flatten or left-trim nested list items in a way that would detach them
  from their parent list item
- if an MDX body is route-adjacent content such as `src/app/t/<route>/content.mdx`,
  prefer a flat readable body instead of inherited wrapper-era indentation

Practical rule:
- if deleting leading spaces does not change the Markdown/MDX parse tree, that
  leading whitespace is usually unnecessary and should be removed
- if a line belongs to a nested bullet list or nested numbered list, keep the
  indentation required for that nesting level even if the line looks over-indented
  in plain text at first glance

### 3. Raw HTML table normalization

Use this domain only for raw HTML table markup embedded in MDX.

Rules:
- keep `<table>` blocks valid HTML inside MDX
- normalize `<table>` subtree indentation to 2 spaces per nesting level
- apply the same 2-space rule consistently to:
  - `<thead>`
  - `<tbody>`
  - `<tr>`
  - `<th>`
  - `<td>`
- keep sibling row/cell structure visually aligned by nesting depth, not by ad
  hoc extra spaces
- do not convert raw HTML tables into Markdown tables unless the user explicitly
  asks for that transformation

Example nesting intent:
- `<table>` at base indent
- children like `<thead>` / `<tbody>` indented 2 spaces
- `<tr>` indented 4 spaces
- `<th>` / `<td>` indented 6 spaces

### 4. Protected structures

Use this domain to identify content that should not be mechanically reformatted
beyond minimal whitespace cleanup.

Protect these by default:
- frontmatter semantics and key ordering unless the task explicitly asks for a
  frontmatter edit
- fenced code blocks
- inline JSX/MDX where reflow would make the tag structure harder to read
- import/export statements
- inline code spans
- explicit markdown line-break hacks used intentionally for rendering
- long URLs when reflow would reduce clarity or risk broken syntax

Rule:
- if a change risks altering MDX parse behavior, stop treating it as a pure
  formatting refactor and switch to a more deliberate edit plan

## Recommended workflow

1. Identify the target MDX file and classify each touched region into one of the
   four domains above.
2. Reflow ordinary prose to the 80-column target.
3. Remove unnecessary leading indentation from non-table, non-code prose.
4. Normalize raw HTML tables to the 2-space indentation rule.
5. Re-read the file and confirm no edit crossed domain boundaries by accident.
6. Keep semantic copy changes out of the same formatting-only diff unless the
   user explicitly asked for both.

## Route-adjacent legal MDX guidance

When the file is a route-adjacent legal body such as:
- `src/app/t/<route>/content.mdx`

prefer this end state:
- long prose is wrapped to the 80-column target
- leftover wrapper-era indentation is removed
- raw HTML tables, if any, follow the 2-space indentation rule
- the MDX file owns only the document body, not outer page-shell wrappers

## Verification

Before finalizing:
- re-read the edited MDX file in plain text
- confirm paragraphs are wrapped at word boundaries near the 80-column target
- confirm unnecessary leading whitespace is removed
- confirm nested bullet lists, nested numbered lists, and mixed nested lists
  still have the indentation required by valid Markdown syntax
- confirm raw HTML `<table>` blocks follow the 2-space indentation rule
- confirm the result is still valid-looking MDX with intact headings, lists,
  JSX/MDX tags, and code fences
- run the lightest repo-appropriate verification if the MDX file is covered by
  an existing targeted test

## Done criteria

- each formatting edit fits exactly one MECE domain above
- prose is wrapped to an 80-column target
- unnecessary leading indentation is removed
- nested numbered lists, nested bullet lists, and mixed nested lists keep valid
  Markdown indentation
- raw HTML `<table>` indentation follows the 2-space rule
- MDX structure remains valid and readable
- the diff remains a formatting refactor, not a hidden semantic rewrite
