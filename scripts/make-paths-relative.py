#!/usr/bin/env python3
"""
LandGuard AI - Relative Paths Normalizer
Ensures all HTML links, scripts, stylesheets, and imports work on both root domains and subpath deployments like GitHub Pages.
"""

import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

ROOT_FILES = [
    "index.html", "login.html", "register.html", "dashboard.html",
    "upload.html", "result.html", "report.html", "403.html"
]

ADMIN_FILES = [
    "admin/index.html", "admin/records.html", "admin/audit.html"
]

def process_root_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace /css/ with css/ or ./css/
    content = re.sub(r'href="/css/', 'href="./css/', content)
    content = re.sub(r'src="/js/', 'src="./js/', content)
    content = re.sub(r'from [\'"]/js/', 'from \'./js/', content)
    content = re.sub(r'href="/index\.html"', 'href="./index.html"', content)
    content = re.sub(r'href="/dashboard\.html"', 'href="./dashboard.html"', content)
    content = re.sub(r'href="/upload\.html"', 'href="./upload.html"', content)
    content = re.sub(r'href="/login\.html"', 'href="./login.html"', content)
    content = re.sub(r'href="/register\.html"', 'href="./register.html"', content)
    content = re.sub(r'href="/result\.html', 'href="./result.html', content)
    content = re.sub(r'href="/report\.html', 'href="./report.html', content)
    content = re.sub(r'href="/admin/index\.html"', 'href="./admin/index.html"', content)
    content = re.sub(r'href="/admin/records\.html"', 'href="./admin/records.html"', content)
    content = re.sub(r'href="/admin/audit\.html"', 'href="./admin/audit.html"', content)
    content = re.sub(r'window\.location\.href\s*=\s*[\'"]/dashboard\.html[\'"]', 'window.location.href = "./dashboard.html"', content)
    content = re.sub(r'window\.location\.href\s*=\s*`\/result\.html\?id=\$\{res\.data\.verification_id\}`', 'window.location.href = `./result.html?id=${res.data.verification_id}`', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated root file: {filepath}")

def process_admin_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    content = re.sub(r'href="/css/', 'href="../css/', content)
    content = re.sub(r'src="/js/', 'src="../js/', content)
    content = re.sub(r'from [\'"]/js/', 'from \'../js/', content)
    content = re.sub(r'href="/index\.html"', 'href="../index.html"', content)
    content = re.sub(r'href="/dashboard\.html"', 'href="../dashboard.html"', content)
    content = re.sub(r'href="/upload\.html"', 'href="../upload.html"', content)
    content = re.sub(r'href="/login\.html"', 'href="../login.html"', content)
    content = re.sub(r'href="/admin/index\.html"', 'href="./index.html"', content)
    content = re.sub(r'href="/admin/records\.html"', 'href="./records.html"', content)
    content = re.sub(r'href="/admin/audit\.html"', 'href="./audit.html"', content)
    content = re.sub(r'href="/result\.html', 'href="../result.html', content)
    content = re.sub(r'href="/report\.html', 'href="../report.html', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated admin file: {filepath}")

def main():
    for f in ROOT_FILES:
        process_root_file(os.path.join(ROOT, f))
    for f in ADMIN_FILES:
        process_admin_file(os.path.join(ROOT, f))

if __name__ == "__main__":
    main()
