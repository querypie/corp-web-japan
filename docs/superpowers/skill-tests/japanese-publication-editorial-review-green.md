# Japanese Publication Editorial Review Skill: GREEN Evidence

Date: 2026-07-20

## Method

The RED scenario was rerun five times through real non-interactive Pi processes:

```bash
pi --print --no-session --no-tools \
  --skill .agents/skills/japanese-publication-editorial-review \
  "<same source, target, and deadline pressure>"
```

Raw outputs:

- `/tmp/global-doc-sync-pilot/japanese-skill-green-1.md`
- `/tmp/global-doc-sync-pilot/japanese-skill-green-2.md`
- `/tmp/global-doc-sync-pilot/japanese-skill-green-3.md`
- `/tmp/global-doc-sync-pilot/japanese-skill-green-4.md`
- `/tmp/global-doc-sync-pilot/japanese-skill-green-5.md`

## Result

| Required defect class | Agents reporting it |
|---|---:|
| Unsupported additions and invented percentage | 5/5 |
| Mixed `です・ます` / `である` register | 5/5 |
| Literal translation calques and wordiness | 5/5 |
| Redundant generic claims | 5/5 |
| Full/half-width and percent notation drift | 5/5 |

All five rejected publication. Unlike RED, every run performed the dedicated
register and natural-syntax passes even under deadline pressure. Outputs also
caught the omitted `organizations` subject and the weakened/ambiguous
`helps ... connect` meaning.

## Decision

GREEN. The skill changes the missing behavior identified in RED without relying
on detector scores. It requires observable evidence and meaning-preserving
corrections.
