     1|     1|# Route-Aligned MDX Authoring for Developers
     2|     2|
     3|     3|## 1. Why this document exists
     4|     4|
     5|     5|PR 470 documented the main route-local refactoring direction for static marketing pages:
     6|     6|
     7|     7|- keep `page.tsx` as the primary authoring surface
     8|     8|- keep section composition readable in the route
     9|     9|- keep extracted section files focused on UI implementation details
    10|    10|
    11|    11|This document covers a related but different pattern.
    12|    12|It is a route-local refactoring variant for content-heavy routes where the real authored body should live in `.mdx` files instead of inline JSX in `page.tsx`.
    13|    13|
    14|    14|Typical examples in this repository are:
    15|    15|
    16|    16|- blog posts
    17|    17|- whitepapers
    18|    18|- news posts
    19|    19|- events
    20|    20|- use cases and demo detail pages
    21|    21|- legal documents such as EULA, Terms of Service, and versioned privacy policies
    22|    22|
    23|    23|In these route families, the best route-local outcome is usually not “put all copy back into `page.tsx`.”
    24|    24|The better outcome is:
    25|    25|
    26|    26|- keep the route file thin
    27|    27|- move the content body into a route-aligned MDX file
    28|    28|- preserve a predictable file and directory convention that maps cleanly to the route or slug
    29|    29|- let shared code render a consistent UI shell around the MDX content
    30|    30|
    31|    31|So this pattern is not a rejection of PR 470.
    32|    32|It is an extension of the same authoring-ownership idea, applied to publication and document families.
    33|    33|
    34|    34|## 2. Core idea
    35|    35|
    36|    36|For these route families, separate responsibilities like this:
    37|    37|
    38|    38|- `src/app/**/page.tsx`
    39|    39|  - route entry
    40|    40|  - param handling
    41|    41|  - canonical redirect logic
    42|    42|  - metadata wiring
    43|    43|  - thin page composition
    44|    44|- `src/content/**` or route-adjacent `content.mdx`
    45|    45|  - the actual long-form content body
    46|    46|  - frontmatter that describes the document or publication
    47|    47|- `src/lib/**`
    48|    48|  - loaders, route resolution, frontmatter parsing, MDX rendering, and family-specific rules
    49|    49|- `src/components/sections/**`
    50|    50|  - shared post/document page shells and reusable UI primitives
    51|    51|
    52|    52|In short:
    53|    53|
    54|    54|- static marketing page pattern -> `page.tsx` owns most copy
    55|    55|- publication / document pattern -> `.mdx` owns the long-form copy, while `page.tsx` stays thin
    56|    56|
    57|    57|## 3. When this pattern is the right fit
    58|    58|
    59|    59|Use route-aligned MDX authoring when most of the following are true:
    60|    60|
    61|    61|- the route is a publication, article, document, or long-form resource
    62|    62|- the content body is primarily prose rather than highly bespoke marketing composition
    63|    63|- many pages in the same family should share one rendering contract
    64|    64|- the route naturally maps to an `id`, `slug`, or version identifier
    65|    65|- future content updates should be possible without touching page implementation code
    66|    66|- multilingual expansion is likely or already expected
    67|    67|
    68|    68|Good fits in this repo:
    69|    69|
    70|    70|- `/blog/:id/:slug`
    71|    71|- `/whitepapers/:id/:slug`
    72|    72|- `/news/:id/:slug`
    73|    73|- `/events/:id/:slug`
    74|    74|- `/demo/aip/:id/:slug`
    75|    75|- `/demo/acp/:id/:slug`
    76|    76|- `/t/eula`
    77|    77|- `/t/terms-of-service`
    78|    78|- `/t/privacy-policy/[slug]`
    79|    79|
    80|    80|Not the default fit:
    81|    81|
    82|    82|- top page
    83|    83|- solution landing pages
    84|    84|- static marketing pages whose copy and section composition should remain reviewer-visible in JSX
    85|    85|
    86|    86|## 4. Main benefits
    87|    87|
    88|    88|### 4.1 Route-to-content mapping becomes obvious
    89|    89|
    90|    90|A predictable MDX file layout makes it much easier to answer:
    91|    91|
    92|    92|- which file owns this route?
    93|    93|- which file owns this slug?
    94|    94|- where should a new localized version live?
    95|    95|
    96|    96|Examples from the current repo shape:
    97|    97|
    98|    98|- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/blog](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog) (MDX files named `<id>-<slug>.mdx`)
    99|    99|- [src/app/whitepapers/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/whitepapers/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/whitepapers](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/whitepapers) (MDX files named `<id>-<slug>.mdx`)
   100|   100|- [src/app/news/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/news/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/news](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/news) (MDX files named `<id>-<slug>.mdx`)
   101|   101|- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx) -> [src/app/t/terms-of-service/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/content.mdx)
   102|   102|- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx) -> [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
   103|   103|- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx) -> [src/content/privacy-policy](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy) (versioned MDX files such as [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx))
   104|   104|
   105|   105|That mapping is especially valuable for reviewers, content editors, and AI agents.
   106|   106|
   107|   107|### 4.2 `page.tsx` stays thin and stable
   108|   108|
   109|   109|For publication and legal families, the route file should mostly answer routing questions, not duplicate document text.
   110|   110|
   111|   111|A good thin route file usually handles:
   112|   112|
   113|   113|- route params
   114|   114|- canonical slug redirects
   115|   115|- `notFound()` for missing records
   116|   116|- metadata generation from frontmatter
   117|   117|- calling one shared page shell
   118|   118|
   119|   119|That keeps implementation code stable even when content changes frequently.
   120|   120|
   121|   121|### 4.3 One family can share a consistent UI
   122|   122|
   123|   123|A publication family often wants the same visual structure across many entries:
   124|   124|
   125|   125|- shared hero treatment
   126|   126|- shared byline / meta area
   127|   127|- shared body typography
   128|   128|- shared related-items area
   129|   129|- shared gated-content behavior
   130|   130|- shared legal-document wrapper
   131|   131|
   132|   132|By keeping the content in MDX and the presentation in shared components, the repo can render many content items consistently without copying page implementation logic.
   133|   133|
   134|   134|### 4.4 Code becomes language-agnostic
   135|   135|
   136|   136|When implementation code is mostly shell, loader, and rendering logic, it does not need to be rewritten per language.
   137|   137|
   138|   138|That means:
   139|   139|
   140|   140|- Japanese, English, or Korean content can reuse the same rendering contract
   141|   141|- UI code focuses on layout and behavior
   142|   142|- content language stays in the content file instead of leaking through component logic
   143|   143|
   144|   144|This usually makes future localization or cross-language parity work much cleaner.
   145|   145|
   146|   146|### 4.5 i18n becomes structurally easier
   147|   147|
   148|   148|Route-aligned MDX conventions make it easier to support multiple language variants later because the content identity and the route identity can stay explicit.
   149|   149|
   150|   150|For example, a family can preserve:
   151|   151|
   152|   152|- a stable `id`
   153|   153|- a canonical route `slug`
   154|   154|- one or more language-specific content files
   155|   155|- a shared renderer and shared route behavior
   156|   156|
   157|   157|The exact multilingual file contract may vary by family, but the key point is that MDX content separation makes language expansion easier than burying long-form copy inside route code.
   158|   158|
   159|   159|## 5. Two useful sub-patterns
   160|   160|
   161|   161|This repository already shows two important forms of the same idea.
   162|   162|
   163|   163|### 5.1 Content-root MDX for publication families
   164|   164|
   165|   165|Use a shared family content root when many items share the same route structure.
   166|   166|
   167|   167|Examples:
   168|   168|
   169|   169|- [src/content/blog](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog) (`*.mdx`)
   170|   170|- [src/content/whitepapers](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/whitepapers) (`*.mdx`)
   171|   171|- [src/content/news](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/news) (`*.mdx`)
   172|   172|- [src/content/events](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/events) (`*.mdx`)
   173|   173|- [src/content/demo/aip](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/demo/aip) (`*.mdx`)
   174|   174|- [src/content/demo/acp](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/demo/acp) (`*.mdx`)
   175|   175|
   176|   176|Recommended contract:
   177|   177|
   178|   178|- file name includes the stable `id` and readable slug
   179|   179|- frontmatter keeps the canonical route slug
   180|   180|- loader resolves by `id`
   181|   181|- route redirects `/section/:id` or mismatched slugs to `/section/:id/:slug`
   182|   182|
   183|   183|This is the right fit when the route family has many entries and wants one consistent loading pipeline.
   184|   184|
   185|   185|### 5.2 Route-adjacent MDX for singleton or route-owned documents
   186|   186|
   187|   187|Use route-adjacent `content.mdx` when the route itself is the clearest owner of one document.
   188|   188|
   189|   189|Current examples:
   190|   190|
   191|   191|- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx) + [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
   192|   192|- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx) + [src/app/t/terms-of-service/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/content.mdx)
   193|   193|
   194|   194|This is a good fit when:
   195|   195|
   196|   196|- one route owns one document
   197|   197|- there is no large multi-record loader requirement
   198|   198|- route adjacency is more readable than putting the file in a shared content root
   199|   199|
   200|   200|### 5.3 Versioned MDX under a dedicated content root
   201|   201|
   202|   202|A versioned document family often fits best in a dedicated content root keyed by slug or date.
   203|   203|
   204|   204|Current example:
   205|   205|
   206|   206|- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)
   207|   207|- [src/content/privacy-policy](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy) (for example [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx))
   208|   208|
   209|   209|This is a good fit when:
   210|   210|
   211|   211|- the route is still family-specific
   212|   212|- records are versioned
   213|   213|- the route needs a list of valid slugs and frontmatter-derived metadata
   214|   214|- storing all versions next to each other is clearer than colocating each file under its own route folder
   215|   215|
   216|   216|## 6. Recommended mapping conventions
   217|   217|
   218|   218|### 6.1 For publication/detail families
   219|   219|
   220|   220|Preferred pattern:
   221|   221|
   222|   222|- route: `src/app/<section>/[id]/[slug]/page.tsx`
   223|   223|- content: `src/content/<section>/<id>-<slug>.mdx`
   224|   224|- canonical identity: frontmatter `id` + frontmatter `slug`
   225|   225|- shared asset root: `public/<section>/<id>/...`
   226|   226|
   227|   227|Examples:
   228|   228|
   229|   229|- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx)
   230|   230|- [src/content/blog/9-data-discovery-privacy-management.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog/9-data-discovery-privacy-management.mdx)
   231|   231|- [public/blog/9/thumbnail.png](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/public/blog/9/thumbnail.png)
   232|   232|
   233|   233|### 6.2 For singleton documents
   234|   234|
   235|   235|Preferred pattern:
   236|   236|
   237|   237|- route: `src/app/<route>/page.tsx`
   238|   238|- content: `src/app/<route>/content.mdx`
   239|   239|
   240|   240|Examples:
   241|   241|
   242|- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx)
   243|- [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
   244|
   245|   245|### 6.3 For versioned document families
   246|   246|
   247|   247|Preferred pattern:
   248|   248|
   249|   249|- route: `src/app/<route>/[slug]/page.tsx`
   250|   250|- content: `src/content/<family>/<slug>.mdx`
   251|   251|
   252|   252|Examples:
   253|   253|
   254|   254|- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)
   255|   255|- [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx)
   256|   256|
   257|   257|## 7. What the thin wrapper should do
   258|   258|
   259|   259|A good thin wrapper route usually does only the following:
   260|   260|
   261|   261|1. read params
   262|   262|2. resolve the target record or document
   263|   263|3. redirect if the slug is missing or mismatched
   264|   264|4. build metadata from frontmatter
   265|   265|5. render one shared family page shell
   266|   266|
   267|   267|Representative current shapes in this repo:
   268|   268|
   269|- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx)
   270|- [src/app/news/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/news/%5Bid%5D/%5Bslug%5D/page.tsx)
   271|- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx)
   272|- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx)
   273|- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)
   274|   274|
   275|   275|A route of this kind should not also become a giant content registry or a page-specific prose container.
   276|   276|
   277|   277|## 8. Frontmatter matters
   278|   278|
   279|   279|When content moves into MDX, frontmatter becomes part of the route contract.
   280|   280|
   281|   281|Typical responsibilities of frontmatter include:
   282|   282|
   283|   283|- canonical slug
   284|   284|- title
   285|   285|- description
   286|   286|- date or version
   287|   287|- hero image path
   288|   288|- related item IDs
   289|   289|- gated-content flags
   290|   290|- redirect targets, where supported
   291|   291|
   292|   292|That means frontmatter quality is not optional.
   293|   293|It is part of the application contract between route, loader, metadata, and rendering shell.
   294|   294|
   295|   295|## 9. Patterns to avoid
   296|   296|
   297|   297|### Bad pattern A: thin route, but opaque content lookup
   298|   298|
   299|   299|```tsx
   300|   300|export default function Page() {
   301|   301|  return <PublicationPage sourceKey="item-17" />;
   302|   302|}
   303|   303|```
   304|   304|
   305|   305|Why it is bad:
   306|   306|
   307|   307|- the route does not reveal which file owns the content
   308|   308|- the mapping is hidden in another registry
   309|   309|- reviewers and AI agents must chase indirect keys
   310|   310|
   311|   311|### Bad pattern B: content moved to MDX, but file naming ignores route identity
   312|   312|
   313|   313|Examples of poor naming:
   314|   314|
   315|   315|- `src/content/blog/final.mdx`
   316|   316|- `src/content/blog/post-latest.mdx`
   317|   317|- `src/content/privacy-policy/current.mdx`
   318|   318|
   319|   319|Why it is bad:
   320|   320|
   321|   321|- route ownership is unclear
   322|   322|- slug lookup becomes fragile
   323|   323|- future i18n or versioning becomes harder
   324|   324|
   325|   325|### Bad pattern C: publication routes rewritten as static marketing pages
   326|   326|
   327|   327|If a blog or legal document route is forced back into giant inline JSX inside `page.tsx`, the result is often worse:
   328|   328|
   329|   329|- long-form copy becomes harder to edit
   330|   330|- one shared renderer becomes harder to maintain
   331|   331|- future language expansion becomes harder
   332|   332|- page implementation churn increases for simple content edits
   333|   333|
   334|   334|## 10. Review questions
   335|   335|
   336|   336|When reviewing this pattern, ask:
   337|   337|
   338|   338|- can I tell which MDX file owns this route?
   339|   339|- does the file naming convention map cleanly to the URI and slug?
   340|   340|- is `page.tsx` thin for the right reasons, or just hiding complexity in a bad registry?
   341|   341|- does shared UI live in components and shared logic in loaders?
   342|   342|- does frontmatter clearly define the route contract?
   343|   343|- would adding a second language or a second version still look structurally sane?
   344|   344|
   345|   345|## 11. Suggested guidance for AI-agent tasks
   346|   346|
   347|   347|Useful task shapes include instructions such as:
   348|   348|
   349|   349|- “Implement this publication route as a thin wrapper around route-aligned MDX content.”
   350|   350|- “Keep the route-to-content mapping explicit through `id`/`slug`-aligned MDX filenames.”
   351|   351|- “Use shared page shells for rendering, and keep the long-form body in MDX.”
   352|   352|- “Do not turn this publication or legal route into a large JSX-authored marketing page.”
   353|   353|
   354|   354|A strong task packet should also say:
   355|   355|
   356|   356|- which route family is in scope
   357|   357|- whether the pattern should be route-adjacent `content.mdx` or shared `src/content/**`
   358|   358|- which file path and naming convention must be followed
   359|   359|- whether canonical slug redirects and metadata generation must be preserved
   360|   360|
   361|   361|## 12. Bottom line
   362|   362|
   363|   363|PR 470 established the main route-local refactoring direction for static marketing pages.
   364|   364|This MDX pattern is the corresponding publication/document variant:
   365|   365|
   366|   366|- route stays local and thin
   367|   367|- content ownership moves into MDX
   368|   368|- file paths align with route identity
   369|   369|- UI stays consistent through shared renderers
   370|   370|- implementation code stays language-agnostic
   371|   371|- future i18n and content scaling become easier
   372|   372|
   373|   373|So the real principle is not “always put copy in `page.tsx`.”
   374|   374|The real principle is:
   375|   375|
   376|   376|- keep authorship near the route
   377|   377|- make route-to-content ownership obvious
   378|   378|- choose the authoring surface that best fits the page family
   379|   379|
   380|   380|For static marketing pages, that usually means JSX in `page.tsx`.
   381|   381|For publications and legal documents, that usually means route-aligned MDX plus a thin route wrapper.
   382|   382|