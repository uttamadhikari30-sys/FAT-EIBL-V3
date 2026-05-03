from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.utils.security import verify_password, create_access_token

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

    user = db.query(User).filter(User.email == email).first()
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
