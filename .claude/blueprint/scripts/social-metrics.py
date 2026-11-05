"""Social metrics for the blueprint-audit social content audit.

Usage: python -I social-metrics.py <run folder> <capture date YYYY-MM-DD>

Reads the raw Apify datasets the CMO saved in <run folder>/social-pull/ as
<name>-raw-<date>.json and prints, per platform: posts in the 90-day window,
the analysis set (90 days or the latest 50, whichever is larger), posts per
week, gaps over 14 days, format mix, owner mix, median observed engagement,
top ten, bottom five, and every post in the analysis set. Engagement is as
observed on the post (likes + comments + shares where returned), never reach.
A platform whose file is missing is skipped and named.

File names: instagram-posts, instagram-reels, facebook-page, facebook-personal,
linkedin-posts, youtube. Built 2026-10-16 (Jim McInerney run 3).
"""
import json, os, statistics, sys, datetime as dt

sys.stdout.reconfigure(encoding="utf-8")
D, DATE = sys.argv[1], sys.argv[2]
CAP = dt.datetime.fromisoformat(DATE).replace(tzinfo=dt.timezone.utc)
W0 = CAP - dt.timedelta(days=90)


def load(name):
    path = os.path.join(D, "social-pull", f"{name}-raw-{DATE}.json")
    if not os.path.exists(path):
        print(f"\n######## {name}: file not found ({path}); skipped")
        return None
    return json.load(open(path, encoding="utf-8"))["items"]


def when(ts):
    if isinstance(ts, (int, float)):
        return dt.datetime.fromtimestamp(ts if ts < 1e11 else ts / 1000, dt.timezone.utc)
    return dt.datetime.fromisoformat(str(ts).replace("Z", "+00:00"))


def clip(s, n=150):
    return (s or "").replace("\n", " ").strip()[:n]


def report(name, rows):
    rows.sort(key=lambda r: r["date"], reverse=True)
    win = [r for r in rows if r["date"] >= W0]
    use = win if len(win) >= 50 else rows[:50]
    if not use:
        print(f"\n######## {name}: no posts returned")
        return
    span = max((use[0]["date"] - use[-1]["date"]).days, 1)
    print(f"\n######## {name}: total {len(rows)}, in 90d {len(win)}, analysis set {len(use)} "
          f"({use[-1]['date'].date()} to {use[0]['date'].date()})")
    print(f"posts/week over analysis set: {len(use) / (span / 7):.2f} (span {span} d); "
          f"90d posts/week {len(win) / (90 / 7):.2f}")
    ds = sorted(r["date"] for r in use)
    print("gaps > 14 days:", [((b - a).days, str(a.date()), str(b.date()))
                              for a, b in zip(ds, ds[1:]) if (b - a).days > 14])
    for key in ("fmt", "owner"):
        mix = {}
        for r in use:
            mix[r[key]] = mix.get(r[key], 0) + 1
        print(f"{key} mix:", mix)
    print("median engagement:", statistics.median(r["eng"] for r in use))
    views = [r["views"] for r in use if r["views"]]
    if views:
        print("median views (where shown):", statistics.median(views), "n=", len(views))
    ranked = sorted(use, key=lambda r: (r["eng"], r["views"] or 0), reverse=True)
    for label, part in (("TOP 10", ranked[:10]), ("BOTTOM 5", ranked[-5:])):
        print(label + ":")
        for r in part:
            print(" ", r["date"].date(), r["fmt"], r["owner"], "eng", r["eng"], "views", r["views"],
                  r["url"], "|", clip(r["text"]))
    print("ALL (date | fmt | owner | eng | views | url | text):")
    for r in use:
        print(" ", r["date"].date(), "|", r["fmt"], "|", r["owner"], "|", r["eng"], "|", r["views"],
              "|", r["url"], "|", clip(r["text"], 110))


# Instagram: posts and reels merged by shortcode (the reel record wins for plays)
posts, reels = load("instagram-posts"), load("instagram-reels")
if posts is not None or reels is not None:
    ig = {}
    for it in (posts or []) + (reels or []):
        prev = ig.get(it["shortCode"], {})
        fmt = {"Sidecar": "Carousel", "Image": "Static", "Video": "Reel"}.get(it.get("type"), it.get("type"))
        ig[it["shortCode"]] = dict(
            date=when(it["timestamp"]), fmt=fmt, owner=it.get("ownerUsername"),
            eng=max(it.get("likesCount") or 0, 0) + (it.get("commentsCount") or 0),
            views=it.get("videoPlayCount") or it.get("videoViewCount") or prev.get("views"),
            url=it["url"], text=it.get("caption"))
    report("INSTAGRAM (posts + reels merged)", list(ig.values()))

# Facebook: the Page dataset returns no comment counts; personal profiles do
for name, label in (("facebook-page", "FACEBOOK PAGE"), ("facebook-personal", "FACEBOOK PERSONAL")):
    items = load(name)
    if items is None:
        continue
    rows = []
    for it in items:
        media = it.get("media") or []
        kind = str(media[0].get("__typename") or "") if media else ""
        fmt = "video" if "Video" in kind else ("photo" if "Photo" in kind else ("media" if media else "text"))
        rows.append(dict(
            date=when(it.get("timestamp") or it.get("time")), fmt=fmt,
            owner=(it.get("user") or {}).get("name") or it.get("pageName"),
            eng=(it.get("likes") or 0) + (it.get("comments") or 0) + (it.get("shares") or 0),
            views=it.get("viewsCount"), url=it.get("url"), text=it.get("text")))
    report(label, rows)

items = load("linkedin-posts")
if items is not None:
    rows = []
    for it in items:
        e, posted = it.get("engagement") or {}, it.get("postedAt") or {}
        fmt = "video" if it.get("postVideo") else ("image" if it.get("postImages") else "text")
        rows.append(dict(
            date=when(posted.get("timestamp") or posted.get("date")), fmt=f"{it.get('type')}/{fmt}",
            owner=(it.get("author") or {}).get("name"),
            eng=(e.get("likes") or 0) + (e.get("comments") or 0) + (e.get("shares") or 0),
            views=None, url=it.get("linkedinUrl"), text=it.get("content")))
    report("LINKEDIN", rows)

items = load("youtube")
if items is not None:
    report("YOUTUBE", [dict(
        date=when(it["date"]), fmt=it.get("type") or "video", owner=it.get("channelName"),
        eng=(it.get("likes") or 0) + (it.get("commentsCount") or 0), views=it.get("viewCount"),
        url=it["url"], text=f"{it.get('title')} [{it.get('duration')}]") for it in items])
