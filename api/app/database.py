import os
import ssl
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

from app.config import settings


class Base(DeclarativeBase):
    pass


# Remove query params that asyncpg doesn't understand
db_url = settings.database_url.split("?")[0]

# Create SSL context for Neon
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Use NullPool for Lambda (no persistent connections), regular pool for server
is_lambda = bool(os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))

engine_kwargs = dict(
    echo=settings.debug,
    future=True,
    connect_args={"ssl": ssl_context},
)

if is_lambda:
    # Lambda: no connection pool — each invocation opens/closes its own connection
    engine_kwargs["poolclass"] = NullPool
else:
    # Server: use connection pool
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 5
    engine_kwargs["max_overflow"] = 10

engine = create_async_engine(db_url, **engine_kwargs)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
