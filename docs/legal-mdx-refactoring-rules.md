# Legal MDX refactoring rules

This document records the refactoring rules for the current legal MDX corpus.
It is based on the local files below and a comparison with the source MDX in
`../corp-web-contents`.

Local legal MDX files:

- `src/app/t/eula/content.mdx`
- `src/app/t/terms-of-service/content.mdx`
- `src/content/privacy-policy/*.mdx`

Compared source MDX families:

- `../corp-web-contents/pages/eula/en/content.mdx`
- `../corp-web-contents/pages/terms-of-service-en/en/content.mdx`
- `../corp-web-contents/pages/terms-of-service-ja/en/content.mdx`
- `../corp-web-contents/pages/terms-of-service-ko/en/content.mdx`
- `../corp-web-contents/pages/privacy-policy-en/*/en/content.mdx`
- `../corp-web-contents/pages/privacy-policy-ko/*/en/content.mdx`

The same rules should be reused when the Korean legal documents are refactored
later.

## Source comparison findings

The original `corp-web-contents` legal MDX was authored for the old rendering
stack. It commonly contained page-layout wrappers and source-formatting artifacts
that should not be preserved in the local legal MDX body.

Observed source patterns:

- Wrapper components such as `Box` and `CenterSection` were used to own page
  layout from inside MDX.
- Some headings had wrapper-era indentation before the `#` marker.
- EULA used many `<br />` tags as paragraph spacing and visual line-break hacks.
- Privacy policy tables used many inline JSX string expressions such as
  `{'Purpose of collection'}` and `{"..."}` for ordinary cell text.
- Privacy policy table cells contained long one-line strings that were hard to
  review and easy to conflict.
- Current privacy policy versions relied on table components for merged cells,
  background colors, and table structure. Those table components are still part
  of the document semantics and should not be removed mechanically.

## Refactoring rules

### 1. Keep MDX as document body only

Legal MDX should contain legal document content, not page-shell layout.

Remove wrapper-only components from MDX when the route or shared legal primitive
already owns the layout:

- `Box`
- `CenterSection`
- route-specific wrapper components
- document/page wrapper components whose only role is spacing or width

Keep only components that represent document content that plain Markdown cannot
express safely. In the current legal corpus, `Table` is acceptable where table
cell styling, spanning, or structured table rendering is required.

### 2. Normalize headings

Headings must start at column 1.

Good:

```mdx
# Article 1. Purpose
```

Bad:

```mdx
  # Article 1. Purpose
```

Do not use indentation to visually align headings inside a removed wrapper. Once
wrapper components are gone, the MDX body should be flat and readable.

### 3. Remove paragraph-spacing `<br />` tags

Do not use `<br />` to create blank space between paragraphs or sections. Use
normal Markdown paragraph breaks instead.

Allowed exception:

- A `<br />` may remain inside a table cell when it represents an intentional
  line break between short cell values and replacing it with Markdown would risk
  changing table rendering.

Preferred alternatives:

- Use blank lines between paragraphs.
- Use Markdown lists for real lists.
- Use nested Markdown lists for subitems.
- Keep table-cell `<br />` only when it is the least risky representation of a
  cell-internal line break.

### 4. Use valid nested list indentation

Nested lists must be indented as Markdown structure, not by arbitrary visual
spacing.

Good:

```mdx
1. Parent item
   - Nested bullet
   - Nested bullet
2. Next parent item
```

Good:

```mdx
- Parent item
  1. Nested numbered item
  2. Nested numbered item
- Next parent item
```

Bad:

```mdx
1. Parent item
 - Detached bullet
2. Next parent item
```

Continuation lines should stay under the list text, not under the list marker:

```mdx
1. A long legal clause that wraps across lines and remains attached to the same
   numbered item.
```

### 5. Reflow long prose lines at word boundaries

Long prose should be wrapped for reviewability, normally around 80 to 100
columns depending on the surrounding MDX structure.

Rules:

- Wrap only at word boundaries.
- Do not split URLs or inline code if that would make the source harder to read.
- Do not wrap frontmatter values unless the parser and surrounding code are known
  to support the folded form.
- In JSX table cells, ordinary text children may be wrapped across multiple
  lines because JSX collapses whitespace in text nodes.

### 6. Minimize unnecessary JSX string expressions

Inside MDX component children, ordinary text should be written as text whenever
possible.

Good:

```mdx
<Table.Td>
  Purpose of collection
</Table.Td>
```

Bad:

```mdx
<Table.Td>
  {'Purpose of collection'}
</Table.Td>
```

Keep JSX string expressions only when they are necessary to preserve syntax, for
example when the text contains characters that would otherwise be parsed as MDX
or JSX syntax.

### 7. Keep table components only when they are semantically needed

Do not remove `Table` components just because they are components. Legal privacy
policy documents use tables as legal content. The current `Table` component
mapping also preserves table styling and cell-level semantics.

Allowed table component usage:

- `Table`
- `Table.Thead`
- `Table.Tbody`
- `Table.Tr`
- `Table.Th`
- `Table.Td`

While preserving table components, still refactor the cell source:

- remove unnecessary JSX string expressions
- wrap long cell text
- keep list indentation valid inside cells
- keep `<br />` only for intentional cell-internal line breaks

### 8. Preserve legal meaning

A legal MDX refactor is formatting and source-structure cleanup. It must not
rewrite legal meaning.

Do not change:

- article numbering
- effective dates
- defined terms
- table row/column meaning
- table cell grouping
- retention periods or collection items

If a wording change is legally or semantically desirable, make it a separate
content/legal review task rather than hiding it in a formatting refactor.

## Current local refactor outcome

The local legal MDX now follows these constraints:

- No heading line starts with leading whitespace.
- No legal MDX body uses wrapper-only layout components such as `Box` or
  `CenterSection`.
- No paragraph-spacing `<br />` appears outside `Table.Td` or `Table.Th` cells.
- Privacy policy table cells no longer use unnecessary JSX string expressions
  for ordinary text.
- Long privacy policy table-cell prose is wrapped at word boundaries.
- Nested list indentation is preserved instead of flattened.

## Verification checklist

Before future legal MDX refactors are merged, verify:

1. The affected legal MDX files still parse as MDX.
2. Headings start at column 1.
3. Wrapper-only layout components are absent from MDX.
4. `<br />` is absent outside table cells.
5. Nested lists remain attached to their parent item.
6. Long prose is wrapped without changing meaning.
7. `Table` usage is preserved only where the document needs table semantics.
8. Source comparison against `../corp-web-contents` explains whether each old
   source artifact was preserved, removed, or replaced.
