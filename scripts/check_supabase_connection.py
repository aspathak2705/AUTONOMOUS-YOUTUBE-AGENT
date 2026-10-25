#!/usr/bin/env python3
"""Autonomous YouTube Agent - Supabase / PostgreSQL Connection Diagnostic.

Safely tests database connectivity with short timeout using SELECT 1.
NEVER prints connection strings or passwords.
"""

import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.core.config import get_settings
from app.db.session import check_database_health


def main() -> None:
    print("=" * 70)
    print("SUPABASE POSTGRESQL CONNECTIVITY CHECK")
    print("=" * 70)

    settings = get_settings()

    if not settings.is_database_configured:
        print("[!] No DATABASE_URL configured in environment or .env file.")
        print("[*] To connect to Supabase:")
        print("    1. Go to Supabase Project Settings -> Database")
        print("    2. Copy connection string (URI) using Session Pooler (port 6543) or Direct (port 5432)")
        print("    3. Add DATABASE_URL to your .env file")
        print("    Example: DATABASE_URL=postgresql+psycopg://postgres.PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?sslmode=require")
        sys.exit(1)

    print("[*] DATABASE_URL detected. Attempting short-timeout connection ping...")
    result = check_database_health(settings)

    print(f"[*] Connection status: {result['status'].upper()}")
    print(f"[*] Details: {result['message']}")

    if result["status"] == "connected":
        print("[*] Supabase database connectivity verified successfully!")
        sys.exit(0)
    else:
        print("[!] Unable to reach database. Please check credentials, IP allowlists, or Supabase pooler status.")
        sys.exit(2)


if __name__ == "__main__":
    main()
