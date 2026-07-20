# Artifact contracts

All artifacts use `schemaVersion: "global-documentation-sync/v1"`, the same
`runId`, and the same `sourceId`. Agents return strict JSON on stdout without
Markdown fences; the deterministic runner validates and writes it atomically.

## Writer envelope

```json
{
  "mdx": "<complete MDX string>",
  "generationReport": {
  "schemaVersion": "global-documentation-sync/v1",
  "artifactType": "generation-report",
  "runId": "<candidate runId>",
  "sourceId": "<candidate sourceId>",
  "targetFiles": ["<absolute MDX path>", "<absolute asset path>"],
  "inventories": {
    "headings": [{ "source": "...", "target": "..." }],
    "figures": [{ "source": "...", "target": "..." }],
    "captions": [],
    "links": [{ "source": "...", "target": "..." }]
  },
  "intentionalTransformations": []
  }
}
```

Every source heading, figure, caption, and link must have a target mapping or an
explicit intentional transformation. `targetFiles` must stay inside the
candidate write boundary.

## Review reports

Each review uses its exact `artifactType` and filename:

- `fidelity-review` → `fidelity-review.json`
- `japanese-editorial-review` → `japanese-editorial-review.json`
- `contract-review` → `contract-review.json`

```json
{
  "schemaVersion": "global-documentation-sync/v1",
  "artifactType": "<exact type>",
  "runId": "<candidate runId>",
  "sourceId": "<candidate sourceId>",
  "verdict": "pass|revise",
  "findings": [
    {
      "severity": "critical|major|minor|note",
      "location": "<field, heading, or line>",
      "message": "<observable defect>",
      "suggestion": "<specific correction>"
    }
  ]
}
```

`critical` and `major` block. Reviewers report evidence; they do not edit the
publication.

## Fidelity scope

Check omissions, additions, meaning, certainty, names, dates, numbers, headings,
lists, tables, code, figures, captions, links, and CTA intent.

## Contract scope

Check family frontmatter, author resolution, related IDs, canonical route,
asset root, local links, effective PNG Open Graph image, gating, download
behavior, and required family tests.
