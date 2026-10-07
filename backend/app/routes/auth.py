from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.schemas.auth import (
    DeleteAccountRequest,
    LoginRequest,
    PasswordChange,
    ProfileUpdate,
    RegisterRequest,
    UserResponse,
)


from app.database.connection import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, UserResponse
from app.security.jwt import create_access_token
from app.security.password import hash_password, verify_password
from app.security.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.delete("/account")
def delete_account(
    request: DeleteAccountRequest,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(
        request.password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Password is incorrect.",
        )

    db.delete(current_user)
    db.commit()

    response.delete_cookie(
        key="access_token",
        path="/",
    )

    return {"message": "Account deleted successfully."}


@router.patch("/password")
def change_password(
    request: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(
        request.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect.",
        )

    current_user.password_hash = hash_password(
        request.new_password
    )

    db.commit()

    return {"message": "Password changed successfully."}

@router.patch("/profile", response_model=UserResponse)
def update_profile(
    request: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if request.name is not None:
        current_user.name = request.name

    if request.age is not None:
        current_user.age = request.age

    if request.gender is not None:
        current_user.gender = request.gender

    db.commit()
    db.refresh(current_user)

    return current_user

@router.get("/role")
def get_role(current_user: User = Depends(get_current_user)):
    return {"role": current_user.role}

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    username = request.username.strip().lower()
    email = str(request.email).strip().lower()

    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Passwords do not match.",
        )

    existing_username = db.scalar(
        select(User).where(User.username == username)
    )

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists.",
        )

    existing_email = db.scalar(
        select(User).where(User.email == email)
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists.",
        )

    password_hash = hash_password(request.password)

    user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        age=request.age,
        avatar=request.avatar,
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already exists.",
        )

    return user

@router.post("/login", response_model=UserResponse)
def login_user(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    identifier = request.username_or_email.strip().lower()

    user = db.scalar(
        select(User).where(
            (User.username == identifier) |
            (User.email == identifier)
        )
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password.",
        )

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password.",
        )

    token = create_access_token(user.id)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=30 * 60,
        path="/",
    )

    return user

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
    )

    return {"message": "Logged out successfully."}