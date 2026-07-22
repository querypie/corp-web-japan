#!/usr/bin/env python3
import argparse
import os
from pathlib import Path


def select_latest_report(reports_root: str) -> str:
    root = Path(reports_root)
    latest_dir = None
    latest_mtime = None
    for entry in root.iterdir() if root.exists() else []:
        if not entry.is_dir():
            continue
        run_status = entry / "run-status.json"
        if not run_status.is_file():
            continue
        mtime = run_status.stat().st_mtime
        if latest_mtime is None or mtime > latest_mtime or (mtime == latest_mtime and str(entry) > str(latest_dir)):
            latest_dir = entry
            latest_mtime = mtime
    return "" if latest_dir is None else str(latest_dir)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("reports_root")
    args = parser.parse_args()
    print(select_latest_report(args.reports_root))
