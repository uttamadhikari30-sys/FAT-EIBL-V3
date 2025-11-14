# app/routers/users.py (or your existing users router)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import hash_password, generate_otp, otp_expiry, send_otp_email
from datetime import datetime

router = APIRouter()

@router.post("/")
def create_user(
    name: str,
    email: str,
    password: str,
    department: str = None,
    manager_email: str = None,
    role: str = "auditee",
    db: Session = Depends(get_db),
):
    # check exist
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(password)
    otp = generate_otp()
    expiry = otp_expiry(10)

    user = User(
        name=name,
        email=email,
        password=hashed,
        department=department,
        manager_email=manager_email,
        role=role,
        otp_code=otp,
        otp_expires_at=expiry,
        first_login=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # send mail (async if you prefer background task)
    try:
        send_otp_email(email, otp)
    except Exception as e:
        # log error but user exists now — you can rollback if you prefer
        print("Warning: failed to send OTP", e)

    return {"ok": True, "message": "User created and OTP sent"}
