from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas
from app.auth import (
    get_current_user,
    require_admin,
    verify_password,
    get_password_hash,
    create_access_token
)
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, request.username)
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/init")
def init_admin(request: schemas.InitAdminRequest, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, request.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin user already exists"
        )

    user = crud.create_user(db, schemas.UserCreate(
        username=request.username,
        password=request.password,
        role="admin"
    ))
    return {"message": "Admin user created successfully", "user_id": user.id}


@router.post("/change-password")
def change_password(
    request: schemas.ChangePasswordRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if not verify_password(request.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )

    current_user.password_hash = get_password_hash(request.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.post("/create-user")
def create_viewer(
    request: schemas.UserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create a viewer user (admin only)"""
    existing = crud.get_user_by_username(db, request.username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    user = crud.create_user(db, request)
    return {"message": "User created successfully", "user_id": user.id}
