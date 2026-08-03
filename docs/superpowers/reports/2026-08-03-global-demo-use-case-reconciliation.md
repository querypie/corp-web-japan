# Global Demo Use Case Reconciliation Report

## Scope

- Global SHA: `e280ce18e8e67fd0a2f21026c83910e4b93d8e32`
- Japan base SHA: `4217727855d1e5e155a48a1f58da638290802b8f`
- Source family: `demo/use-cases`
- Target family: `src/content/use-cases`
- Production evidence: all 24 source records are linked from `https://www.querypie.com/en/demo` and present in the production sitemap.

## Review method

Each candidate was reviewed across title, summary, full body, date, slug, source URL, media, outline, claims, examples, products, conclusion, and one-to-one target ownership. Exact slug was candidate evidence only, not the verdict. Global English and Japan-localized YouTube videos were treated as non-conflicting media localization when their titles and surrounding publication content matched. Local thumbnail path/format changes were treated as expected repository migration differences.

## Results

| Identity | Japan target | Review notes | Verdict |
| --- | --- | --- | --- |
| `demo:cnt_000068` | `use-cases:29` | Same SEO workflow, claims, conclusion, date, slug, and video. | Equivalent |
| `demo:cnt_000069` | `use-cases:28` | Same quotation-analysis workflow, secured PDF example, date, slug, and video. | Equivalent |
| `demo:cnt_000070` | `use-cases:27` | Same quotation generation workflow, Sandbox claims, date, slug, and video. | Equivalent |
| `demo:cnt_000071` | `use-cases:25` | Same portfolio analysis workflow and video; harmless Global body typo removed in Japan. | Equivalent |
| `demo:cnt_000072` | `use-cases:26` | Same investment analysis workflow, governance conclusion, date, slug, and video. | Equivalent |
| `demo:cnt_000073` | `use-cases:24` | Same AWS architecture publication and localized EN/JP videos; Japan publication date is five days later. | Equivalent |
| `demo:cnt_000074` | `use-cases:22` | Same AWS log analytics workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000075` | `use-cases:23` | Same AWS Inspector publication; title localized as AWS Insight, EN/JP videos correspond, Japan date is seven days later. | Equivalent |
| `demo:cnt_000076` | `use-cases:20` | Same military HR workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000077` | `use-cases:21` | Same incident management workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000078` | `use-cases:18` | Same baggage operations workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000079` | `use-cases:19` | Same aircrew scheduling workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000080` | `use-cases:17` | Same aircraft maintenance workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000081` | `use-cases:16` | Same development insight workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000082` | `use-cases:15` | Same factory IoT workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000083` | `use-cases:14` | Same credit check workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000084` | `use-cases:13` | Same Microsoft 365 workflow, date, slug, and video. | Equivalent |
| `demo:cnt_000085` | `use-cases:12` | Same work-collaboration publication. Global currently embeds the English Security Audit video, while Japan embeds the correct JP Work Collaboration video; this is a Global media defect, not an identity conflict. | Equivalent |
| `demo:cnt_000086` | `use-cases:9` | Same server access publication with corresponding EN/JP videos. | Equivalent |
| `demo:cnt_000087` | `use-cases:11` | Same security audit publication with corresponding EN/JP videos. | Equivalent |
| `demo:cnt_000088` | `use-cases:10` | Same Kubernetes management publication with corresponding EN/JP videos. | Equivalent |
| `demo:cnt_000089` | `use-cases:8` | Same advanced data analytics publication with corresponding EN/JP videos. | Equivalent |
| `demo:cnt_000090` | `use-cases:7` | Same base data analytics publication with corresponding EN/JP videos. | Equivalent |
| `demo:cnt_000091` | `use-cases:6` | Same AWS infrastructure publication, full body, date, slug, and video. | Equivalent |

## Ownership and tracking checks

- Every source identity has exactly one candidate.
- Target IDs `6` through `29` are not owned by existing baseline rows.
- Existing `documentation:voc` mappings own target IDs `1` through `5`; no overlap exists.
- No reviewed identity appears in `ignore.json`.
- After adding 24 mappings: Global published `96`, Japan present mappings `143`, Global-only `1`, mapping drift `0`.
