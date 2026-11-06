#!/usr/bin/env python3
"""Parse ARV Finance Flip Report email bodies into arv_flips.json."""
import json
import re
from collections import Counter, OrderedDict
from pathlib import Path

BASE = Path("/home/claude/investors/arv")
REPORTS = [
    ("2026-01", "19ca029b72bf83b1", "multiline"),
    ("2025-12", "19bebd0aa14321b7", "multiline"),
    ("2025-11", "19b2d41c2e69e20c", "multiline"),
    ("2025-10", "19aa3d88212e5875", "oneline"),
    ("2025-01", "195f7d7d3ac20930", "multiline"),
    ("2024-10", "195f7d76d283a11d", "multiline"),
]

DATE_RE = re.compile(r"^\d{1,2}/\d{1,2}/\d{4}$")
ZIP_RE = re.compile(r"^\d{5}$")
ONELINE_RE = re.compile(r"^(?P<addrcity>.*?)\s*(?P<zip>\d{5}) (?P<date>\d{1,2}/\d{1,2}/\d{4}) (?P<price>\S+)$")
END_MARKERS = ("NEIL DUTTA", "[https://ci3.googleusercontent.com", "[Image removed by sender.]", "Sent to:", "#")

problems = []


def clean_lines(text):
    out = []
    for raw in text.splitlines():
        s = raw.strip()
        s = s.strip("*").strip()
        if s:
            out.append(s)
    return out


def table_lines(lines):
    """Return the lines between the SALE PRICE header and the footer."""
    start = lines.index("SALE PRICE") + 1
    end = len(lines)
    for i in range(start, len(lines)):
        if any(lines[i].startswith(m) for m in END_MARKERS):
            end = i
            break
    return lines[start:end]


def parse_multiline(report, lines):
    rows = []
    owner = None
    prev_end = 0  # index just after the previous record's price
    i = 0
    while i < len(lines):
        if DATE_RE.match(lines[i]) and i + 1 < len(lines):
            date = lines[i]
            price = lines[i + 1]
            zip_, city, address, entity = lines[i - 1], lines[i - 2], lines[i - 3], lines[i - 4]
            entity_idx = i - 4
            between = lines[prev_end:entity_idx]
            if between:
                owner = between[0]
                for stray in between[1:]:
                    problems.append(f"{report}: ignored stray line {stray!r} between owner {owner!r} and entity {entity!r}")
            if not ZIP_RE.match(zip_):
                problems.append(f"{report}: zip {zip_!r} not 5 digits for {address!r}")
            rows.append(OrderedDict(report=report, owner=owner, entity=entity, address=address,
                                    city=city, zip=zip_, date=date, price=price))
            prev_end = i + 2
            i += 2
        else:
            i += 1
    leftover = lines[prev_end:]
    if leftover:
        problems.append(f"{report}: trailing unparsed lines {leftover!r}")
    return rows


def parse_oneline(report, lines, known_cities):
    rows = []
    owner = None
    pending = []
    for ln in lines:
        m = ONELINE_RE.match(ln)
        if not m:
            pending.append(ln)
            continue
        if len(pending) == 1:
            entity = pending[0]
        elif len(pending) >= 2:
            owner = pending[0]
            entity = pending[-1]
            for stray in pending[1:-1]:
                problems.append(f"{report}: ignored stray line {stray!r} before {ln!r}")
        else:
            problems.append(f"{report}: data line with no entity line: {ln!r}")
            entity = None
        pending = []
        if entity and entity.endswith(","):
            problems.append(f"{report}: stripped trailing comma from entity {entity!r}")
            entity = entity.rstrip(",")
        addrcity = m.group("addrcity")
        address, city = None, None
        for c in sorted(known_cities, key=len, reverse=True):
            if addrcity == c:
                address, city = "", c
                break
            if addrcity.endswith(" " + c):
                address, city = addrcity[: -len(c) - 1].strip(), c
                break
        if city is None:
            # fall back: last word is the city
            parts = addrcity.rsplit(" ", 1)
            address, city = (parts[0], parts[1]) if len(parts) == 2 else ("", addrcity)
            problems.append(f"{report}: city not in known list, guessed {city!r} for {ln!r}")
        if address == "":
            problems.append(f"{report}: no street address in line {ln!r}")
        rows.append(OrderedDict(report=report, owner=owner, entity=entity, address=address,
                                city=city, zip=m.group("zip"), date=m.group("date"), price=m.group("price")))
    if pending:
        problems.append(f"{report}: trailing unparsed lines {pending!r}")
    return rows


def main():
    all_rows = []
    known_cities = {
        "San Diego", "Chula Vista", "La Jolla", "Spring Valley", "Lemon Grove", "Imperial Beach",
        "San Marcos", "El Cajon", "La Mesa", "National City", "Warner Springs", "Del Mar",
        "Solana Beach", "San Pedro", "Pacific Palisades", "Rancho Santa Fe", "Los Angeles",
    }
    # First pass on multiline reports to collect city names.
    parsed = {}
    for report, mid, kind in REPORTS:
        lines = table_lines(clean_lines((BASE / f"{mid}.txt").read_text(encoding="utf-8")))
        if kind == "multiline":
            parsed[report] = parse_multiline(report, lines)
            known_cities.update(r["city"] for r in parsed[report])
        else:
            parsed[report] = (lines,)
    for report, mid, kind in REPORTS:
        if kind == "oneline":
            parsed[report] = parse_oneline(report, parsed[report][0], known_cities)
        all_rows.extend(parsed[report])

    (BASE / "arv_flips.json").write_text(json.dumps(all_rows, indent=2), encoding="utf-8")

    counts = Counter(r["report"] for r in all_rows)
    print("Rows per report:")
    for report, _, _ in REPORTS:
        print(f"  {report}: {counts[report]}")
    print(f"Total rows: {len(all_rows)}")
    entities = {r["entity"] for r in all_rows if r["entity"]}
    print(f"Distinct entity names (exact string): {len(entities)}")
    norm = {re.sub(r'[^a-z0-9]', '', e.lower()) for e in entities}
    print(f"Distinct entity names (case/punct-insensitive): {len(norm)}")
    owners = {r["owner"] for r in all_rows}
    print(f"Distinct owner names (exact string): {len(owners)}")
    if problems:
        print("\nParsing notes:")
        for p in problems:
            print("  - " + p)


if __name__ == "__main__":
    main()
