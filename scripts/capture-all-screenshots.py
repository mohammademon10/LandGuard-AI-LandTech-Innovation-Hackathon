#!/usr/bin/env python3
"""
LandGuard AI - Responsive Screenshot Capture Tool
Captures real evidence at 375, 768, and 1280 px across key pages.
"""

import subprocess
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\LandGuard-AI-LandTech-Innovation-Hackathon\docs\screenshots"
USER_DATA_DIR = r"C:\tmp\chrome_screenshot_profile"

CAPTURES = [
    # Landing Page
    ("landing-375.png", 375, 812, "http://127.0.0.1:8080/index.html"),
    ("landing-768.png", 768, 1024, "http://127.0.0.1:8080/index.html"),
    ("landing-1280.png", 1280, 1024, "http://127.0.0.1:8080/index.html"),

    # Dashboard
    ("dashboard-375.png", 375, 812, "http://127.0.0.1:8080/dashboard.html"),
    ("dashboard-768.png", 768, 1024, "http://127.0.0.1:8080/dashboard.html"),
    ("dashboard-1280.png", 1280, 1024, "http://127.0.0.1:8080/dashboard.html"),

    # Upload UI
    ("upload-1280.png", 1280, 1024, "http://127.0.0.1:8080/upload.html"),

    # Result Page (Rahim Land Deed - 65 / HIGH)
    ("result-375.png", 375, 812, "http://127.0.0.1:8080/result.html?id=3"),
    ("result-768.png", 768, 1024, "http://127.0.0.1:8080/result.html?id=3"),
    ("result-1280.png", 1280, 1024, "http://127.0.0.1:8080/result.html?id=3"),

    # Report Preview (Print Ready)
    ("report-1280.png", 1280, 1100, "http://127.0.0.1:8080/report.html?id=3"),

    # Admin UI
    ("admin-verifications-1280.png", 1280, 1024, "http://127.0.0.1:8080/admin/index.html"),
    ("admin-records-1280.png", 1280, 1024, "http://127.0.0.1:8080/admin/records.html")
]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("==================================================")
    print(" LandGuard AI - Automated Responsive Screenshot Engine")
    print("==================================================")

    for filename, width, height, url in CAPTURES:
        out_path = os.path.join(OUTPUT_DIR, filename)
        args = [
            CHROME_PATH,
            "--headless=new",
            f"--user-data-dir={USER_DATA_DIR}",
            f"--window-size={width},{height}",
            "--virtual-time-budget=3000",
            f"--screenshot={out_path}",
            url
        ]
        print(f"Capturing: {filename:28} [{width}x{height}] -> {url}")
        subprocess.run(args, check=True)
        if os.path.exists(out_path):
            size = os.path.getsize(out_path)
            print(f"  ✓ Saved ({size:,} bytes)")
        else:
            print(f"  ❌ Failed to save {filename}")

    print("\nAll responsive screenshots captured successfully!")

if __name__ == "__main__":
    main()
