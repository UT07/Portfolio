from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DBSession
from app.schemas.user import Token, UserLogin, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login(db: DBSession, credentials: UserLogin):
    user = await AuthService.authenticate(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return AuthService.create_tokens(str(user.id))


@router.post("/refresh", response_model=Token)
async def refresh_token(db: DBSession, refresh_token: str):
    tokens = await AuthService.refresh_tokens(db, refresh_token)
    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    return tokens


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: CurrentUser):
    return current_user
