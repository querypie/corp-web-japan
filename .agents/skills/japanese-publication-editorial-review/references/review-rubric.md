# Japanese editorial review rubric

## Severity

| Severity | Use when | Result |
|---|---|---|
| `critical` | Fabricated or dangerously reversed claim; legal/security meaning changed | Block |
| `major` | Material omission, mistranslation, mixed voice across body, pervasive translationese, misleading terminology | Block |
| `minor` | Local awkwardness, repetition, notation or punctuation inconsistency | Correct when practical |
| `note` | Non-blocking observation or intentional exception with evidence | Record |

A high count of minor findings may be raised to `major` when the cumulative
reading quality is not publication-ready.

## Deterministic checks

Use code for mechanical evidence; do not spend LLM judgment on facts a validator
can prove.

- unresolved Korean code points, excluding recorded proper nouns
- mixed full/half-width digits and percent notation
- repeated terminology variants against the maintained glossary
- missing headings, links, figures, captions, names, dates, or numeric tokens
- local asset/link existence
- MDX/frontmatter validity

A deterministic warning is evidence for review, not an automatic rewrite.

## Judgment checks

### Meaning preservation

Compare sentence or semantic block, not word count. Preserve modality and
certainty: `may`, `can`, `must`, estimates, limitations, and negatives must not
be strengthened or weakened. Do not add generic benefits, market claims, or
transition sentences absent from the source.

### Natural syntax and translation calques

Read the Japanese without mentally reconstructing the source language. Flag
literal structures when a Japanese editor would choose a direct verb or reorder
the information. Common inspection cues include:

- repeated `〜することができます` where `〜できます` or a direct verb is clearer
- mechanical `〜を通じて` / `〜において` / `〜という点で`
- unnecessary pronouns or repeated product names
- long pre-nominal clauses and stacked `の`
- source-language paragraph order that obscures the Japanese topic

These are cues, not banned phrases. Keep them when context makes them natural.

### Register and tone

Use the publication family's established voice. Do not mix `です・ます` and
`である` in authored prose. Quotations, code, product UI, citations, and fixed
names may differ. Prefer calm technical confidence over exaggerated marketing
language.

### Repetition and AI-like phrasing

Flag duplicated conclusions, repeated sentence openings, synonym chains that add
no information, and empty claims such as generic `新しい価値` or `新たな可能性`
when unsupported. Do not claim that any feature proves AI authorship. The only
question is whether the copy is specific, natural, and useful.

### Notation

Follow the repository's existing Japanese corpus first. Otherwise use one
consistent policy for Japanese punctuation, half-width Latin letters/digits,
units, percent signs, spaces, and brackets. Do not normalize product names,
commands, URLs, or code.

## Source basis

These sources inform the rubric; summarize their principles rather than copying
their wording.

- Japan Translation Federation, *JTF日本語標準スタイルガイド（翻訳用）*: register,
  punctuation, character width, numerals, units, and translation consistency
  - https://www.jtf.jp/tips/styleguide
  - https://www.jtf.jp/pdf/jtf_style_guide.pdf
- W3C, *Requirements for Japanese Text Layout (JLREQ)*: Japanese punctuation,
  brackets, mixed-script composition, spacing, and line breaking
  - https://www.w3.org/TR/jlreq/?lang=ja
- Microsoft Writing Style Guide, numbers and global content: numeric/measurement
  consistency and globally clear writing
  - https://learn.microsoft.com/ja-jp/style-guide/numbers
  - https://learn.microsoft.com/ja-jp/style-guide/translation
- Google developer documentation style guide, global audiences: concise syntax,
  consistent terminology, and avoidance of translation-hostile idioms
  - https://developers.google.com/style/translation
- Agency for Cultural Affairs, `やさしい日本語`: audience-aware clarity without
  changing essential information
  - https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/92484001.html

Translationese and LLM-text research may supply review cues, but no detector
score is accepted as publication evidence. Review findings must cite observable
text and a meaning-preserving correction.
