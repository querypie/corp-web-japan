#!/usr/bin/env python3
"""
generate_content_data.py
========================
corp-web-contents の MDX ファイルを読み込み、
corp-web-japan 用の whitepaper-data.js / blog-data.js を自動生成する。

Usage:
    python3 scripts/generate_content_data.py

Environment:
    GITHUB_TOKEN  - GitHub API token (read access to corp-web-contents)
    CONTENTS_REPO - (optional) default: querypie/corp-web-contents
    BRANCH        - (optional) default: main
"""

import os
import re
import json
import base64
import urllib.request
import urllib.error
from datetime import datetime

# ──────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────
GITHUB_TOKEN   = os.environ.get("GITHUB_TOKEN", "")
CONTENTS_REPO  = os.environ.get("CONTENTS_REPO", "querypie/corp-web-contents")
BRANCH         = os.environ.get("BRANCH", "main")
OUTPUT_DIR     = os.path.join(os.path.dirname(__file__), "..", "public")

# Vercel Blob base URL (used for author profile images when local file not found)
BLOB_BASE      = "https://jbxeeb6ybylgemuz.public.blob.vercel-storage.com/main"
CORP_WEB_API   = "https://www.querypie.com/api/data"

# Cache for Blob file mapping (loaded once per run)
_BLOB_MAP: dict = {}

def load_blob_map():
    """Fetch all file metadata from querypie.com/api/data → {filepath: url} mapping."""
    global _BLOB_MAP
    if _BLOB_MAP:
        return _BLOB_MAP
    try:
        req = urllib.request.Request(CORP_WEB_API)
        req.add_header("User-Agent", "Mozilla/5.0")
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
        for f in data.get("files", []):
            pn = f.get("pathname", "")
            if pn.startswith("main/"):
                key = pn[len("main/"):]
                _BLOB_MAP[key] = f["url"]
        print(f"  [blob] Loaded {len(_BLOB_MAP)} file entries from querypie.com/api/data")
    except Exception as e:
        print(f"  [blob] Failed to load blob map: {e}")
    return _BLOB_MAP


def blob_url(filepath: str) -> str:
    """Resolve a public/ filepath to its Vercel Blob CDN URL."""
    m = load_blob_map()
    return m.get(filepath, "")

# ──────────────────────────────────────────────
# GitHub API helpers
# ──────────────────────────────────────────────
def gh_get(path):
    """GET from GitHub API. Returns parsed JSON."""
    url = f"https://api.github.com/repos/{CONTENTS_REPO}/contents/{path}?ref={BRANCH}"
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github.v3+json")
    if GITHUB_TOKEN:
        req.add_header("Authorization", f"token {GITHUB_TOKEN}")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  [WARN] GitHub 404: {path}")
        return None


def gh_content(path):
    """Fetch file content from GitHub, return decoded string."""
    data = gh_get(path)
    if not data or "content" not in data:
        return None
    raw = data["content"].replace("\n", "")
    try:
        return base64.b64decode(raw).decode("utf-8")
    except Exception:
        return None


def gh_tree(prefix):
    """List all file paths under a directory prefix (recursive via git tree)."""
    url = f"https://api.github.com/repos/{CONTENTS_REPO}/git/trees/{BRANCH}?recursive=1"
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github.v3+json")
    if GITHUB_TOKEN:
        req.add_header("Authorization", f"token {GITHUB_TOKEN}")
    with urllib.request.urlopen(req) as resp:
        tree = json.loads(resp.read()).get("tree", [])
    return [item["path"] for item in tree if item["path"].startswith(prefix) and item["type"] == "blob"]


# ──────────────────────────────────────────────
# MDX parser
# ──────────────────────────────────────────────
def parse_frontmatter(text):
    """Extract YAML-like frontmatter from MDX. Returns (meta_dict, body_str)."""
    meta = {}
    body = text
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if m:
        fm = m.group(1)
        body = text[m.end():]
        for line in fm.split("\n"):
            kv = re.match(r'^(\w+):\s*"?([^"]*)"?\s*$', line)
            if kv:
                meta[kv.group(1)] = kv.group(2).strip()
            # author array: author: ["a", "b"]
            arr = re.match(r'^(\w+):\s*\[(.+)\]', line)
            if arr:
                items = re.findall(r'"([^"]+)"', arr.group(2))
                meta[arr.group(1)] = items if len(items) > 1 else (items[0] if items else "")
    return meta, body


def preprocess_jsx(body):
    """Pre-process MDX body: convert JSX components to markdown/HTML before line parsing."""

    # 1. Replace <ArticleGatingForm>...</ArticleGatingForm> with a gating wall (link to querypie.com download)
    # Find download URL from ButtonLink that appears before the gating form
    _gating_url = ""
    _bl_match = re.search(
        r'<ButtonLink[^>]*href=["\']([^"\']+)["\'][^>]*>[\s\S]*?</ButtonLink>[\s\S]*?<ArticleGatingForm',
        body)
    if _bl_match:
        _href = _bl_match.group(1)
        _gating_url = f"https://www.querypie.com/ja{_href}" if _href.startswith("/") else _href
    _gating_html = (
        '<div class="gating-wall">'
        '<div class="gating-fade"></div>'
        '<div class="gating-body">'
        '<h2 class="gating-heading">全文を読む</h2>'
        '<p class="gating-subtext">フォームに入力後、限定コンテンツをご覧いただけます。</p>'
        + (f'<div style="text-align:center"><a class="article-content-btn article-content-btn--wide" href="{_gating_url}" target="_blank" rel="noopener">ホワイトペーパーを入手する →</a></div>' if _gating_url else '')
        + '</div></div>'
    )
    body = re.sub(r'<ArticleGatingForm[^>]*>[\s\S]*?</ArticleGatingForm>', _gating_html, body)

    # 1b. Remove thumbnail image lines (already shown as cover image via `image` field)
    body = re.sub(r'!\[[^\]]*\]\(public/(?:white-paper|blog)/(?:wp-thumb|b-thumb)-\d+[^)]*\)\s*\n?', '', body)

    # 2. Convert <ArticleFileImage filepath="..." alt="..." caption="..." />
    def convert_file_image(m):
        attrs = m.group(1)
        filepath = re.search(r'filepath=["\']([^"\']+)["\']', attrs)
        alt     = re.search(r'alt=["\']([^"\']*)["\']', attrs)
        caption = re.search(r'caption=["\']([^"\']*)["\']', attrs)
        fp  = filepath.group(1) if filepath else ""
        a   = alt.group(1) if alt else ""
        cap = caption.group(1).strip() if caption else ""
        # Skip thumbnail images (already shown as cover image)
        filename = fp.split("/")[-1]
        if re.match(r'(wp-thumb|b-thumb)-\d+', filename):
            return ""
        result = f"\n![{a}]({fp})\n"
        if cap:
            result += f"*{cap}*\n"
        return result
    body = re.sub(r'<ArticleFileImage([\s\S]*?)/>', convert_file_image, body)

    # 3. Convert <ButtonLink href="URL" ...>TEXT</ButtonLink> → styled button
    def convert_button_link(m):
        attrs   = m.group(1)
        content = m.group(2).strip()
        href    = re.search(r'href=["\']([^"\']+)["\']', attrs)
        url     = href.group(1) if href else "#"
        # Relative URLs → absolute querypie.com/ja URL
        if url.startswith("/"):
            url = f"https://www.querypie.com/ja{url}"
        return f'\n<a class="article-content-btn article-content-btn--wide" href="{url}" target="_blank" rel="noopener">{content}</a>\n'
    body = re.sub(r'<ButtonLink([\s\S]*?)>([\s\S]*?)</ButtonLink>', convert_button_link, body)

    # 4. Convert <Youtube src="URL" ... /> → iframe embed
    def convert_youtube(m):
        attrs = m.group(1)
        src = re.search(r'src=["\']([^"\']+)["\']', attrs)
        url = src.group(1) if src else ""
        if url:
            return f'\n<iframe src="{url}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;"></iframe>\n'
        return ""
    body = re.sub(r'<Youtube([\s\S]*?)/>', convert_youtube, body)

    # 5. Strip <InfoNote>...</InfoNote> — keep inner content as plain text
    body = re.sub(r'<InfoNote[^>]*>([\s\S]*?)</InfoNote>', lambda m: '\n' + m.group(1).strip() + '\n', body)

    # 6. Strip <Box .../>, <Box ...>, </Box> (keep inner content)
    body = re.sub(r'<Box[^>]*/>', '', body)
    body = re.sub(r'<Box[^>]*>', '', body)
    body = re.sub(r'</Box>', '', body)

    # 7. Convert <Table>/<Table.Thead>/<Table.Tr>/<Table.Th>/<Table.Td> → HTML table
    def _convert_table_block(m):
        c = m.group(0)
        # Strip ㅤ padding chars used for column width in MDX
        c = c.replace('\uffa0', '').replace('\u3164', '')
        # Leaf cells first (may have multi-line content + inline markdown)
        def _cell(tag, tm):
            content = tm.group(1).strip().replace('\n', ' ')
            content = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', content)
            content = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', content)
            content = re.sub(r'`([^`]+)`', r'<code>\1</code>', content)
            return f'<{tag}>{content}</{tag}>'
        c = re.sub(r'<Table\.Th(?!ead)[^>]*>([\s\S]*?)</Table\.Th>',
                   lambda m2: _cell('th', m2), c)
        c = re.sub(r'<Table\.Td[^>]*>([\s\S]*?)</Table\.Td>',
                   lambda m2: _cell('td', m2), c)
        # Structural tags
        for pat, repl in [
            (r'<Table\.Thead[^>]*>', '<thead>'),
            (r'</Table\.Thead>',    '</thead>'),
            (r'<Table\.Tbody[^>]*>','<tbody>'),
            (r'</Table\.Tbody>',    '</tbody>'),
            (r'<Table\.Tr[^>]*>',  '<tr>'),
            (r'</Table\.Tr>',       '</tr>'),
        ]:
            c = re.sub(pat, repl, c)
        # Outer <Table> wrapper (not <Table.Xxx>)
        c = re.sub(r'<Table(?=[^.\w])[^>]*>', '<div class="wp-table-wrapper"><table class="wp-table">', c)
        c = re.sub(r'</Table>', '</table></div>', c)
        # Remove blank lines
        lines = [l for l in c.split('\n') if l.strip()]
        return '\n' + '\n'.join(lines) + '\n'

    body = re.sub(r'<Table[\s\S]*?</Table>', _convert_table_block, body)
    body = re.sub(r'<Table[\s\S]*?/>', '', body)  # self-closing (rare)

    # Also strip ㅤ from entire body
    body = body.replace('\uffa0', '').replace('\u3164', '')

    return body


def mdx_to_html(mdx_body):
    """Convert MDX/Markdown body to HTML string."""
    mdx_body = preprocess_jsx(mdx_body)
    lines = mdx_body.split("\n")
    html_lines = []
    in_code = False
    in_table = False
    in_ul = False
    in_ol = False
    in_blockquote = False

    def close_list():
        nonlocal in_ul, in_ol
        if in_ul:
            html_lines.append("</ul>")
            in_ul = False
        if in_ol:
            html_lines.append("</ol>")
            in_ol = False

    def close_blockquote():
        nonlocal in_blockquote
        if in_blockquote:
            html_lines.append("</blockquote>")
            in_blockquote = False

    def inline(text):
        """Apply inline markdown transforms."""
        # Bold+italic
        text = re.sub(r"\*\*\*(.+?)\*\*\*", r"<strong><em>\1</em></strong>", text)
        # Bold
        text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
        # Italic
        text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
        # Inline code
        text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
        # Images ![alt](url) — must come BEFORE links
        # Convert relative repo paths to Vercel Blob CDN URLs
        def _fix_img_url(m):
            alt, src = m.group(1), m.group(2)
            if src.startswith("public/") or src.startswith("images/"):
                filename = src.split("/")[-1]
                # Thumbnails already downloaded locally — use local path
                if re.match(r'(wp-thumb|b-thumb)-\d+', filename):
                    src = f"/assets/images/07-blog/{filename}"
                else:
                    # Try Vercel Blob CDN first
                    cdn = blob_url(src)
                    src = cdn if cdn else src
            return f'<img src="{src}" alt="{alt}" style="max-width:100%">'
        text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', _fix_img_url, text)
        # Links [text](url)
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                      r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>', text)
        # Strikethrough
        text = re.sub(r"~~(.+?)~~", r"<del>\1</del>", text)
        return text

    def heading_id(text):
        clean = re.sub(r"[^\w\s\u3000-\u9fff\u30a0-\u30ff\u3040-\u309f]", "", text.lower())
        return re.sub(r"\s+", "-", clean.strip())

    i = 0
    while i < len(lines):
        line = lines[i]
        raw = line.rstrip()

        # Code fence
        if raw.startswith("```"):
            close_list()
            close_blockquote()
            if in_code:
                html_lines.append("</code></pre>")
                in_code = False
            else:
                lang = raw[3:].strip()
                html_lines.append(f'<pre><code class="language-{lang}">' if lang else "<pre><code>")
                in_code = True
            i += 1
            continue

        if in_code:
            html_lines.append(raw.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
            i += 1
            continue

        # Skip JSX imports/exports
        if re.match(r"^(import|export)\s", raw):
            i += 1
            continue

        # Raw HTML block passthrough (converted table/div tags — don't wrap in <p>)
        if re.match(r"^\s*</?(?:div|table|thead|tbody|tr|th|td|iframe)\b", raw, re.IGNORECASE):
            close_list()
            html_lines.append(raw.strip())
            i += 1
            continue

        # Skip remaining JSX components/tags (uppercase = React component, not HTML)
        if re.match(r"^\s*</?[A-Z][a-zA-Z]*", raw):
            i += 1
            continue

        # Headings
        hm = re.match(r"^(#{1,6})\s+(.*)", raw)
        if hm:
            close_list()
            close_blockquote()
            level = len(hm.group(1))
            text = hm.group(2).strip()
            hid = heading_id(re.sub(r"\*\*(.+?)\*\*", r"\1", text))
            html_lines.append(f'<h{level} id="{hid}">{inline(text)}</h{level}>')
            i += 1
            continue

        # Horizontal rule
        if re.match(r"^[-*]{3,}$", raw.strip()):
            close_list()
            close_blockquote()
            html_lines.append("<hr>")
            i += 1
            continue

        # Blockquote
        if raw.startswith("> ") or raw == ">":
            if not in_blockquote:
                close_list()
                html_lines.append("<blockquote>")
                in_blockquote = True
            if raw != ">":  # skip bare ">" lines (empty blockquote continuation)
                content = raw[2:] if raw.startswith("> ") else ""
                # blockquote내 unordered list
                ul_bq = re.match(r"^[-*+]\s+(.*)", content)
                if ul_bq:
                    if not in_ul:
                        html_lines.append("<ul>")
                        in_ul = True
                    html_lines.append(f"<li>{inline(ul_bq.group(1))}</li>")
                else:
                    close_list()
                    if content:
                        html_lines.append(f"<p>{inline(content)}</p>")
            i += 1
            continue
        else:
            close_blockquote()

        # Unordered list
        ul_m = re.match(r"^(\s*)[-*+]\s+(.*)", raw)
        if ul_m:
            if not in_ul:
                close_list()
                html_lines.append("<ul>")
                in_ul = True
            html_lines.append(f"<li>{inline(ul_m.group(2))}</li>")
            i += 1
            continue

        # Ordered list
        ol_m = re.match(r"^(\s*)\d+\.\s+(.*)", raw)
        if ol_m:
            if not in_ol:
                close_list()
                html_lines.append("<ol>")
                in_ol = True
            html_lines.append(f"<li>{inline(ol_m.group(2))}</li>")
            i += 1
            continue

        # Table
        if "|" in raw and re.match(r"^\s*\|", raw):
            close_list()
            close_blockquote()
            if not in_table:
                html_lines.append('<div class="wp-table-wrapper"><table>')
                in_table = True
                cells = [c.strip() for c in raw.split("|")[1:-1]]
                html_lines.append("<thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in cells) + "</tr></thead><tbody>")
                # Skip separator row
                if i + 1 < len(lines) and re.match(r"^\s*\|[-| :]+\|\s*$", lines[i + 1]):
                    i += 2
                    continue
            else:
                cells = [c.strip() for c in raw.split("|")[1:-1]]
                html_lines.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells) + "</tr>")
            i += 1
            continue
        elif in_table:
            html_lines.append("</tbody></table></div>")
            in_table = False

        # Empty line
        if not raw.strip():
            close_list()
            html_lines.append("<br />")
            i += 1
            continue

        # Normal paragraph
        close_list()
        html_lines.append(f"<p>{inline(raw)}</p>")
        i += 1

    close_list()
    close_blockquote()
    if in_table:
        html_lines.append("</tbody></table></div>")

    return "\n".join(html_lines)


def extract_toc(html):
    """Extract H2/H3 headings from HTML and return TOC HTML string."""
    items = re.findall(r'<h([23]) id="([^"]+)">(.+?)</h\1>', html)
    if not items:
        return ""

    toc_parts = ['<ul class="sidebar-toc-list">']
    in_sub = False
    for level, hid, text in items:
        clean = re.sub(r"<[^>]+>", "", text)
        if level == "2":
            if in_sub:
                toc_parts.append("</ul></li>")
                in_sub = False
            toc_parts.append(f'<li><a href="#{hid}">{clean}</a>')
        else:
            if not in_sub:
                toc_parts.append('<ul class="sidebar-toc-sub">')
                in_sub = True
            toc_parts.append(f'<li><a href="#{hid}">{clean}</a></li>')
    if in_sub:
        toc_parts.append("</ul>")
    toc_parts.append("</li></ul>")
    return "".join(toc_parts)


# ──────────────────────────────────────────────
# Author resolver
# ──────────────────────────────────────────────
def load_authors():
    """Load author data from corp-web-contents layout/ja/author.json"""
    raw = gh_content("layout/ja/author.json")
    if not raw:
        return {}
    authors = json.loads(raw)
    return {a["id"]: a for a in authors}


def resolve_author(author_id, authors):
    """Build author dict for whitepaper-data.js format."""
    if isinstance(author_id, list):
        names = []
        first = None
        for aid in author_id:
            a = authors.get(aid)
            if a:
                names.append(a["name"])
                if first is None:
                    first = a
        if not first:
            return _default_author()
        obj = _build_author(first)
        obj["name"] = " / ".join(names)
        return obj

    a = authors.get(str(author_id))
    if not a:
        return _default_author()
    return _build_author(a)


def _build_author(a):
    author_id = a.get("id", "")
    if author_id == "querypie":
        logo = blob_url("public/querypie-company/icon/qp-logo-icon.png")
        avatar = logo if logo else "/assets/images/07-blog/author-querypie.png"
    else:
        # Use local assets path for author images (downloaded to /assets/images/07-blog/)
        avatar = f"/assets/images/07-blog/author-{author_id}.png" if author_id else ""

    desc = a.get("description", {})
    bio = desc.get("ja", "") if isinstance(desc, dict) else str(desc)
    bio = bio.replace('"', '\\"').replace("\n", " ").strip()

    sns = []
    for u in a.get("urls", []):
        sns.append({"type": u.get("type", "linkedin"), "url": u.get("url", "")})

    return {"name": a.get("name", ""), "title": a.get("position", ""), "bio": bio, "avatar": avatar, "sns": sns}


def _default_author():
    logo = blob_url("public/querypie-company/icon/qp-logo-icon.png")
    return {
        "name": "QueryPie AI編集部",
        "title": "",
        "bio": "QueryPie AI編集部は、企業のAI活用とデータ統制の最前線を追うコンテンツチームです。AIエージェント・アクセス管理・コンプライアンスなど、CxOと実務担当者が「今、判断に必要な情報」を、最新の調査データと業界事例をもとにお届けします。",
        "avatar": logo if logo else "/assets/images/07-blog/author-querypie.png",
        "sns": []
    }


# ──────────────────────────────────────────────
# Date formatter
# ──────────────────────────────────────────────
def format_date_ja(date_str):
    """'2025-05-28' → '2025年5月28日'"""
    try:
        dt = datetime.strptime(date_str.strip(), "%Y-%m-%d")
        return f"{dt.year}年{dt.month}月{dt.day}日"
    except Exception:
        return date_str


# ──────────────────────────────────────────────
# Image path mapper
# ──────────────────────────────────────────────
def image_path(og_image):
    """
    'public/white-paper/wp-thumb-26.png' → '/assets/images/07-blog/wp-thumb-26.png'
    'public/blog/b-thumb-1.png'          → '/assets/images/07-blog/b-thumb-1.png'
    """
    if not og_image:
        return ""
    filename = og_image.split("/")[-1]
    return f"/assets/images/07-blog/{filename}"


# ──────────────────────────────────────────────
# Whitepaper generator
# ──────────────────────────────────────────────
def generate_whitepaper_data(authors):
    """Fetch all whitepaper MDX and build WHITEPAPER_DATA object."""
    all_paths = gh_tree("pages/features/documentation/white-paper")
    mdx_paths = [p for p in all_paths if p.endswith("ja/content.mdx")]

    print(f"  Found {len(mdx_paths)} whitepaper MDX files")

    entries = {}
    for path in sorted(mdx_paths):
        # Extract GitHub numeric ID from path
        parts = path.split("/")
        try:
            gh_id = int(parts[parts.index("white-paper") + 1])
        except (ValueError, IndexError):
            continue

        raw = gh_content(path)
        if not raw:
            continue

        meta, body = parse_frontmatter(raw)
        if not meta.get("title"):
            continue

        html = mdx_to_html(body)
        toc = extract_toc(html)
        author_id = meta.get("author", "querypie")
        author = resolve_author(author_id, authors)

        # coverImage for download page (ogImage)
        og = meta.get("ogImage", "")
        cover_img = image_path(og)

        entries[gh_id] = {
            "github_id": gh_id,
            "title": meta.get("title", ""),
            "description": meta.get("description", ""),
            "date": format_date_ja(meta.get("date", "")),
            "image": cover_img,
            "coverImage": cover_img,
            "category": "ホワイトペーパー",
            "author": author,
            "toc": toc,
            "content": html,
        }
        print(f"    ✓ WP {gh_id}: {meta.get('title','')[:40]}")

    # Sort by date descending, assign sequential IDs starting from 1
    sorted_entries = sorted(entries.values(), key=lambda x: x.get("date", ""), reverse=True)
    result = {}
    for idx, entry in enumerate(sorted_entries, start=1):
        e = dict(entry)
        e.pop("github_id", None)
        result[str(idx)] = e

    return result


# ──────────────────────────────────────────────
# Blog generator
# ──────────────────────────────────────────────
def generate_blog_data(authors):
    """Fetch all blog MDX and build BLOG_DATA object."""
    all_paths = gh_tree("pages/features/documentation/blog")
    mdx_paths = [p for p in all_paths if p.endswith("ja/content.mdx")]

    print(f"  Found {len(mdx_paths)} blog MDX files")

    entries = {}
    for path in sorted(mdx_paths):
        parts = path.split("/")
        try:
            gh_id = int(parts[parts.index("blog") + 1])
        except (ValueError, IndexError):
            continue

        raw = gh_content(path)
        if not raw:
            continue

        meta, body = parse_frontmatter(raw)
        if not meta.get("title"):
            continue

        html = mdx_to_html(body)
        author_id = meta.get("author", "querypie")
        author = resolve_author(author_id, authors)

        og = meta.get("ogImage", "")
        img = image_path(og)

        entries[gh_id] = {
            "github_id": gh_id,
            "title": meta.get("title", ""),
            "description": meta.get("description", ""),
            "date": format_date_ja(meta.get("date", "")),
            "image": img,
            "category": "ブログ",
            "author": author,
            "content": html,
        }
        print(f"    ✓ Blog {gh_id}: {meta.get('title','')[:40]}")

    sorted_entries = sorted(entries.values(), key=lambda x: x.get("date", ""), reverse=True)
    result = {}
    for idx, entry in enumerate(sorted_entries, start=1):
        e = dict(entry)
        e.pop("github_id", None)
        result[str(idx)] = e

    return result


# ──────────────────────────────────────────────
# JS file writer
# ──────────────────────────────────────────────
def write_js_file(var_name, data, output_path):
    """Write data as a JS const variable."""

    def to_js_value(v, indent=0):
        pad = "  " * indent
        if isinstance(v, dict):
            lines = ["{"]
            items = list(v.items())
            for i, (k, val) in enumerate(items):
                comma = "," if i < len(items) - 1 else ""
                lines.append(f'{pad}  "{k}": {to_js_value(val, indent+1)}{comma}')
            lines.append(pad + "}")
            return "\n".join(lines)
        elif isinstance(v, list):
            if not v:
                return "[]"
            items_js = [to_js_value(item, indent+1) for item in v]
            return "[" + ", ".join(items_js) + "]"
        elif isinstance(v, str):
            # Use template literal for content/toc fields (may contain backticks escaped)
            if "\n" in v or len(v) > 200:
                escaped = v.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
                return f"`{escaped}`"
            else:
                escaped = v.replace("\\", "\\\\").replace('"', '\\"')
                return f'"{escaped}"'
        elif isinstance(v, bool):
            return "true" if v else "false"
        elif v is None:
            return "null"
        else:
            return str(v)

    js = f"const {var_name} = {to_js_value(data)};\n"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js)
    size_kb = os.path.getsize(output_path) // 1024
    print(f"  → Wrote {output_path} ({size_kb}KB)")


# ──────────────────────────────────────────────
# Existing data reader (for append mode)
# ──────────────────────────────────────────────
def _tracking_path(js_path):
    """Return path to sidecar tracking JSON (e.g. whitepaper-ids.json)."""
    base = os.path.splitext(js_path)[0]  # strip .js
    return base.replace("-data", "-ids") + ".json"


def read_existing_github_ids(js_path, thumb_prefix):
    """
    기존 JS 파일에서 이미 등록된 GitHub ID를 추출한다.
    1) 사이드카 tracking JSON 우선 (비표준 이미지명 대응)
    2) 없으면 thumb 파일명에서 추출 (기존 방식)
    """
    if not os.path.exists(js_path):
        return set(), 0  # (existing_gh_ids, max_local_id)

    with open(js_path, encoding="utf-8") as f:
        src = f.read()

    # 1. Read sidecar tracking file if available
    tracking = _tracking_path(js_path)
    if os.path.exists(tracking):
        with open(tracking, encoding="utf-8") as f:
            data = json.load(f)
        gh_ids = set(data.get("tracked_ids", []))
    else:
        # 2. Fallback: extract GitHub IDs from thumb filenames
        pattern = rf'{re.escape(thumb_prefix)}-(\d+)(?:-[a-z]+)?\.(?:png|jpg)'
        gh_ids = set(int(m) for m in re.findall(pattern, src))

    # Find max local sequential ID
    local_ids = [int(m) for m in re.findall(r'"(\d+)":\s*\{', src)]
    max_id = max(local_ids) if local_ids else 0

    return gh_ids, max_id


def update_tracking_file(js_path, new_gh_ids):
    """Add new GitHub IDs to the sidecar tracking JSON."""
    tracking = _tracking_path(js_path)
    if os.path.exists(tracking):
        with open(tracking, encoding="utf-8") as f:
            data = json.load(f)
        existing = set(data.get("tracked_ids", []))
    else:
        existing = set()
    combined = sorted(existing | set(new_gh_ids))
    with open(tracking, "w", encoding="utf-8") as f:
        json.dump({"tracked_ids": combined}, f)
    print(f"  → Updated tracking: {len(combined)} total GitHub IDs")


def append_new_entries(js_path, new_entries, next_id):
    """
    기존 JS 파일 끝에 새 항목을 삽입한다.
    new_entries: list of dicts (github_id 포함)
    """
    if not new_entries:
        return

    with open(js_path, encoding="utf-8") as f:
        src = f.read()

    # Remove trailing }; and whitespace
    src = src.rstrip()
    if src.endswith("};"):
        src = src[:-2].rstrip()
    elif src.endswith("}"):
        src = src[:-1].rstrip()

    new_blocks = []
    for i, entry in enumerate(new_entries):
        local_id = next_id + i
        e = dict(entry)
        e.pop("github_id", None)
        new_blocks.append(f'  "{local_id}": {_dict_to_js(e, indent=1)}')

    src += ",\n" + ",\n".join(new_blocks) + "\n};\n"

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(src)

    print(f"  → Appended {len(new_entries)} new entries (IDs {next_id}~{next_id+len(new_entries)-1})")

    # Update sidecar tracking file with new GitHub IDs
    new_gh_ids = [e["github_id"] for e in new_entries if "github_id" in e]
    update_tracking_file(js_path, new_gh_ids)


def _dict_to_js(v, indent=0):
    """Convert Python dict/list/str to JS value string."""
    pad = "  " * indent
    if isinstance(v, dict):
        lines = ["{"]
        items = list(v.items())
        for i, (k, val) in enumerate(items):
            comma = "," if i < len(items) - 1 else ""
            lines.append(f'{pad}  "{k}": {_dict_to_js(val, indent+1)}{comma}')
        lines.append(pad + "}")
        return "\n".join(lines)
    elif isinstance(v, list):
        if not v:
            return "[]"
        return "[" + ", ".join(_dict_to_js(item, indent+1) for item in v) + "]"
    elif isinstance(v, str):
        if "\n" in v or len(v) > 200:
            escaped = v.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
            return f"`{escaped}`"
        else:
            escaped = v.replace("\\", "\\\\").replace('"', '\\"')
            return f'"{escaped}"'
    elif isinstance(v, bool):
        return "true" if v else "false"
    elif v is None:
        return "null"
    else:
        return str(v)


# ──────────────────────────────────────────────
# Append-only generators
# ──────────────────────────────────────────────
def append_new_whitepapers(authors, js_path):
    """GitHub에만 있고 로컬에 없는 화이트페이퍼만 추가."""
    existing_ids, max_local_id = read_existing_github_ids(js_path, "wp-thumb")
    print(f"  Existing: {len(existing_ids)} GitHub IDs already in local")

    all_paths = gh_tree("pages/features/documentation/white-paper")
    mdx_paths = [p for p in all_paths if p.endswith("ja/content.mdx")]

    new_entries_by_id = {}  # deduplicate by GitHub ID
    for path in sorted(mdx_paths):
        parts = path.split("/")
        try:
            gh_id = int(parts[parts.index("white-paper") + 1])
        except (ValueError, IndexError):
            continue

        if gh_id in existing_ids:
            print(f"    skip WP {gh_id} (already exists)")
            continue
        if gh_id in new_entries_by_id:
            print(f"    skip WP {gh_id} (duplicate path, already queued)")
            continue

        raw = gh_content(path)
        if not raw:
            continue

        meta, body = parse_frontmatter(raw)
        if not meta.get("title"):
            continue

        html = mdx_to_html(body)
        toc = extract_toc(html)
        author = resolve_author(meta.get("author", "querypie"), authors)
        og = meta.get("ogImage", "")
        cover_img = image_path(og)

        new_entries_by_id[gh_id] = {
            "github_id": gh_id,
            "title": meta.get("title", ""),
            "description": meta.get("description", ""),
            "date": format_date_ja(meta.get("date", "")),
            "image": cover_img,
            "coverImage": cover_img,
            "category": "ホワイトペーパー",
            "author": author,
            "toc": toc,
            "content": html,
        }
        print(f"    + NEW WP {gh_id}: {meta.get('title','')[:45]}")

    new_entries = list(new_entries_by_id.values())
    # Sort new entries by date desc before appending
    new_entries.sort(key=lambda x: x.get("date", ""), reverse=True)
    append_new_entries(js_path, new_entries, max_local_id + 1)
    return len(new_entries)


def append_new_blogs(authors, js_path):
    """GitHub에만 있고 로컬에 없는 블로그만 추가."""
    existing_ids, max_local_id = read_existing_github_ids(js_path, "b-thumb")
    print(f"  Existing: {len(existing_ids)} GitHub IDs already in local")

    all_paths = gh_tree("pages/features/documentation/blog")
    mdx_paths = [p for p in all_paths if p.endswith("ja/content.mdx")]

    new_entries_by_id = {}
    for path in sorted(mdx_paths):
        parts = path.split("/")
        try:
            gh_id = int(parts[parts.index("blog") + 1])
        except (ValueError, IndexError):
            continue

        if gh_id in existing_ids:
            print(f"    skip Blog {gh_id} (already exists)")
            continue
        if gh_id in new_entries_by_id:
            print(f"    skip Blog {gh_id} (duplicate path, already queued)")
            continue

        raw = gh_content(path)
        if not raw:
            continue

        meta, body = parse_frontmatter(raw)
        if not meta.get("title"):
            continue

        html = mdx_to_html(body)
        author = resolve_author(meta.get("author", "querypie"), authors)
        img = image_path(meta.get("ogImage", ""))

        new_entries_by_id[gh_id] = {
            "github_id": gh_id,
            "title": meta.get("title", ""),
            "description": meta.get("description", ""),
            "date": format_date_ja(meta.get("date", "")),
            "image": img,
            "category": "ブログ",
            "author": author,
            "content": html,
        }
        print(f"    + NEW Blog {gh_id}: {meta.get('title','')[:45]}")

    new_entries = list(new_entries_by_id.values())
    new_entries.sort(key=lambda x: x.get("date", ""), reverse=True)
    append_new_entries(js_path, new_entries, max_local_id + 1)
    return len(new_entries)


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
def main():
    import sys
    full_regen = "--regen" in sys.argv

    print(f"[generate_content_data] repo={CONTENTS_REPO} branch={BRANCH}")

    print("\n1. Loading author data...")
    authors = load_authors()
    print(f"   {len(authors)} authors loaded")

    wp_path   = os.path.join(OUTPUT_DIR, "whitepaper-data.js")
    blog_path = os.path.join(OUTPUT_DIR, "blog-data.js")

    if full_regen:
        print("\n[--regen] Full regeneration mode")
        print("\n2. Generating all whitepapers...")
        wp_data = generate_whitepaper_data(authors)
        write_js_file("WHITEPAPER_DATA", wp_data, wp_path)
        # Re-read tree to get GitHub IDs for tracking file
        all_paths = gh_tree("pages/features/documentation/white-paper")
        mdx_paths = [p for p in all_paths if p.endswith("ja/content.mdx")]
        gh_ids = []
        for path in mdx_paths:
            parts = path.split("/")
            try:
                gh_ids.append(int(parts[parts.index("white-paper") + 1]))
            except (ValueError, IndexError):
                pass
        update_tracking_file(wp_path, gh_ids)

        print("\n3. Generating all blog posts...")
        blog_data = generate_blog_data(authors)
        write_js_file("BLOG_DATA", blog_data, blog_path)
        blog_paths = gh_tree("pages/features/documentation/blog")
        blog_mdx = [p for p in blog_paths if p.endswith("ja/content.mdx")]
        blog_gh_ids = []
        for path in blog_mdx:
            parts = path.split("/")
            try:
                blog_gh_ids.append(int(parts[parts.index("blog") + 1]))
            except (ValueError, IndexError):
                pass
        update_tracking_file(blog_path, blog_gh_ids)
        print("\n✅ Full regeneration complete.")
    else:
        print("\n2. Checking for new whitepapers...")
        wp_added = append_new_whitepapers(authors, wp_path)
        print(f"   Added: {wp_added} new whitepaper(s)")

        print("\n3. Checking for new blog posts...")
        blog_added = append_new_blogs(authors, blog_path)
        print(f"   Added: {blog_added} new blog post(s)")

        if wp_added == 0 and blog_added == 0:
            print("\n✅ No new content found. Everything is up to date.")
        else:
            print(f"\n✅ Done! Added {wp_added} WP + {blog_added} blog entries.")


if __name__ == "__main__":
    main()
