"""Enforce the systems registry rule (Operations/AI Workforce/CLAUDE.md, Workflow step 5).

One script, called by three hooks in .claude/settings.json:
- PostToolUse on Write|Edit:
    .claude/agents/<name>.md or .claude/skills/<name>/SKILL.md with no registry row -> block, tell Claude to add the row.
    systems-registry.md or registry-page/links.json -> run registry-page/render.py.
- PostToolUse on Artifact: publishing the registry page writes registry-page/.last-publish (sha256 of the page).
- Stop: the rendered page differs from the last published one -> block once, tell Claude to republish.
Bookkeeping only. Brett's approval of a new agent or skill stays a human gate (.claude/autonomy-boundaries.md).
"""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORKFORCE = ROOT / "Operations" / "AI Workforce"
REGISTRY = WORKFORCE / "systems-registry.md"
PAGE_DIR = WORKFORCE / "registry-page"
PAGE = PAGE_DIR / "systems-registry.html"
STAMP = PAGE_DIR / ".last-publish"
ARTIFACT_ID = "UPN37pzpwruFFJhFzr8Kr4"
ARTIFACT_URL = f"https://claude.ai/artifact/{ARTIFACT_ID}"


def emit(obj):
    sys.stdout.write(json.dumps(obj))
    sys.exit(0)


def rel(path_str):
    """Path relative to the OS root with forward slashes, or None if outside it."""
    try:
        p = Path(path_str).resolve()
        return p.relative_to(ROOT).as_posix()
    except (ValueError, OSError):
        return None


def registry_names():
    names = set()
    for line in REGISTRY.read_text(encoding="utf-8").splitlines():
        if line.startswith("|"):
            first = line.strip().strip("|").split("|")[0].strip().strip("`").strip()
            if first:
                names.add(first.lower())
    return names


def page_hash():
    return hashlib.sha256(PAGE.read_bytes()).hexdigest() if PAGE.exists() else ""


def check_row(r):
    m = re.fullmatch(r"\.claude/agents/([^/]+)\.md", r) or re.fullmatch(r"\.claude/skills/([^/]+)/SKILL\.md", r)
    if not m:
        return
    name = m.group(1)
    if name.lower() in registry_names():
        return
    kind = "agent" if "/agents/" in r else "skill"
    emit({
        "decision": "block",
        "reason": (
            f"Registry rule: the {kind} '{name}' ({r}) has no row in Operations/AI Workforce/systems-registry.md. "
            f"Before continuing, add its row to the 'Agents and skills' table with Name exactly '{name}', "
            "a Description, Connected platforms, and for a seat or worker its Reports to (plus Type, Lives where, "
            "Model per model-selection.md, Layer, Status). Saving the registry re-renders the page automatically; "
            f"then republish {ARTIFACT_URL}."
        ),
    })


def render():
    proc = subprocess.run(
        [sys.executable, "-X", "utf8", "render.py"], cwd=PAGE_DIR, capture_output=True, text=True, timeout=90
    )
    if proc.returncode != 0:
        emit({
            "decision": "block",
            "reason": f"Registry hook: render.py failed (exit {proc.returncode}). Fix it before continuing.\n{proc.stderr[-1500:]}",
        })
    out = (proc.stdout or "").strip()[-400:]
    emit({
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": f"Registry hook: render.py ran and rewrote registry-page/systems-registry.html. {out} "
            f"Republish {ARTIFACT_URL} before the session ends.",
        }
    })


def post_tool(data):
    tool = data.get("tool_name", "")
    ti = data.get("tool_input") or {}
    if tool in ("Write", "Edit"):
        r = rel(ti.get("file_path", ""))
        if not r:
            return
        if r in ("Operations/AI Workforce/systems-registry.md", "Operations/AI Workforce/registry-page/links.json"):
            render()
        check_row(r)
    elif tool == "Artifact":
        if ti.get("action") not in (None, "publish") or ti.get("asset"):
            return
        fp = (ti.get("file_path") or "").replace("\\", "/")
        if ARTIFACT_ID in (ti.get("url") or "") or fp.endswith("registry-page/systems-registry.html"):
            STAMP.write_text(page_hash() + "\n", encoding="utf-8")
            emit({
                "hookSpecificOutput": {
                    "hookEventName": "PostToolUse",
                    "additionalContext": "Registry hook: publish recorded in registry-page/.last-publish.",
                }
            })


def stop(data):
    if data.get("stop_hook_active") or not PAGE.exists():
        return
    published = STAMP.read_text(encoding="utf-8").strip() if STAMP.exists() else ""
    if published == page_hash():
        return
    emit({
        "decision": "block",
        "reason": (
            "Registry rule: registry-page/systems-registry.html has changed since the last publish. Republish it now "
            f"with the Artifact tool (url {ARTIFACT_URL}, file_path Operations/AI Workforce/registry-page/systems-registry.html); "
            "the publish updates the stamp automatically. If it cannot be published this session, say so in your closing message."
        ),
    })


def main():
    try:
        data = json.loads(sys.stdin.buffer.read().decode("utf-8") or "{}")
    except ValueError:
        return
    event = data.get("hook_event_name", "")
    if event == "PostToolUse":
        post_tool(data)
    elif event == "Stop":
        stop(data)


if __name__ == "__main__":
    main()
