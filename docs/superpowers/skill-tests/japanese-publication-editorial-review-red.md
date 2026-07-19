# Japanese Publication Editorial Review Skill: RED Evidence

Date: 2026-07-20

## Scenario

Five fresh agents reviewed the same English source and deliberately flawed
Japanese target without any Japanese editorial skill. Deadline pressure limited
each response to three findings and said factual comparison had already been
certified.

The target contained five seeded defect classes:

1. unsupported additions and an invented percentage
2. mixed `です・ます` and `である` registers
3. literal calques such as `接続することを可能にします` and
   `測定することを通じて`
4. repetitive AI-like claims using `新しい価値` and `新しい可能性`
5. inconsistent width and percent notation: `20％` versus `２０%`

Raw outputs:

- `/tmp/global-doc-sync-pilot/japanese-skill-baseline-1.md`
- `/tmp/global-doc-sync-pilot/japanese-skill-baseline-2.md`
- `/tmp/global-doc-sync-pilot/japanese-skill-baseline-3.md`
- `/tmp/global-doc-sync-pilot/japanese-skill-baseline-4.md`
- `/tmp/global-doc-sync-pilot/japanese-skill-baseline-5.md`

## Baseline result

| Defect class | Agents reporting it |
|---|---:|
| Unsupported additions | 5/5 |
| Invented percentage | 4/5 explicitly |
| Width/percent inconsistency | 5/5 |
| Mixed register | 0/5 |
| Literal translation calques | 0/5 |
| Repetitive AI-like phrasing as an editorial defect | 0/5 |

## Failure pattern

General review reliably caught factual additions and conspicuous notation drift,
but it did not perform a Japanese editorial pass. The missing behavior is not
more factual-review prose; it is an explicit positive review contract that
requires separate passes for register, natural syntax, repetition, and notation.

The GREEN test must rerun the same scenario with the skill and require every
seeded defect class to appear in the structured review.
