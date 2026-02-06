#!/usr/bin/env python3
"""Update admin user credentials.

Usage:
    cd api
    python -m scripts.update_admin --email new@example.com --password NewSecurePass123
"""
import argparse
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from passlib.context import CryptContext
from sqlalchemy import select, update
from app.database import async_session_maker
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def update_admin(old_email: str, new_email: str, new_password: str):
    async with async_session_maker() as session:
        result = await session.execute(
            select(User).where(User.email == old_email)
        )
        user = result.scalar_one_or_none()

        if not user:
            print(f"Admin user with email '{old_email}' not found")
            return

        new_hash = pwd_context.hash(new_password)

        await session.execute(
            update(User)
            .where(User.id == user.id)
            .values(email=new_email, password_hash=new_hash)
        )
        await session.commit()

        print(f"Updated admin user:")
        print(f"  Old email: {old_email}")
        print(f"  New email: {new_email}")
        print(f"  Password:  (updated)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update admin user credentials")
    parser.add_argument("--old-email", required=True, help="Current admin email")
    parser.add_argument("--email", required=True, help="New email address")
    parser.add_argument("--password", required=True, help="New password")
    args = parser.parse_args()
    asyncio.run(update_admin(args.old_email, args.email, args.password))
