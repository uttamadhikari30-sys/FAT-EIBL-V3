# app/routers/auth.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User

router = APIRouter()

@router.post("/login-otp")
def login_with_otp(email: str, otp: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not user.otp_code or user.otp_code != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if not user.otp_expires_at or datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")

    # OTP valid -> clear otp_code (optional)
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()

    # Return first_login so frontend knows to redirect
    return {"ok": True, "first_login": user.first_login, "user_id": user.id}
from app.utils.auth import hash_password

@router.post("/reset-password")
def reset_password(user_id: int, new_password: str, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(new_password)
    user.first_login = False
    db.commit()
    return {"ok": True, "message": "Password updated"}