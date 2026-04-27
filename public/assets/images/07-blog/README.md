# Asset retention note for /assets/images/07-blog

`event-thumb-5.png` in this directory is a compatibility asset that must remain available even if it is no longer referenced by the current website codebase directly.

Why this file was added:
- Repeated requests for `/assets/images/07-blog/event-thumb-5.png` were observed in the Vercel runtime logs.
- Those requests come from already-deployed external content/HTML, not from an internal route in the current site.
- Because of that, restoring the real file at the original public path is the correct fix, rather than treating it as a redirect-only case.

Source:
- The original PNG was restored from the repository history at commit `d6b34b07beda66d7a6558370b77407ca44725b92` and placed back at the same public path.

Operational rule:
- Keep this file for backward compatibility with externally published static URLs, regardless of internal UI refactors.
- Do not rename or remove this path until the externally deployed content that references it has been fully cleaned up.
