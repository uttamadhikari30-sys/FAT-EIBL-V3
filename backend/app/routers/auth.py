# app/routers/auth.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.utils.auth import hash_password, verify_password

router = APIRouter()


# -----------------------------------------
# 1. LOGIN USING EMAIL + PASSWORD
# -----------------------------------------
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not user.hashed_password:
        raise HTTPException(status_code=400, detail="Password not set. Use invite link or reset password.")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Standardised response
    return {
        "ok": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "first_login": user.first_login
        }
    }


# -----------------------------------------
# 2. LOGIN USING OTP
# -----------------------------------------
@router.post("/login-otp")
def login_with_otp(email: str, otp: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Prevent crash: check attributes exist
    if not hasattr(user, "otp_code") or not hasattr(user, "otp_expires_at"):
        raise HTTPException(status_code=400, detail="OTP not enabled for this user")

    if not user.otp_code or user.otp_code != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if not user.otp_expires_at or datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")

    user.otp_code = None
    user.otp_expires_at = None
    db.commit()

    return {
        "ok": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "first_login": user.first_login
        }
    }


# -----------------------------------------
# 3. RESET PASSWORD
# -----------------------------------------
@router.post("/reset-password")
def reset_password(user_id: int, new_password: str, db: Session = Depends(get_db)):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(new_password)
    user.first_login = False
    db.commit()

    return {
        "ok": True,
        "message": "Password updated successfully"
    }
