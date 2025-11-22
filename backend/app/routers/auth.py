# backend/app/routers/auth.py
from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.utils.auth import hash_password, verify_password

router = APIRouter()

# Request models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class OtpLoginRequest(BaseModel):
    email: EmailStr
    otp: str

class GenerateOtpRequest(BaseModel):
    email: EmailStr

# -----------------------------------------
# 1. LOGIN USING EMAIL + PASSWORD (JSON body)
# -----------------------------------------
@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = payload.email
    password = payload.password

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # attribute naming: hashed_password used in your model
    if not getattr(user, "hashed_password", None):
        raise HTTPException(status_code=400, detail="Password not set. Use invite link or reset password.")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

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
# Generate OTP (accept JSON)
# -----------------------------------------
@router.post("/generate-otp")
def generate_otp(payload: GenerateOtpRequest, db: Session = Depends(get_db)):
    email = payload.email
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # call existing util to set otp + send email; adapt depending on your util names
    from app.utils.auth import generate_otp, send_otp_email, otp_expiry
    otp_val = generate_otp()
    user.otp_code = otp_val
    user.otp_expires_at = datetime.utcnow() + otp_expiry()
    db.commit()
    try:
        send_otp_email(user.email, otp_val)
    except Exception as e:
        # don't fail creation if email sending fails; still return ok (or you can surface error)
        print("Warning: OTP send failed:", e)

    return {"ok": True, "message": "OTP sent if email exists"}

# -----------------------------------------
# 2. LOGIN USING OTP (JSON)
# -----------------------------------------
@router.post("/login-otp")
def login_with_otp(payload: OtpLoginRequest, db: Session = Depends(get_db)):
    email = payload.email
    otp = payload.otp
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not getattr(user, "otp_code", None):
        raise HTTPException(status_code=400, detail="OTP not enabled for this user")

    if user.otp_code != otp:
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
# 3. RESET PASSWORD (unchanged)
# -----------------------------------------
class ResetPasswordRequest(BaseModel):
    user_id: int
    new_password: str

@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(payload.new_password)
    user.first_login = False
    db.commit()
    return {"ok": True, "message": "Password updated successfully"}
