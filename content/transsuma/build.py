#!/usr/bin/env python3
"""Build & validate transsuma.com auto articles.

Reads articles/*.md (YAML frontmatter + Markdown body), validates them, renders
html/<slug>.html, draws img/<slug>.png (1200x675 cover) when missing, and writes
index.json, which the WordPress plugin "TLS Auto Articles" polls every hour.

Usage:  python3 build.py            # build everything, exit 1 on any error
        python3 build.py --check    # validate only
Needs:  pip install markdown pyyaml pillow
"""
import datetime as dt
import html
import json
import re
import sys
import textwrap
from pathlib import Path

import markdown
import yaml
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
ART, OUT_HTML, OUT_IMG = ROOT / "articles", ROOT / "html", ROOT / "img"
CFG = json.loads((ROOT / "site.json").read_text(encoding="utf-8"))
SITE = CFG["site"]
WIB = dt.timezone(dt.timedelta(hours=7))
CATEGORIES = set(CFG["categories"])
REQUIRED = ["title", "slug", "publish_at", "meta_title", "meta_description",
            "focus_keyword", "categories", "tags", "excerpt", "image_alt", "faq"]
CTA = (ROOT / "cta.html").read_text(encoding="utf-8")


def slug_ok(s):
    return bool(re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", s or ""))


def existing_slugs():
    out = {}
    for line in (ROOT / "existing-posts.txt").read_text().splitlines():
        if line.startswith("http"):
            url = line.split("|")[0].strip()
            out[url.rstrip("/").rsplit("/", 1)[-1]] = url
    return out


def parse(path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    if not m:
        raise ValueError("frontmatter --- ... --- tidak ditemukan")
    meta = yaml.safe_load(m.group(1)) or {}
    return meta, m.group(2).strip()


def words(text):
    return re.findall(r"[\wÀ-ÿ’'-]+", re.sub(r"<[^>]+>|[#*_>`|\[\]()]", " ", text))


def validate(path, meta, body, seen, existing):
    e = []
    for k in REQUIRED:
        if meta.get(k) in (None, "", []):
            e.append(f"field wajib kosong: {k}")
    if e:
        return e
    slug = meta["slug"]
    if not slug_ok(slug):
        e.append("slug harus kebab-case huruf kecil")
    if slug in existing:
        e.append("slug sudah dipakai artikel lama")
    if slug in seen and seen[slug] != path.name:
        e.append(f"slug duplikat dengan {seen[slug]}")
    if not path.name.endswith(f"-{slug}.md"):
        e.append("nama file harus YYYY-MM-DD-HHMM-<slug>.md")
    try:
        dt.datetime.strptime(str(meta["publish_at"]), "%Y-%m-%d %H:%M")
    except ValueError:
        e.append('publish_at harus "YYYY-MM-DD HH:MM" (WIB)')
    if not 40 <= len(meta["title"]) <= 75:
        e.append(f"title {len(meta['title'])} karakter (40–75)")
    if len(meta["meta_title"]) > 60:
        e.append(f"meta_title {len(meta['meta_title'])} karakter (maks 60)")
    if not 130 <= len(meta["meta_description"]) <= 160:
        e.append(f"meta_description {len(meta['meta_description'])} karakter (130–160)")
    kw = str(meta["focus_keyword"]).lower()
    if kw in {str(m.get('focus_keyword', '')).lower() for p, m in seen.get("_meta", {}).items() if p != path.name}:
        e.append("focus_keyword sudah dipakai artikel lain")
    if kw not in meta["title"].lower():
        e.append("focus_keyword tidak ada di title")
    if kw not in meta["meta_description"].lower():
        e.append("focus_keyword tidak ada di meta_description")
    first = " ".join(words(re.sub(r"^>.*$", "", body, flags=re.M))[:110]).lower()
    if kw not in first:
        e.append("focus_keyword tidak muncul di 100 kata pertama (di luar epigraf)")
    bad = set(meta["categories"]) - CATEGORIES
    if bad:
        e.append(f"kategori tidak dikenal: {sorted(bad)}")
    n = len(words(body))
    if n < 1100:
        e.append(f"isi hanya {n} kata (min 1.100)")
    if len(re.findall(r"^## ", body, re.M)) < 4:
        e.append("minimal 4 subjudul ##")
    if re.search(r"^# ", body, re.M):
        e.append("jangan pakai # (H1) di isi; judul sudah jadi H1")
    faq = meta["faq"]
    if not (isinstance(faq, list) and 3 <= len(faq) <= 6 and all(isinstance(f, dict) and f.get("q") and f.get("a") for f in faq)):
        e.append("faq harus 3–6 item {q, a}")
    if SITE + "/" not in body:
        e.append(f"minimal 1 internal link ke {SITE}")
    return e


def render(meta, body):
    md = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists"])
    out = md.convert(body)
    out = out.replace("<table>", '<table class="auto-table" style="width:100%;border-collapse:collapse">')
    faq = "".join(
        f"<h3>{html.escape(f['q'])}</h3>\n<p>{html.escape(f['a'])}</p>\n" for f in meta["faq"]
    )
    out += f"\n<h2>FAQ: {html.escape(meta['focus_keyword'].capitalize())}</h2>\n{faq}"
    return out + CTA


def font(size, bold=True):
    names = ["DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"]
    for base in ["/usr/share/fonts/truetype/dejavu/", "/usr/share/fonts/dejavu/", ""]:
        for n in names:
            try:
                return ImageFont.truetype(base + n, size)
            except OSError:
                pass
    return ImageFont.load_default()


def cover(meta, dest):
    W, H = 1200, 675
    navy, yellow, white = tuple(CFG["cover"]["bg"]), tuple(CFG["cover"]["accent"]), (255, 255, 255)
    line = tuple(CFG["cover"].get("line", [30, 52, 90]))
    im = Image.new("RGB", (W, H), navy)
    d = ImageDraw.Draw(im)
    # steel-truss motif on the right
    for i in range(0, 9):
        x = 760 + i * 60
        d.line([(x, 0), (x + 120, H)], fill=line, width=3)
        d.line([(x + 120, 0), (x, H)], fill=line, width=3)
    d.rectangle([0, 0, 18, H], fill=yellow)
    cat = meta["categories"][0].upper()
    f_cat, f_t, f_s = font(26), font(56), font(24, bold=False)
    d.text((70, 60), cat, font=f_cat, fill=yellow)
    lines = textwrap.wrap(meta["title"], 30)[:5]
    y = 120
    for ln in lines:
        d.text((70, y), ln, font=f_t, fill=white)
        y += 72
    d.rectangle([70, H - 120, 190, H - 114], fill=yellow)
    d.text((70, H - 96), CFG["cover"]["brand_line"], font=f_s, fill=(210, 218, 230))
    d.text((70, H - 62), CFG["cover"]["domain"], font=font(24), fill=yellow)
    im.save(dest, optimize=True)


def main():
    check_only = "--check" in sys.argv
    existing = existing_slugs()
    files = sorted(ART.glob("*.md"))
    seen, metas, errors, items = {}, {}, {}, []
    parsed = {}
    for p in files:
        try:
            meta, body = parse(p)
        except Exception as ex:  # noqa: BLE001
            errors[p.name] = [str(ex)]
            continue
        parsed[p] = (meta, body)
        metas[p.name] = meta
    seen["_meta"] = metas
    for p, (meta, body) in parsed.items():
        if meta.get("slug"):
            seen.setdefault(meta["slug"], p.name)
    for p, (meta, body) in parsed.items():
        e = validate(p, meta, body, seen, existing)
        if e:
            errors[p.name] = e
    if errors:
        for name, e in errors.items():
            print(f"✗ {name}")
            for x in e:
                print(f"   - {x}")
        sys.exit(1)
    if check_only:
        print(f"✓ {len(parsed)} artikel valid")
        return
    OUT_HTML.mkdir(exist_ok=True)
    OUT_IMG.mkdir(exist_ok=True)
    for p, (meta, body) in parsed.items():
        slug = meta["slug"]
        (OUT_HTML / f"{slug}.html").write_text(render(meta, body), encoding="utf-8")
        img = OUT_IMG / f"{slug}.png"
        if not img.exists():
            cover(meta, img)
        local = dt.datetime.strptime(str(meta["publish_at"]), "%Y-%m-%d %H:%M").replace(tzinfo=WIB)
        faq = [{"q": f["q"], "a": f["a"]} for f in meta["faq"]]
        items.append({
            "id": slug, "slug": slug, "title": meta["title"],
            "publish_at_wib": local.strftime("%Y-%m-%d %H:%M"),
            "publish_at_utc": local.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "url": f"{SITE}/{slug}/" if CFG.get("permalink") == "slug" else f"{SITE}/{local:%Y/%m/%d}/{slug}/",
            "html": f"html/{slug}.html", "image": f"img/{slug}.png",
            "image_alt": meta["image_alt"], "excerpt": meta["excerpt"],
            "meta_title": meta["meta_title"], "meta_description": meta["meta_description"],
            "focus_keyword": meta["focus_keyword"],
            "categories": meta["categories"], "tags": meta["tags"], "faq": faq,
        })
    items.sort(key=lambda x: x["publish_at_utc"])
    (ROOT / "index.json").write_text(json.dumps(
        {"version": 1, "generated": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "items": items},
        ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"✓ build selesai: {len(items)} artikel di index.json")


if __name__ == "__main__":
    main()
