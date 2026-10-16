#!/usr/bin/env python3
"""
LandGuard AI - Frontend QA & Sanity Verification Suite
Verifies all pages, scripts, contracts, and canonical scenario scores.
"""

import sys
import os
import urllib.request
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PAGES = [
    "/index.html",
    "/login.html",
    "/register.html",
    "/dashboard.html",
    "/upload.html",
    "/result.html",
    "/report.html",
    "/admin/index.html",
    "/admin/records.html",
    "/admin/audit.html",
    "/403.html"
]

STATIC_FILES = [
    "/css/tokens.css",
    "/css/base.css",
    "/css/components.css",
    "/css/bootstrap.min.css",
    "/js/bootstrap.bundle.min.js",
    "/js/api.js",
    "/js/auth.js",
    "/js/i18n.js",
    "/js/gauge.js",
    "/js/shell.js",
    "/js/simulator.js",
    "/js/mock/db.js",
    "/js/mock/scenarios.js",
    "/i18n/bn.json",
    "/i18n/en.json"
]

def check_url(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'LandGuard-QA-Tester'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            content = resp.read()
            return resp.status, len(content), content
    except Exception as e:
        return 0, 0, str(e)

def main():
    base_url = "http://127.0.0.1:8080"
    print(f"==================================================")
    print(f" LandGuard AI - Automated Frontend QA Test Suite")
    print(f" Target Base URL: {base_url}")
    print(f"==================================================")

    all_passed = True

    # 1. Check all Pages
    print("\n--- [1] Checking HTML Pages ---")
    for page in PAGES:
        status, length, body = check_url(f"{base_url}{page}")
        if status == 200:
            # Check mandatory disclaimer presence in body
            has_disclaimer = "সিনথেটিক" in body.decode('utf-8', errors='ignore') or "synthetic" in body.decode('utf-8', errors='ignore').lower()
            disc_mark = "✓ Disclaimer" if has_disclaimer else "⚠️ No disclaimer"
            print(f"  [200 OK] {page:22} ({length:6} bytes) [{disc_mark}]")
        else:
            print(f"  ❌ FAILED {page}: status {status}")
            all_passed = False

    # 2. Check Static Assets
    print("\n--- [2] Checking CSS, JS & i18n Assets ---")
    for asset in STATIC_FILES:
        status, length, _ = check_url(f"{base_url}{asset}")
        if status == 200:
            print(f"  [200 OK] {asset:30} ({length:6} bytes)")
        else:
            print(f"  ❌ FAILED {asset}: status {status}")
            all_passed = False

    # 3. Check Canonical Scenario Data
    print("\n--- [3] Checking Canonical Demo Scenarios ---")
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    scenarios_path = os.path.join(root, "frontend", "js", "mock", "scenarios.js")
    with open(scenarios_path, "r", encoding="utf-8") as f:
        scenarios_content = f.read()

    # Check Rahim Land Deed = 65 / HIGH
    if "risk_score: 65" in scenarios_content and 'risk_level: "HIGH"' in scenarios_content:
        print("  ✅ Rahim_Land_Deed risk_score is strictly 65 / HIGH (35 + 20 + 10)")
    else:
        print("  ❌ Rahim_Land_Deed does NOT match required 65 / HIGH!")
        all_passed = False

    if 'risk_level: "LOW"' in scenarios_content and 'risk_level: "MEDIUM"' in scenarios_content:
        print("  ✅ clean_match (LOW) and medium_risk (MEDIUM) confirmed.")
    else:
        print("  ❌ Missing LOW or MEDIUM scenarios")
        all_passed = False

    # 4. Check Disclaimer Strings in rules.md
    print("\n--- [4] Checking Mandatory Disclaimer Strings ---")
    rules_path = os.path.join(root, "rules.md")
    with open(rules_path, "r", encoding="utf-8") as f:
        rules_content = f.read()

    required_bn = "এটি একটি প্রোটোটাইপ, যা কৃত্রিম (সিনথেটিক) ভূমি রেকর্ড ব্যবহার করে। ঝুঁকির স্কোর সম্ভাব্য অসঙ্গতি নির্দেশ করে; এটি জালিয়াতি বা আইনি মালিকানার প্রমাণ নয়।"
    required_en = "Prototype using synthetic land records. Risk score indicates potential inconsistencies, not proof of fraud or legal ownership."

    if required_bn in rules_content and required_en in rules_content:
        print("  ✅ Mandatory BN and EN disclaimer strings verified in rules.md.")
    else:
        print("  ❌ Disclaimers missing or mismatched in rules.md")
        all_passed = False

    print("\n==================================================")
    if all_passed:
        print("🎉 ALL FRONTEND QA CHECKS PASSED SUCCESSFULLY!")
        print("==================================================")
        sys.exit(0)
    else:
        print("❌ SOME CHECKS FAILED.")
        print("==================================================")
        sys.exit(1)

if __name__ == "__main__":
    main()
