#!/usr/bin/env python3
"""Submit URLs to IndexNow (Bing etc.). Stdlib only.

  python3 scripts/indexnow.py URL [URL...]
  python3 scripts/indexnow.py --all                  # every <loc> in sitemap.xml
  python3 scripts/indexnow.py --changed OLD..NEW     # changed .html files -> canonical URLs
  add --dry-run to print URLs without sending.

--changed skips noindex pages and meta-refresh redirect stubs, and maps files to
their <link rel="canonical"> (same source of truth as build-sitemap.py), falling
back to index.html -> directory URL.
"""
import json, os, re, subprocess, sys, urllib.request
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOST = "www.go-go-gaia.com"
BASE = "https://" + HOST
KEY = "7ee6eaca09e1360cba21042029b816be"
ENDPOINT = "https://api.indexnow.org/indexnow"
SKIP_DIRS = {"docs", "docs-private", "tests", "scripts", "frames", "node_modules", ".git", ".github"}
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"

def sitemap_urls():
    return [u.find(NS + "loc").text.strip() for u in ET.parse(os.path.join(ROOT, "sitemap.xml")).getroot()]

def file_to_url(path):
    """Return canonical URL for an .html file, or None if it should not be submitted."""
    if path == "404.html" or path.split("/")[0] in SKIP_DIRS or not path.endswith(".html"):
        return None
    full = os.path.join(ROOT, path)
    if not os.path.exists(full):
        return None  # deleted
    head = open(full, encoding="utf-8", errors="replace").read().split("</head>")[0]
    if re.search(r'<meta[^>]+name=["\']robots["\'][^>]*noindex', head, re.I) or \
       re.search(r'<meta[^>]+content=["\'][^"\']*noindex[^"\']*["\'][^>]*name=["\']robots', head, re.I):
        return None
    if re.search(r'<meta[^>]+http-equiv=["\']refresh["\']', head, re.I):
        return None
    m = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]*>', head, re.I)
    h = re.search(r'href=["\']([^"\']+)["\']', m.group(0)) if m else None
    if h:
        return h.group(1) if h.group(1).startswith(BASE) else None
    if path == "index.html":
        return BASE + "/"
    if path.endswith("/index.html"):
        return BASE + "/" + path[:-len("index.html")]
    return BASE + "/" + path

def changed_urls(rng):
    out = subprocess.run(["git", "-C", ROOT, "diff", "--name-only", "--diff-filter=ACMR", rng, "--", "*.html"],
                         capture_output=True, text=True, check=True).stdout.split()
    urls = []
    for f in out:
        u = file_to_url(f)
        if u and u not in urls:
            urls.append(u)
    return urls

def main(argv):
    dry = "--dry-run" in argv
    args = [a for a in argv if a != "--dry-run"]
    if args[:1] == ["--all"]:
        urls = sitemap_urls()
    elif args[:1] == ["--changed"] and len(args) == 2:
        urls = changed_urls(args[1])
    elif args and not args[0].startswith("--"):
        urls = args
    else:
        print(__doc__); return 2
    print(f"{len(urls)} URL(s)")
    if dry:
        print("\n".join(urls)); return 0
    if not urls:
        return 0
    for i in range(0, len(urls), 10000):
        body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"{BASE}/{KEY}.txt",
                           "urlList": urls[i:i + 10000]}).encode()
        req = urllib.request.Request(ENDPOINT, body, {"Content-Type": "application/json; charset=utf-8"})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                print("IndexNow response:", r.status)
        except urllib.error.HTTPError as e:
            print("WARNING IndexNow response:", e.code, e.read()[:200])
        except Exception as e:
            print("WARNING IndexNow failed:", e)
    return 0  # never fail the build

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
