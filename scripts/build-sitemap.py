#!/usr/bin/env python3
"""Regenerate sitemap.xml. Run from repo root: python3 scripts/build-sitemap.py

- URL = the page's <link rel="canonical"> (pages without one are skipped with a warning)
- skips docs/ docs-private/ tests/ scripts/ frames/ node_modules/ 404.html and noindex pages
- lastmod = last commit date ON main touching the file, ignoring sitewide sweep commits
  (> SWEEP html files); falls back to the file's oldest sweep commit, then today
- changefreq/priority carried over from the existing sitemap by URL; new URLs get
  defaults by section. Existing order is preserved; new URLs go after the last URL
  of the same section (first path segment), else at the end.
"""
import os, re, subprocess, sys, datetime, xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
BASE = "https://www.go-go-gaia.com"
SKIP_DIRS = {"docs", "docs-private", "tests", "scripts", "frames", "node_modules", ".git"}
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
today = datetime.date.today().isoformat()

old = {}
order = []
if os.path.exists("sitemap.xml"):
    for u in ET.parse("sitemap.xml").getroot():
        loc = u.find(NS + "loc").text.strip()
        g = lambda t: (u.find(NS + t).text if u.find(NS + t) is not None else None)
        old[loc] = (g("changefreq"), g("priority"))
        order.append(loc)

def section(url):
    p = url[len(BASE):].strip("/").split("/")
    return p[0] if len(p) > 1 else ""

def defaults(url):
    s = section(url)
    return ("monthly", "0.8" if s in ("for-professionals",) else "0.7")

pages = {}  # url -> file
for dp, dn, fn in os.walk("."):
    dn[:] = [d for d in dn if d not in SKIP_DIRS and not d.startswith(".")]
    for f in fn:
        if not f.endswith(".html"):
            continue
        path = os.path.relpath(os.path.join(dp, f), ".")
        if path == "404.html":
            continue
        head = open(path, encoding="utf-8", errors="replace").read().split("</head>")[0]
        if re.search(r'<meta[^>]+name=["\']robots["\'][^>]*noindex', head, re.I) or \
           re.search(r'<meta[^>]+content=["\'][^"\']*noindex[^"\']*["\'][^>]*name=["\']robots', head, re.I):
            continue
        m = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]*>', head, re.I)
        h = re.search(r'href=["\']([^"\']+)["\']', m.group(0)) if m else None
        if not h:
            print("WARN no canonical:", path, file=sys.stderr); continue
        url = h.group(1)
        if not url.startswith(BASE):
            print("WARN off-site canonical:", path, url, file=sys.stderr); continue
        if url in pages:
            print("WARN duplicate canonical:", path, url, file=sys.stderr); continue
        pages[url] = path

SWEEP = 40  # commits touching more than this many .html files are sitewide sweeps; ignored for lastmod
_last = {}
_created = {}
def _load_history():
    log = subprocess.run(["git", "log", "main", "--format=@@%cs", "--name-only", "--", "*.html"],
                         capture_output=True, text=True).stdout
    for block in log.split("@@")[1:]:
        lines = block.strip().split("\n")
        files = [l for l in lines[1:] if l.endswith(".html")]
        if len(files) > SWEEP:
            for f in files:
                _created[f] = lines[0]  # oldest wins (log is newest-first)
            continue
        for f in files:  # newest commit first, so first hit wins
            _last.setdefault(f, lines[0])
_load_history()

def lastmod(path):
    return _last.get(path) or _created.get(path) or today

final = [u for u in order if u in pages]
for u in sorted(u for u in pages if u not in old):
    s = section(u)
    idx = max((i for i, x in enumerate(final) if section(x) == s), default=len(final) - 1)
    final.insert(idx + 1, u)

out = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in final:
    cf, pr = old.get(u) or defaults(u)
    cf = cf or "monthly"; pr = pr or "0.7"
    out += ["    <url>", f"        <loc>{u}</loc>",
            f"        <lastmod>{lastmod(pages[u])}</lastmod>",
            f"        <changefreq>{cf}</changefreq>", f"        <priority>{pr}</priority>",
            "    </url>"]
out.append("</urlset>")
open("sitemap.xml", "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"wrote {len(final)} URLs")
