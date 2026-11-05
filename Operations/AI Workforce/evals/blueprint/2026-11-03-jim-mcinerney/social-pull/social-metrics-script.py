import json, sys, statistics, datetime as dt
sys.stdout.reconfigure(encoding="utf-8")
D = sys.argv[1]
CAP = dt.datetime(2026, 10, 16, tzinfo=dt.timezone.utc)
W0 = CAP - dt.timedelta(days=90)

def load(n):
    return json.load(open(f"{D}/social-pull/{n}-raw-2026-10-16.json", encoding="utf-8"))["items"]

def p(ts):
    if isinstance(ts, (int, float)):
        return dt.datetime.fromtimestamp(ts if ts < 1e11 else ts / 1000, dt.timezone.utc)
    return dt.datetime.fromisoformat(str(ts).replace("Z", "+00:00"))

def clip(s, n=150):
    return (s or "").replace("\n", " ").strip()[:n]

def report(name, rows):
    # rows: dict(date, fmt, owner, eng, views, url, text)
    rows.sort(key=lambda r: r["date"], reverse=True)
    win = [r for r in rows if r["date"] >= W0]
    use = win if len(win) >= 50 else rows[:50]
    print(f"\n######## {name}: total {len(rows)}, in 90d {len(win)}, analysis set {len(use)} "
          f"({use[-1]['date'].date()} to {use[0]['date'].date()})")
    if use:
        span_days = max((use[0]['date'] - use[-1]['date']).days, 1)
        print(f"posts/week over analysis set: {len(use) / (span_days / 7):.2f} (span {span_days} d); 90d posts/week {len(win) / (90/7):.2f}")
        ds = sorted(r["date"] for r in use)
        gaps = [((b - a).days, a.date(), b.date()) for a, b in zip(ds, ds[1:]) if (b - a).days > 14]
        print("gaps > 14 days:", gaps)
        fm = {}
        for r in use: fm[r["fmt"]] = fm.get(r["fmt"], 0) + 1
        print("format mix:", fm)
        ow = {}
        for r in use: ow[r["owner"]] = ow.get(r["owner"], 0) + 1
        print("owner mix:", ow)
        print("median engagement (likes+comments+shares):", statistics.median(r["eng"] for r in use))
        vs = [r["views"] for r in use if r["views"]]
        if vs: print("median views (where shown):", statistics.median(vs), "n=", len(vs))
        srt = sorted(use, key=lambda r: (r["eng"], r["views"] or 0), reverse=True)
        print("TOP 10:")
        for r in srt[:10]: print(" ", r["date"].date(), r["fmt"], r["owner"], "eng", r["eng"], "views", r["views"], r["url"], "|", clip(r["text"]))
        print("BOTTOM 5:")
        for r in srt[-5:]: print(" ", r["date"].date(), r["fmt"], r["owner"], "eng", r["eng"], "views", r["views"], r["url"], "|", clip(r["text"]))
        print("ALL (date | fmt | owner | eng | views | url | text):")
        for r in use: print(" ", r["date"].date(), "|", r["fmt"], "|", r["owner"], "|", r["eng"], "|", r["views"], "|", r["url"], "|", clip(r["text"], 110))

# Instagram: merge posts and reels by shortCode
ig = {}
for it in load("instagram-posts") + load("instagram-reels"):
    sc = it["shortCode"]
    r = ig.get(sc, {})
    views = it.get("videoPlayCount") or it.get("videoViewCount") or r.get("views")
    fmt = it.get("productType") or it.get("type")
    if fmt in ("clips",): fmt = "Reel"
    if it.get("type") == "Sidecar": fmt = "Carousel"
    if it.get("type") == "Image": fmt = "Static"
    if it.get("type") == "Video" and fmt not in ("Reel",): fmt = "Reel" if it.get("productType") in (None, "clips") else fmt
    ig[sc] = dict(date=p(it["timestamp"]), fmt=fmt, owner=it.get("ownerUsername"),
                  eng=max((it.get("likesCount") or 0), 0) + (it.get("commentsCount") or 0),
                  views=views, url=it["url"], text=it.get("caption"))
report("INSTAGRAM (posts + reels merged)", list(ig.values()))

def fb(name):
    rows = []
    for it in load(name):
        txt = it.get("text")
        media = it.get("media") or []
        fmt = "text"
        if media:
            t = str(media[0].get("__typename") or media[0].get("type") or "")
            fmt = "video" if "Video" in t else ("photo" if "Photo" in t else (t or "media"))
        rows.append(dict(date=p(it.get("timestamp") or it.get("time")), fmt=fmt, owner=(it.get("user") or {}).get("name") or it.get("pageName"),
                         eng=(it.get("likes") or 0) + (it.get("comments") or 0) + (it.get("shares") or 0),
                         views=it.get("viewsCount"), url=it.get("url"), text=txt))
    return rows
report("FACEBOOK PAGE", fb("facebook-page-50"))
report("FACEBOOK PERSONAL", fb("facebook-personal-50"))

li = []
for it in load("linkedin-posts"):
    e = it.get("engagement") or {}
    pa = it.get("postedAt") or {}
    li.append(dict(date=p(pa.get("timestamp") or pa.get("date")), fmt=("repost" if it.get("header") or it.get("socialContent", {}).get("shareUrl") is None and False else ("video" if it.get("postVideo") else ("image" if it.get("postImages") else "text"))),
                   owner=(it.get("author") or {}).get("name"), eng=(e.get("likes") or 0) + (e.get("comments") or 0) + (e.get("shares") or 0),
                   views=None, url=it.get("linkedinUrl"), text=it.get("content")))
report("LINKEDIN", li)

yt = []
for it in load("youtube"):
    yt.append(dict(date=p(it["date"]), fmt=it.get("type") or ("short" if "shorts" in it["url"] else "video"), owner=it.get("channelName"),
                   eng=(it.get("likes") or 0) + (it.get("commentsCount") or 0), views=it.get("viewCount"), url=it["url"], text=f"{it.get('title')} [{it.get('duration')}]"))
report("YOUTUBE", yt)
