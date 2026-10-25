#!/usr/bin/env python3
"""Autonomous YouTube Agent - Environment & Tooling Verification Script.

Inspects Python, configuration, dependencies, and external prerequisites safely.
NEVER prints secret values.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

# Add backend to path to inspect settings
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))


def main() -> None:
    print("=" * 70)
    print("AUTONOMOUS YOUTUBE AGENT - ENVIRONMENT DIAGNOSTIC REPORT")
    print("=" * 70)

    # 1. Python Check
    py_version = sys.version.split()[0]
    print(f"\n[1] Python Runtime:")
    print(f"    - Version: {py_version}")
    print(f"    - Executable: {sys.executable}")
    if sys.version_info < (3, 10):
        print("    [!] WARNING: Python version is below 3.10. Upgrade recommended.")
    else:
        print("    [*] Python version is compatible.")

    # 2. Development Tooling
    print("\n[2] Development Tooling Availability:")
    tools = {
        "git": "git --version",
        "node": "node --version",
        "npm": "npm --version",
        "docker": "docker --version",
    }
    for tool, cmd in tools.items():
        path = shutil.which(tool)
        if path:
            try:
                out = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.DEVNULL).strip()
                print(f"    [*] {tool.capitalize()}: Available ({out})")
            except Exception:
                print(f"    [*] {tool.capitalize()}: Found binary at {path}")
        else:
            print(f"    [!] {tool.capitalize()}: NOT FOUND in PATH")

    # 3. Backend Configuration Check
    print("\n[3] Backend Configuration Status (Settings Inspection):")
    try:
        from app.core.config import get_settings
        settings = get_settings()

        print(f"    - App Name: {settings.APP_NAME}")
        print(f"    - Environment: {settings.APP_ENV}")
        print(f"    - Debug: {settings.APP_DEBUG}")
        print(f"    - CORS Origins: {settings.cors_origins}")
        print(f"    - Database URL Configured: {settings.is_database_configured}")
        print(f"    - OpenRouter Key Configured: {settings.is_openrouter_configured}")
        print(f"    - OpenRouter Planned Model: {settings.OPENROUTER_MODEL}")
        print(f"    - Google OAuth Client Configured: {settings.is_youtube_configured}")
        print(f"    - Token Encryption Key Configured: {bool(settings.GOOGLE_TOKEN_ENCRYPTION_KEY)}")
        print(f"    - Default Timezone: {settings.DEFAULT_TIMEZONE}")
    except Exception as exc:
        print(f"    [!] Failed to load application settings: {exc}")

    # 4. Storage & Filesystem Check
    print("\n[4] Local Storage & Media Directory:")
    media_dir = Path("temp_media")
    try:
        media_dir.mkdir(parents=True, exist_ok=True)
        print(f"    [*] Temporary media upload directory ready: {media_dir.resolve()}")
    except Exception as exc:
        print(f"    [!] Failed to ensure media directory: {exc}")

    print("\n" + "=" * 70)
    print("Environment diagnostic complete. No secrets were disclosed.")
    print("=" * 70)


if __name__ == "__main__":
    main()
