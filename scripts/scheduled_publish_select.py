#!/usr/bin/env python3
"""Pick PRs due for scheduled publishing. Stdlib only.

  gh pr list --state open --json number,isDraft,labels,statusCheckRollup | \
    python3 scripts/scheduled_publish_select.py [--today YYYY-MM-DD]

Prints one "<date> <number>" line per due PR, oldest date first (ties by PR
number). Due = has a publish:YYYY-MM-DD label with date <= today (UTC), not a
draft, no failing check. Mergeability is re-checked live by the workflow.
"""
import datetime, json, re, sys

BAD = {"FAILURE", "ERROR", "TIMED_OUT", "CANCELLED", "STARTUP_FAILURE", "ACTION_REQUIRED"}

def due_date(pr):
    dates = []
    for l in pr.get("labels") or []:
        m = re.fullmatch(r"publish:(\d{4}-\d{2}-\d{2})", l.get("name", ""))
        if m:
            try:
                dates.append(datetime.date.fromisoformat(m.group(1)))
            except ValueError:
                pass
    return min(dates) if dates else None

def failing(pr):
    for c in pr.get("statusCheckRollup") or []:
        if (c.get("conclusion") or "") in BAD or (c.get("state") or "") in BAD:
            return True
    return False

def select(prs, today):
    out = []
    for pr in prs:
        d = due_date(pr)
        if d is None or d > today:
            continue
        if pr.get("isDraft"):
            print(f"skip #{pr['number']}: draft", file=sys.stderr); continue
        if failing(pr):
            print(f"skip #{pr['number']}: failing checks", file=sys.stderr); continue
        out.append((d, pr["number"]))
    return sorted(out)

if __name__ == "__main__":
    a = sys.argv[1:]
    today = datetime.date.fromisoformat(a[a.index("--today") + 1]) if "--today" in a else datetime.datetime.now(datetime.timezone.utc).date()
    for d, n in select(json.load(sys.stdin), today):
        print(d, n)
