#!/usr/bin/env python3
"""Create the test database if it does not exist."""
import os
import asyncio
from urllib.parse import urlparse, urlunparse

import asyncpg


def get_database_url() -> str:
    env_url = os.getenv("DATABASE_URL")
    if env_url:
        return env_url

    # Fallback to api/.env if present
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    try:
        with open(env_path, "r", encoding="utf-8") as handle:
            for line in handle:
                if line.startswith("DATABASE_URL="):
                    return line.split("=", 1)[1].strip()
    except FileNotFoundError:
        pass

    raise RuntimeError("DATABASE_URL not found in environment or api/.env")


def to_sync_dsn(dsn: str) -> str:
    if dsn.startswith("postgresql+asyncpg://"):
        return dsn.replace("postgresql+asyncpg://", "postgresql://", 1)
    return dsn


async def main() -> None:
    dsn = to_sync_dsn(get_database_url())
    parsed = urlparse(dsn)
    db_name = parsed.path.lstrip("/")
    test_db = f"test_{db_name}"

    conn = await asyncpg.connect(dsn)
    try:
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname=$1",
            test_db,
        )
        if exists:
            print(f"✓ Test database already exists: {test_db}")
            return

        await conn.execute(f'CREATE DATABASE "{test_db}"')
        print(f"✓ Created test database: {test_db}")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
