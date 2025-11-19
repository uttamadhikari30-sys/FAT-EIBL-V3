from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import hash_password, send_invite_email
from datetime import datetime, timedelta
import secrets, hashlib

router = APIRouter()


# -------------------------------
# REQUEST PASSWORD RESET EMAIL
# -------------------------------
@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    # Generate reset token
    token_raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token_raw.encode()).hexdigest()
    expiry = datetime.utcnow() + timedelta(minutes=30)

    # Save
    user.reset_token_hash = token_hash
    user.reset_expires_at = expiry
    db.commit()

    # Create link
    reset_link = f"https://fat-eibl-frontend.onrender.com/reset-password?email={email}&token={token_raw}"

    send_invite_email(email, reset_link)

    return {"ok": True, "message": "Password reset email sent"}


# -------------------------------
# RESET PASSWORD (Frontend form)
# -------------------------------
@router.post("/reset-password")
def reset_password(email: str, token: str, new_password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # expired?
    if user.reset_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset token expired")

    # wrong token?
    if hashlib.sha256(token.encode()).hexdigest() != user.reset_token_hash:
        raise HTTPException(status_code=400, detail="Invalid reset token")

    # update password
    user.hashed_password = hash_password(new_password)
    user.reset_token_hash = None
    user.reset_expires_at = None

    db.commit()

    return {"ok": True, "message": "Password reset successfully"}
