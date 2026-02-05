#!/usr/bin/env python3
"""Update admin user credentials."""
import asyncio
import sys
sys.path.insert(0, '/Users/ut/Downloads/Portfolio-main/api')

from passlib.context import CryptContext
from sqlalchemy import select, update
from app.database import async_session_maker
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def update_admin():
    async with async_session_maker() as session:
        # Find admin user
        result = await session.execute(
            select(User).where(User.email == "admin@utworld.com")
        )
        user = result.scalar_one_or_none()

        if not user:
            print("Admin user not found")
            return

        # Update credentials
        new_email = "254utkarsh@gmail.com"
        new_password = "UTav@2523"
        new_hash = pwd_context.hash(new_password)

        await session.execute(
            update(User)
            .where(User.id == user.id)
            .values(email=new_email, password_hash=new_hash)
        )
        await session.commit()

        print(f"Updated admin user:")
        print(f"  Email: {new_email}")
        print(f"  Password: {new_password}")

if __name__ == "__main__":
    asyncio.run(update_admin())
