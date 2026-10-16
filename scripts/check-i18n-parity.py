#!/usr/bin/env python3
"""
LandGuard AI - i18n Key Parity Checker
Verifies that bn.json and en.json have exact matching keys.
"""

import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def get_keys(obj, prefix=""):
    keys = set()
    for k, v in obj.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_keys(v, full_key))
        else:
            keys.add(full_key)
    return keys

def main():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    bn_path = os.path.join(root, "frontend", "i18n", "bn.json")
    en_path = os.path.join(root, "frontend", "i18n", "en.json")

    with open(bn_path, "r", encoding="utf-8") as f:
        bn_data = json.load(f)
    with open(en_path, "r", encoding="utf-8") as f:
        en_data = json.load(f)

    bn_keys = get_keys(bn_data)
    en_keys = get_keys(en_data)

    missing_in_en = bn_keys - en_keys
    missing_in_bn = en_keys - bn_keys

    print(f"Total Bangla keys: {len(bn_keys)}")
    print(f"Total English keys: {len(en_keys)}")

    has_error = False
    if missing_in_en:
        print(f"❌ Keys missing in en.json ({len(missing_in_en)}):")
        for k in sorted(missing_in_en):
            print(f"  - {k}")
        has_error = True

    if missing_in_bn:
        print(f"❌ Keys missing in bn.json ({len(missing_in_bn)}):")
        for k in sorted(missing_in_bn):
            print(f"  - {k}")
        has_error = True

    if not has_error:
        print("✅ 100% Key Parity Confirmed! bn.json and en.json match perfectly.")
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
