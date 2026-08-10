#!/usr/bin/env python3
"""Compare the built Astro site (dist/) against the live site (https://www.iam314.com).

Compares per page: title, meta tags, canonical, JSON-LD, headings, visible text,
and verifies every asset referenced by the new build exists in dist/ (i.e. will
be deployed). Visual differences are out of scope (eyeball those later).

Usage:  python3 scripts/compare-live.py [url-to-compare]
"""
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from html.parser import HTMLParser
from difflib import unified_diff

SITE = "https://www.iam314.com"
DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
PUBLIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")

UA = "Mozilla/5.0 (compatible; iam314-astro-compare/1.0)"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        data = r.read()
        return data.decode("utf-8", errors="replace")


class Extractor(HTMLParser):
    """Pull title, meta, headings, visible text, links and assets out of HTML."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = None
        self.meta = {}          # (kind, key) -> content ; kind in name|property|http-equiv|charset
        self.canonical = None
        self.headings = []      # ("h2", "text")
        self.text_parts = []
        self.ld_json = []
        self.links = []         # hrefs
        self.assets = []        # srcs (img/script) + link hrefs for css
        self._in_body = False
        self._in_title = False
        self._in_script = False
        self._in_style = False
        self._cur_heading = None
        self._buf = []
        self._cur_ld = None
        self._depth = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "body":
            self._in_body = True
            return
        if tag == "title":
            self._in_title = True
            self._buf = []
            return
        if tag == "script":
            if a.get("type", "").strip().lower() == "application/ld+json":
                self._cur_ld = []
            self._in_script = True
            return
        if tag == "style":
            self._in_style = True
            return
        if tag == "meta":
            if "charset" in a:
                self.meta[("charset", "")] = a.get("charset", "")
            elif a.get("http-equiv"):
                self.meta[("http-equiv", a["http-equiv"].lower())] = a.get("content", "")
            elif a.get("name"):
                self.meta[("name", a["name"].lower())] = a.get("content", "")
            elif a.get("property"):
                self.meta[("property", a["property"].lower())] = a.get("content", "")
            return
        if tag == "link" and a.get("rel", "").strip().lower() == "canonical":
            self.canonical = a.get("href")
            self.links.append(a.get("href", ""))
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._cur_heading = tag
            self._buf = []
            return
        if tag in ("a", "link") and a.get("href"):
            self.links.append(a.get("href", ""))
            if tag == "link" and a.get("rel", "").strip().lower() in ("stylesheet", "icon", "apple-touch-icon", "preload"):
                self.assets.append(a.get("href", ""))
            return
        if tag == "img" and a.get("src"):
            self.assets.append(a.get("src", ""))
        if tag == "script" and a.get("src"):
            self.assets.append(a.get("src", ""))

    def handle_endtag(self, tag):
        if tag == "title" and self._in_title:
            self.title = " ".join("".join(self._buf).split())
            self._in_title = False
        elif tag == "script":
            if self._cur_ld is not None:
                self.ld_json.append("".join(self._cur_ld))
                self._cur_ld = None
            self._in_script = False
        elif tag == "style":
            self._in_style = False
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self._cur_heading == tag:
            text = " ".join("".join(self._buf).split())
            if text:
                self.headings.append((tag, text))
            self._cur_heading = None
        elif tag == "body":
            self._in_body = False

    def handle_data(self, data):
        if self._in_title or self._cur_heading is not None:
            self._buf.append(data)
        elif self._cur_ld is not None:
            self._cur_ld.append(data)
        elif self._in_body and not self._in_script and not self._in_style:
            self.text_parts.append(data)


def extract(html):
    p = Extractor()
    p.feed(html)
    text = " ".join(" ".join(p.text_parts).split())
    return p, text


def dist_file_for(path):
    if path in ("", "/"):
        return os.path.join(DIST, "index.html")
    rel = path.strip("/")
    for cand in (
        os.path.join(DIST, rel, "index.html"),
        os.path.join(DIST, rel + ".html"),
        os.path.join(DIST, rel),
    ):
        if os.path.isfile(cand):
            return cand
    return None


def asset_ok(path):
    if path.startswith(("http://", "https://", "//", "data:", "mailto:", "tel:", "#")):
        return True
    rel = path.lstrip("/").split("#", 1)[0].split("?", 1)[0]
    return os.path.isfile(os.path.join(DIST, rel)) or os.path.isfile(os.path.join(PUBLIC, rel))


def compare_page(url):
    path = url.replace(SITE, "")
    local = dist_file_for(path)
    if local is None:
        return ["SKIP", f"no dist file for {url}"]
    with open(local, encoding="utf-8") as f:
        local_html = f.read()

    try:
        live_html = fetch(url)
    except Exception as e:
        return ["ERROR", f"could not fetch {url}: {e}"]

    lp, ltext = extract(live_html)
    dp, dtext = extract(local_html)
    issues = []

    # title
    if (lp.title or "") != (dp.title or ""):
        issues.append(f"TITLE:\n  live: {lp.title!r}\n  dist: {dp.title!r}")

    # canonical
    if (lp.canonical or "") != (dp.canonical or ""):
        issues.append(f"CANONICAL:\n  live: {lp.canonical!r}\n  dist: {dp.canonical!r}")

    # meta
    lm, dm = lp.meta, dp.meta
    if lm != dm:
        only_live = [k for k in lm if k not in dm]
        only_dist = [k for k in dm if k not in lm]
        changed = [(k, lm[k], dm[k]) for k in lm if k in dm and lm[k] != dm[k]]
        bits = []
        if only_live:
            bits.append("only on live: " + ", ".join(f"{k}={lm[k]!r}" for k in sorted(only_live)))
        if only_dist:
            bits.append("only on dist: " + ", ".join(f"{k}={dm[k]!r}" for k in sorted(only_dist)))
        for k, a, b in changed:
            bits.append(f"{k}: live={a!r} dist={b!r}")
        issues.append("META:\n  " + "\n  ".join(bits))

    # JSON-LD
    def parse_ld(arr):
        out = []
        for s in arr:
            try:
                out.append(json.loads(s))
            except Exception:
                out.append(s)
        return out

    lld, dld = parse_ld(lp.ld_json), parse_ld(dp.ld_json)
    if lld != dld:
        issues.append(f"JSON-LD differs:\n  live: {json.dumps(lld, indent=1)[:800]}\n  dist: {json.dumps(dld, indent=1)[:800]}")

    # headings
    if lp.headings != dp.headings:
        lh = [f"{t} {x}" for t, x in lp.headings]
        dh = [f"{t} {x}" for t, x in dp.headings]
        issues.append("HEADINGS:\n  live: " + "\n  live: ".join(lh or ["(none)"]) + "\n  dist: " + "\n  dist: ".join(dh or ["(none)"]))

    # visible text
    if ltext != dtext:
        ld = list(ltext.split(" "))
        dd = list(dtext.split(" "))
        diff = list(unified_diff(ld, dd, "live", "dist", lineterm=""))[:24]
        issues.append("TEXT differs (first changes):\n  " + "\n  ".join(diff))

    # assets referenced by the new build must exist in dist/ (i.e. will deploy)
    missing = [a for a in sorted(set(dp.assets)) if not asset_ok(a)]
    if missing:
        issues.append("MISSING ASSETS in dist (will 404 after deploy):\n  " + "\n  ".join(missing))

    if not issues:
        return ["MATCH", ""]
    return ["DIFF", "\n".join(issues)]


def main():
    if len(sys.argv) > 1:
        urls = [SITE + sys.argv[1] if not sys.argv[1].startswith("http") else sys.argv[1]]
    else:
        smap = os.path.join(DIST, "sitemap-0.xml")
        with open(smap, encoding="utf-8") as f:
            urls = [u for u in re.findall(r"<loc>([^<]+)</loc>", f.read())]

    print(f"Comparing {len(urls)} page(s): dist/ vs {SITE}\n")
    stats = {"MATCH": 0, "DIFF": 0, "ERROR": 0, "SKIP": 0}
    for url in urls:
        status, detail = compare_page(url)
        stats[status] += 1
        label = url.replace(SITE, "") or "/"
        if status == "MATCH":
            print(f"  ✓  {label}")
        else:
            print(f"  ✗  {label}  [{status}]")
        if detail:
            for line in detail.splitlines():
                print(f"     {line}")
            print()
        time.sleep(0.25)

    print("\nSUMMARY:", ", ".join(f"{k}={v}" for k, v in stats.items()))
    if stats["DIFF"]:
        print("Pages with differences are marked ✗ above.")


if __name__ == "__main__":
    main()
