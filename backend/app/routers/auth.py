import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.user import User
from app.utils.security import verify_password, create_access_token, get_password_hash

router = APIRouter()

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password required"
        )

    user = db.query(User).filter(func.lower(User.email) == email).first()

    admin_email = os.getenv("ADMIN_EMAIL", "admin@edmeinsurance.com").strip().lower()
    admin_password = os.getenv("ADMIN_PASSWORD", "Edme@123")

    # deterministic admin access: if configured admin credentials are provided,
    # ensure the database row is synchronized and allow login
    if email == admin_email and password == admin_password:
        if not user:
            user = User(email=admin_email, role="admin", first_login=False)
            db.add(user)
        user.hashed_password = get_password_hash(admin_password)
        user.first_login = False
        db.commit()
        db.refresh(user)

    stored_hash = user.hashed_password or user.password if user else None

    is_valid_password = False
    if user and stored_hash:
        try:
            is_valid_password = verify_password(password, stored_hash)
        except Exception:
            # Backward compatibility for very old rows that may store plain passwords
            is_valid_password = password == stored_hash

    if not user or not stored_hash or not is_valid_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token({"sub": user.email, "role": user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": user.email,
        "role": user.role
    }
