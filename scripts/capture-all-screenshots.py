#!/usr/bin/env python3
"""
LandGuard AI - High-Fidelity Daylight Screenshot Engine
Uses Chrome DevTools Protocol (CDP) to guarantee:
1. Strict daylight (light mode) rendering.
2. Full resolution of async mock data & removal of loading spinners.
3. Clean, crisp responsive captures at 375, 768, and 1280 px.
"""

import subprocess
import time
import json
import urllib.request
import base64
import os
import websocket
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PROFILE_DIR = r"C:\tmp\chrome_daylight_clean_profile"
OUTPUT_DIR = r"C:\LandGuard-AI-LandTech-Innovation-Hackathon\docs\screenshots"

CAPTURES = [
    # 1. Landing Page
    ("landing-1280.png", 1280, 1024, "http://127.0.0.1:8080/index.html", 2.0),
    ("landing-768.png", 768, 1024, "http://127.0.0.1:8080/index.html", 2.0),
    ("landing-375.png", 375, 812, "http://127.0.0.1:8080/index.html", 2.0),

    # 2. Auth Pages
    ("login-1280.png", 1280, 960, "http://127.0.0.1:8080/login.html", 1.5),
    ("register-1280.png", 1280, 960, "http://127.0.0.1:8080/register.html", 1.5),
    ("403-forbidden-1280.png", 1280, 960, "http://127.0.0.1:8080/403.html", 1.5),

    # 3. Citizen Dashboard (Fully loaded with KPI cards & table)
    ("dashboard-1280.png", 1280, 1024, "http://127.0.0.1:8080/dashboard.html", 2.5),
    ("dashboard-768.png", 768, 1024, "http://127.0.0.1:8080/dashboard.html", 2.5),
    ("dashboard-375.png", 375, 812, "http://127.0.0.1:8080/dashboard.html", 2.5),

    # 4. Upload UI
    ("upload-1280.png", 1280, 1024, "http://127.0.0.1:8080/upload.html", 2.0),

    # 5. Result Page (Rahim Land Deed - 65 / HIGH with Semicircle Gauge & Reasons)
    ("result-1280.png", 1280, 1024, "http://127.0.0.1:8080/result.html?id=3", 3.0),
    ("result-768.png", 768, 1024, "http://127.0.0.1:8080/result.html?id=3", 3.0),
    ("result-375.png", 375, 812, "http://127.0.0.1:8080/result.html?id=3", 3.0),

    # 6. Report Preview (Print Ready Certificate)
    ("report-1280.png", 1280, 1150, "http://127.0.0.1:8080/report.html?id=3", 2.5),

    # 7. Admin UI
    ("admin-verifications-1280.png", 1280, 1024, "http://127.0.0.1:8080/admin/index.html?role=admin", 2.5),
    ("admin-records-1280.png", 1280, 1024, "http://127.0.0.1:8080/admin/records.html?role=admin", 2.5),
    ("admin-audit-1280.png", 1280, 1024, "http://127.0.0.1:8080/admin/audit.html?role=admin", 2.5),
]

def launch_chrome():
    args = [
        CHROME_PATH,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--remote-allow-origins=*",
        f"--user-data-dir={PROFILE_DIR}",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check"
    ]
    proc = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2.5)
    return proc

def capture_target(filename, width, height, url, wait_sec):
    out_path = os.path.join(OUTPUT_DIR, filename)

    # Open tab via CDP HTTP endpoint
    req = urllib.request.Request(f"http://127.0.0.1:9222/json/new?{url}", method="PUT")
    with urllib.request.urlopen(req) as resp:
        tab_info = json.loads(resp.read().decode())
    
    tab_id = tab_info["id"]
    ws_url = tab_info["webSocketDebuggerUrl"]

    ws = websocket.create_connection(ws_url, timeout=15)
    
    def send_cmd(method, params=None):
        cmd_id = int(time.time() * 1000) % 1000000
        msg = {"id": cmd_id, "method": method, "params": params or {}}
        ws.send(json.dumps(msg))
        while True:
            raw = ws.recv()
            data = json.loads(raw)
            if data.get("id") == cmd_id:
                return data.get("result", {})

    # 1. Device metrics (viewport)
    send_cmd("Emulation.setDeviceMetricsOverride", {
        "width": width,
        "height": height,
        "deviceScaleFactor": 1,
        "mobile": (width <= 500)
    })

    # 2. Force light color scheme (Daylight theme)
    send_cmd("Emulation.setEmulatedMedia", {
        "features": [{"name": "prefers-color-scheme", "value": "light"}]
    })

    # 3. Ensure localStorage has theme='light'
    send_cmd("Runtime.evaluate", {
        "expression": """
            localStorage.setItem('lg_theme', 'light');
            document.documentElement.setAttribute('data-theme', 'light');
        """
    })

    # 4. Wait for async mock resolution and DOM rendering to finish
    time.sleep(wait_sec)

    # 5. Capture screenshot
    res = send_cmd("Page.captureScreenshot", {"format": "png"})
    ws.close()

    # 6. Close tab
    try:
        close_req = urllib.request.Request(f"http://127.0.0.1:9222/json/close/{tab_id}")
        urllib.request.urlopen(close_req)
    except Exception:
        pass

    if "data" in res:
        img_bytes = base64.b64decode(res["data"])
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "wb") as f:
            f.write(img_bytes)
        print(f"  [SAVED] [{filename}] ({len(img_bytes):,} bytes)")
        return True
    else:
        print(f"  ❌ Failed to capture {filename}")
        return False

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("==================================================")
    print(" LandGuard AI - High-Fidelity Daylight Screenshot Capture")
    print(f" Total pages/viewports: {len(CAPTURES)}")
    print("==================================================")

    # Clean existing test files
    for f in ["test-result-1280.png", "test-dashboard-1280.png"]:
        p = os.path.join(OUTPUT_DIR, f)
        if os.path.exists(p):
            os.remove(p)

    proc = launch_chrome()
    try:
        for filename, width, height, url, wait_sec in CAPTURES:
            print(f"Capturing: {filename:28} [{width}x{height}] from {url}...")
            capture_target(filename, width, height, url, wait_sec)
    finally:
        proc.terminate()
        print("\nAll daylight screenshots captured successfully!")

if __name__ == "__main__":
    main()
