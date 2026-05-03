import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

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
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password required"
        )

    user = db.query(User).filter(User.email == email).first()

    admin_email = os.getenv("ADMIN_EMAIL", "admin@edmeinsurance.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "Edme@123")

        # Emergency bootstrap path: allow configured admin credentials and repair DB row
    if email == admin_email and password == admin_password:
        if not user:
            user = User(
                email=admin_email,
                hashed_password=get_password_hash(admin_password),
                role="admin",
                first_login=False,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        elif not (user.hashed_password or user.password):
            user.hashed_password = get_password_hash(admin_password)
            user.first_login = False
            db.commit()

    stored_hash = user.hashed_password or user.password if user else None

    is_valid_password = False
    if user and stored_hash:
        try:
            is_valid_password = verify_password(password, stored_hash)
        except Exception:
            # Backward compatibility: some old rows stored plain text in `password`
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
