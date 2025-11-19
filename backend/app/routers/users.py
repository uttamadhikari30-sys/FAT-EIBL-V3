from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import hash_password, send_invite_email
from datetime import datetime, timedelta
import secrets, hashlib
import os

router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://fat-eibl-frontend.onrender.com")


# ------------------------------
# 1. SEND INVITE TO USER
# ------------------------------
@router.post("/invite")
def invite_user(name: str,
                email: str,
                department: str = None,
                manager_email: str = None,
                role: str = "auditee",
                db: Session = Depends(get_db)):

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # Create invite token
    token_raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token_raw.encode()).hexdigest()
    expiry = datetime.utcnow() + timedelta(hours=24)

    user = User(
        name=name,
        email=email,
        department=department,
        manager_email=manager_email,
        role=role,
        status="invited",
        invite_token_hash=token_hash,
        invite_expires_at=expiry,
        hashed_password=None,
        first_login=True
    )

    db.add(user)
    db.commit()

    invite_link = f"{FRONTEND_URL}/set-password?email={email}&token={token_raw}"

    try:
        send_invite_email(email, invite_link)
    except Exception as e:
        print("Email failed:", e)

    return {"ok": True, "message": "Invite sent"}


# ------------------------------
# 2. COMPLETE INVITE
# ------------------------------
@router.post("/complete-invite")
def complete_invite(email: str,
                    token: str,
                    password: str,
                    db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()
    if not user or user.status != "invited":
        raise HTTPException(status_code=400, detail="Invalid invite")

    if datetime.utcnow() > user.invite_expires_at:
        raise HTTPException(status_code=400, detail="Invite expired")

    # Validate token
    if hashlib.sha256(token.encode()).hexdigest() != user.invite_token_hash:
        raise HTTPException(status_code=400, detail="Invalid token")

    user.hashed_password = hash_password(password)
    user.status = "active"
    user.invite_token_hash = None
    user.invite_expires_at = None
    user.first_login = False

    db.commit()

    return {"ok": True, "message": "Password set successfully"}


# ------------------------------
# 3. GET USERS
# ------------------------------
@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


# ------------------------------
# 4. DELETE USER
# ------------------------------
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):

    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(u)
    db.commit()
    return {"ok": True}
