#!/usr/bin/env python3
"""
Create or reset the admin user in the database.

Usage:
    cd api
    python -m scripts.seed_admin

Or with custom credentials:
    python -m scripts.seed_admin --email admin@example.com --password MySecurePass123
"""
import argparse
import asyncio
import sys
import os

# Add parent dir to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from passlib.context import CryptContext
from sqlalchemy import select
from app.database import async_session_maker
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_EMAIL = os.environ.get("ADMIN_EMAIL", "")
DEFAULT_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


async def seed_admin(email: str, password: str):
    async with async_session_maker() as session:
        # Check if user exists
        result = await session.execute(
            select(User).where(User.email == email)
        )
        existing = result.scalar_one_or_none()

        hashed = pwd_context.hash(password)

        if existing:
            existing.password_hash = hashed
            existing.is_active = True
            existing.role = "admin"
            await session.commit()
            print(f"Updated existing admin user: {email}")
        else:
            user = User(
                email=email,
                password_hash=hashed,
                name="Admin",
                role="admin",
                is_active=True,
            )
            session.add(user)
            await session.commit()
            print(f"Created new admin user: {email}")

        print(f"  Email:    {email}")
        print(f"  Password: {password}")
        print(f"  Role:     admin")
        print(f"  Active:   True")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed admin user")
    parser.add_argument("--email", default=DEFAULT_EMAIL)
    parser.add_argument("--password", default=DEFAULT_PASSWORD)
    args = parser.parse_args()

    if not args.email or not args.password:
        print("Error: Email and password required.")
        print("  Usage: python -m scripts.seed_admin --email you@example.com --password YourSecurePass")
        print("  Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.")
        sys.exit(1)

    asyncio.run(seed_admin(args.email, args.password))
