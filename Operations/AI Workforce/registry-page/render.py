"""Render systems-registry.md as one filterable page.

Run after any registry change, then republish the page:
    python render.py
Reads ../systems-registry.md (source of truth), links.json (where each row runs),
../logs/usage-log.md and Email HQ's triage-run-log.md (run activity), and
activity-snapshot.json (activity a session reads from Drive or the scheduled-task list).
Writes systems-registry.html next to this file.
"""
import hashlib
import json
import re
from datetime import date, timedelta
from pathlib import Path

HERE = Path(__file__).parent
REGISTRY = HERE.parent / "systems-registry.md"
LINKS = HERE / "links.json"
OUT = HERE / "systems-registry.html"
USAGE_LOG = HERE.parent / "logs" / "usage-log.md"
TRIAGE_LOG = HERE.parents[2] / "Email HQ" / "Email HQ Resources" / "triage-run-log.md"
SNAPSHOT = HERE / "activity-snapshot.json"
QUIET_DAYS = 30

SECTION_KIND = {
    "Scheduled tasks": "Scheduled task",
    "Apps Script systems": "Apps Script",
    "Connectors": "Connector",
}


def clean(cell):
    return re.sub(r"`([^`]*)`", r"\1", cell.strip())


def parse(md):
    rows, gaps, section, header = [], [], None, None
    for line in md.splitlines():
        if line.startswith("## "):
            section, header = line[3:].strip(), None
            continue
        if section and section.startswith("Gaps") and line.startswith("- "):
            gaps.append(clean(line[2:]))
            continue
        if not line.startswith("|") or not section:
            continue
        cells = [clean(c) for c in line.strip().strip("|").split("|")]
        if header is None:
            header = cells
        elif set(line.replace("|", "").strip()) <= {"-", " "}:
            continue
        else:
            rows.append((section, dict(zip(header, cells))))
    return rows, gaps


def status_chip(text, runs=""):
    t = text.lower()
    if "one-time" in runs.lower():
        return "One-time"
    if t.startswith("planned"):
        return "Planned"
    if t.startswith("parked") or "then parked" in t:
        return "Parked"
    if t.startswith("not active"):
        return "Not active"
    if t.startswith("dormant"):
        return "Dormant"
    if t.startswith("approved and written"):
        return "Built, first runs pending"
    if t.startswith(("active", "live", "in use", "connected", "built", "created", "defined", "brief and eval approved")):
        return "Active"
    return "See notes"


def needs_attention(text):
    return bool(re.search(r"\b(pending|missing|staged|open before)\b", text, re.I))


def attention_reason(text):
    """The clause of a status that says what is pending, missing, or staged."""
    for seg in re.split(r"[;.] ", text):
        if needs_attention(seg):
            return seg.strip()
    return text


def platform_list(text):
    """'Google Drive, Asana (read)' -> ['Google Drive', 'Asana']; 'None (...)' -> []."""
    names = []
    for part in re.split(r"[,;]\s*(?![^()]*\))", text or ""):
        name = re.sub(r"\s*\(.*?\)", "", part).strip()
        if name and not name.lower().startswith("none") and "archived" not in name:
            names.append(name)
    return names


def log_runs():
    """name -> list of {date, summary}, oldest first, from the usage log and the triage run log."""
    runs = {}
    for line in USAGE_LOG.read_text(encoding="utf-8").splitlines():
        m = re.match(r"\|?\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]+?)\s*\|\s*[^|]*\|\s*(.*?)\s*\|?\s*$", line)
        if m:
            runs.setdefault(m.group(2), []).append({"date": m.group(1), "summary": m.group(3)})
    if TRIAGE_LOG.exists():
        for line in TRIAGE_LOG.read_text(encoding="utf-8").splitlines():
            # Three timestamp styles over time: "2026-09-19 15:10", "2026-09-26T15:15:33-07:00", "2026-10-01 11:15 PT".
            m = re.match(r"\|\s*(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})[^|]*\|\s*(\w+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|\s*(.*?)\s*\|?\s*$", line)
            if m:
                d, t, kind, new, arch, routed, outp = m.groups()
                outp = outp[:1].upper() + outp[1:]
                summary = f"{t} {kind.title()}: {new.strip()} new, {arch.strip()} archived, {routed.strip()} routed. {outp}"
                runs.setdefault("morning-inbox-triage", []).append({"date": d, "summary": summary})
        runs.get("morning-inbox-triage", []).sort(key=lambda r: r["date"] + r["summary"][:5])
    return runs


def short_where(section, kind, runs_where):
    """A short 'runs on' label for the row; the full text stays in the details."""
    w = runs_where.lower()
    if section == "Scheduled tasks":
        return runs_where.split(",")[0]
    if section == "Apps Script systems":
        return "Apps Script web app"
    if section == "Connectors":
        return "Claude connector"
    if "parked" in w or "parked" in kind.lower():
        return "Parked, not deployed"
    if "code tab reads" in w:
        return "Claude Code + claude.ai account"
    if "claude.ai account" in w:
        return "claude.ai account"
    if w.startswith(".claude") or w.startswith("operations/"):
        return "Claude Code"
    if kind.startswith("Satellite and"):
        return "claude.ai project + OS folder"
    if kind.startswith("Satellite"):
        return "claude.ai project"
    if kind.startswith("App Project"):
        return "Claude desktop project"
    return runs_where


STRIP_DAYS = 30


def fmt(d):
    return d.strftime("%b %-d") if hasattr(d, "strftime") and False else f"{d:%b} {d.day}"


def schedule_check(cadence, dates, today):
    """Compare actual run dates with the schedule. Returns (verdict, problems, detail)."""
    if not dates:
        return "No runs recorded", [], ""
    first, yesterday = min(dates), today - timedelta(days=1)
    if cadence["type"] == "once":
        return f"One-time · ran {fmt(min(dates))}", [], ""
    if cadence["type"] == "daily":
        start = max(first, today - timedelta(days=STRIP_DAYS))
        per = cadence.get("perDay", 1)
        counts = {}
        for d in dates:
            counts[d] = counts.get(d, 0) + 1
        days = [start + timedelta(days=i) for i in range((yesterday - start).days + 1)]
        short = [d for d in days if counts.get(d, 0) < per]
        missed = [d for d in short if counts.get(d, 0) == 0]
        partial = [d for d in short if counts.get(d, 0) > 0]
        ok = len(days) - len(short)
        detail = f"Checked {len(days)} days from {fmt(start)} to {fmt(yesterday)}: {ok} complete."
        problems = [{"date": d.isoformat(), "text": f"missed {fmt(d)}", "kind": "missed"} for d in missed] + \
                   [{"date": d.isoformat(), "text": f"only {counts[d]} of {per} runs on {fmt(d)}", "kind": "partial",
                     "count": counts[d], "per": per} for d in partial]
        if not short:
            return f"{cadence['label']} · on schedule ({len(days)} of {len(days)} days)", [], detail
        bits = []
        if missed:
            bits.append("missed " + ", ".join(fmt(d) for d in missed[-3:]))
        if partial:
            bits.append(f"{len(partial)} short day{'s' if len(partial) > 1 else ''}")
        return f"{cadence['label']} · {ok} of {len(days)} days · " + "; ".join(bits), problems, detail
    if cadence["type"] == "weekly":
        wd = cadence["weekday"]
        d = first
        while d.weekday() != wd:
            d += timedelta(days=1)
        expected = []
        while d <= yesterday:
            expected.append(d)
            d += timedelta(days=7)
        pool = sorted(dates)
        late, problems = [], []
        for e in expected:
            match = next((r for r in pool if r >= e), None)
            if match is None:
                problems.append({"date": e.isoformat(), "text": f"{fmt(e)} run missing", "kind": "missed"})
                continue
            pool.remove(match)
            if match > e:
                late.append((e, (match - e).days))
                problems.append({"date": e.isoformat(), "text": f"{fmt(e)} ran {(match - e).days} days late",
                                 "kind": "late", "actual": match.isoformat()})
        on_time = len(expected) - len(problems)
        detail = f"Checked {len(expected)} scheduled runs from {fmt(expected[0])} to {fmt(expected[-1])}." if expected else ""
        if not problems:
            return f"{cadence['label']} · on schedule ({on_time} of {len(expected)})", [], detail
        return f"{cadence['label']} · {on_time} of {len(expected)} on time · " + "; ".join(p["text"] for p in problems[-2:]), problems, detail
    return cadence.get("label", ""), [], ""


def activity(name, section, chip, runs, snapshot, today, where_text="", cadence=None):
    """Rhythm verdict, 30-day strip, recent runs, and schedule problems for one row."""
    events, source = None, ""
    if name in snapshot["rows"]:
        a = snapshot["rows"][name]
        events, source = a["runs"], a["source"] + f", read {snapshot['asOf']}"
    elif name in runs:
        events = runs[name]
        source = "Triage run log" if name == "morning-inbox-triage" else "Usage log"
    if events is None:
        if chip == "Planned":
            return {"tracked": False, "note": "Not built yet"}
        since = snapshot.get("loggingSince", {}).get(name)
        if since:
            idle = (today - date.fromisoformat(since)).days
            return {"tracked": True, "verdict": f"Logging since {fmt(date.fromisoformat(since))} · no runs yet", "strip": [0] * STRIP_DAYS,
                    "recent": [], "problems": [], "source": "Usage log", "last": None, "quiet": idle > QUIET_DAYS}
        if section == "Agents and skills" and chip == "Active" and name not in ("seat handoffs", "registry-guard hooks"):
            if "claude.ai account" in where_text:
                return {"tracked": False, "note": "Not logging (runs on claude.ai)"}
            return {"tracked": False, "note": "Not logging yet"}
        return {"tracked": False, "note": "Not tracked"}

    dates = [date.fromisoformat(e["date"]) for e in events]
    last = max(dates)
    start = today - timedelta(days=STRIP_DAYS - 1)
    strip = [sum(1 for d in dates if d == start + timedelta(days=i)) for i in range(STRIP_DAYS)]
    recent = [e for e in reversed(events) if e.get("summary")][:3]
    idle = (today - last).days
    problems, detail = [], ""
    if cadence:
        verdict, problems, detail = schedule_check(cadence, dates, today)
    else:
        window = [d for d in dates if d >= start]
        days_used = sorted(set(window))
        if not window:
            verdict = f"On demand · no runs in {STRIP_DAYS} days · last {fmt(last)}"
        else:
            runs_part = f"{len(window)} run{'s' if len(window) > 1 else ''} on {len(days_used)} day{'s' if len(days_used) > 1 else ''}"
            idle_part = "used today" if idle == 0 else f"idle {idle} day{'s' if idle > 1 else ''}"
            verdict = f"On demand · {runs_part} in {STRIP_DAYS} days · {idle_part}"
    return {"tracked": True, "verdict": verdict, "strip": strip, "recent": recent, "problems": problems, "detail": detail,
            "source": source, "last": last.isoformat(), "idle": idle,
            "quiet": chip == "Active" and not cadence and idle > QUIET_DAYS}


def build(rows, links, runs=None, snapshot=None, today=None):
    out = []
    default_owner = links["defaultOwner"]
    for i, (section, r) in enumerate(rows):
        name = r.get("Name") or r.get("Connector")
        extra = links["rows"].get(name, {})
        kind = r.get("Type") or SECTION_KIND.get(section, section)
        runs_where = r.get("Runs where") or r.get("Lives where") or r.get("Pinned to / purpose") or r.get("Used by") or ""
        layer = r.get("Layer", "")
        status = r.get("Status", "")
        if section == "Connectors":
            # The connectors table keeps status inside the Layer cell for some rows.
            m = re.match(r"(Dormant|In use)(.*)", layer)
            if m:
                status, layer = layer, ""
            status = status or extra.get("status", "")
        owner = r.get("Owner") or default_owner
        seat = extra.get("seat", "")
        details = [[k, v] for k, v in r.items() if k not in ("Name", "Connector", "Description") and v]
        act = activity(name, section, status_chip(status, runs_where) if status else "", runs, snapshot, today, runs_where, extra.get("cadence"))
        act["ackDates"] = [k["date"] for k in extra.get("acknowledged", [])]
        out.append({
            "id": i,
            "name": name,
            "section": section,
            "group": "Workspaces" if section == "Workspaces" else "Systems",
            "kind": kind,
            "runs": runs_where,
            "owner": owner,
            "seat": seat or ("" if r.get("Reports to", "") in ("", "Brett") else r.get("Reports to", "")),
            "reportsTo": r.get("Reports to", ""),
            "layer": layer or "Not recorded",
            "status": status or "Not recorded",
            # A system with a logged run is no longer "first runs pending".
            "chip": ("Active" if status_chip(status, runs_where) == "Built, first runs pending" and act.get("last")
                     else status_chip(status, runs_where)) if status else "Not recorded",
            "description": r.get("Description", ""),
            "platforms": platform_list(name if section == "Connectors" else r.get("Connected platforms", "")),
            "platformsText": r.get("Connected platforms", ""),
            "attention": needs_attention(status) or not r.get("Description"),
            "activity": act,
            "acknowledged": extra.get("acknowledged", []),
            "where": short_where(section, kind, runs_where),
            "links": extra.get("links", []),
            "details": details,
        })
    return out


def alert_key(*parts):
    """Stable id for an alert, safe as a db document id."""
    raw = ":".join(str(p) for p in parts)
    return re.sub(r"[^A-Za-z0-9_-]", "_", raw)[:60] + "-" + hashlib.sha1(raw.encode()).hexdigest()[:8]


def alerts(rows, snapshot, today, links):
    """Things that need a look, most urgent first. Each says what is wrong, what to do, and how it clears."""
    out = []
    ask = "ask the COO"
    for r in rows:
        if r["chip"] == "Parked":
            continue  # parked on purpose; visible in the registry, never an alert
        a = r["activity"]
        cad = links["rows"].get(r["name"], {}).get("cadence", {})
        src = a.get("source", "run history").split(",")[0].lower()
        acked = {k["date"] for k in r.get("acknowledged", [])}
        for p in a.get("problems", []):
            if p["date"] in acked:
                continue
            day = date.fromisoformat(p["date"])
            age = (today - day).days
            if age > STRIP_DAYS:
                continue
            if p.get("kind") == "late":
                what = (f"{r['name']} runs {cad.get('label', 'on a schedule').lower()}. The run due {fmt(day)} did not happen "
                        f"until {fmt(date.fromisoformat(p['actual']))}, {p['text'].split(' ran ')[1]}.")
                action = ("If the computer or the Claude app was off that day, nothing to fix: the task caught up on its own. "
                          f"If runs keep slipping, {ask}: \"check why {r['name']} runs late.\"")
            elif p.get("kind") == "partial":
                what = f"{r['name']} runs {cad.get('label', '').lower()}, but only {p['count']} of {p['per']} runs happened on {fmt(day)} (per the {src})."
                action = f"Usually the app was closed for part of the day; nothing to fix once. If it repeats, {ask}: \"check {r['name']}'s missed runs.\""
            else:
                what = f"{r['name']} runs {cad.get('label', 'on a schedule').lower()}, and the {src} shows no run on {fmt(day)}."
                action = ("If the computer or the Claude app was off that day, nothing to fix. "
                          f"If it happens again, {ask}: \"check why {r['name']} missed runs.\"")
            out.append({"key": alert_key("sched", r["name"], p["date"]), "level": "high" if age <= 7 else "medium",
                        "name": r["name"], "id": r["id"], "date": p["date"],
                        "title": f"{r['name']}: {p['text']}", "what": what, "action": action,
                        "clears": f"Clear it here once you have checked. It also drops off on its own {STRIP_DAYS} days after the miss."})
        if a.get("quiet"):
            out.append({"key": alert_key("quiet", r["name"], a.get("last") or ""), "level": "medium", "name": r["name"], "id": r["id"],
                        "date": a.get("last") or "", "title": f"{r['name']}: no runs in {a.get('idle', QUIET_DAYS)} days",
                        "what": f"{r['name']} is marked Active but has not run in {a.get('idle', QUIET_DAYS)} days.",
                        "action": f"Decide whether you still need it. Keep it, or {ask}: \"retire {r['name']}.\"",
                        "clears": "Clears on its next run. Clear it here to keep it without using it."})
        if needs_attention(r["status"]):
            custom = links["rows"].get(r["name"], {}).get("alertAction", {})
            reason = attention_reason(r["status"])
            out.append({"key": alert_key("open", r["name"], r["status"]), "level": "low", "name": r["name"], "id": r["id"], "date": "",
                        "title": f"{r['name']}: {reason.split(':')[0]}",
                        "what": custom.get("what", reason[0].upper() + reason[1:] + "."),
                        "action": custom.get("action", f"{ask[0].upper() + ask[1:]}: \"fix the open item on {r['name']}.\""),
                        "link": custom.get("link"),
                        "clears": custom.get("clears", "Clears when the fix lands and the COO updates the registry. Clear it here to hide it until then; it comes back if the status changes.")})
    age = (today - date.fromisoformat(snapshot["asOf"])).days
    if age > 7:
        out.append({"key": alert_key("stale", snapshot["asOf"]), "level": "medium", "name": "", "id": None, "date": snapshot["asOf"],
                    "title": f"Scheduled-task activity is {age} days old",
                    "what": f"Run data for the desktop scheduled tasks and the attribution job was last refreshed {snapshot['asOf']}, so their verdicts may be wrong.",
                    "action": "Ask the COO: \"refresh the registry activity.\"",
                    "clears": "Clears when the data is refreshed and the page republished."})
    rank = {"high": 0, "medium": 1, "low": 2}
    return sorted(out, key=lambda x: (rank[x["level"]], x["date"] and -date.fromisoformat(x["date"]).toordinal()))


def main():
    md = REGISTRY.read_text(encoding="utf-8")
    links = json.loads(LINKS.read_text(encoding="utf-8"))
    rows, gaps = parse(md)
    header = re.search(r"^_(.+)_$", md, re.M).group(1)
    data = {
        "rendered": date.today().isoformat(),
        "header": header,
        "rows": build(rows, links, log_runs(), json.loads(SNAPSHOT.read_text(encoding="utf-8")), date.today()),
        "quietDays": QUIET_DAYS,
        "stripDays": STRIP_DAYS,
        "gaps": gaps,
        "sections": list(dict.fromkeys(s for s, _ in rows)),
    }
    data["alerts"] = alerts(data["rows"], json.loads(SNAPSHOT.read_text(encoding="utf-8")), date.today(), links)
    template = (HERE / "template.html").read_text(encoding="utf-8")
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    OUT.write_text(template.replace("/*DATA*/null", payload), encoding="utf-8")
    print(f"{len(data['rows'])} rows, {len(gaps)} gaps -> {OUT.name}")


if __name__ == "__main__":
    main()
