from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import hash_password, send_invite_email
from datetime import datetime, timedelta
import secrets, hashlib

router = APIRouter()


# ------------------------------------------------------
# 1. SEND INVITE (called from frontend AdminUsers.jsx)
# ------------------------------------------------------
@router.post("/invite")
def invite_user(
    name: str,
    email: str,
    department: str = None,
    manager_email: str = None,
    role: str = "auditee",
    db: Session = Depends(get_db),
):
    # Check if user exists
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Generate invite token
    raw_token = secrets.token_urlsafe(32)
    hashed_token = hashlib.sha256(raw_token.encode()).hexdigest()
    expiry = datetime.utcnow() + timedelta(hours=24)

    # Create user
    user = User(
        name=name,
        email=email,
        department=department,
        manager_email=manager_email,
        role=role,
        status="invited",
        invite_token_hash=hashed_token,
        invite_expires_at=expiry,
        first_login=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Invite link
    invite_link = f"https://{YOUR_RENDER_FRONTEND_DOMAIN}/set-password?token={raw_token}&email={email}"

    # Send invite email
    try:
        send_invite_email(email, invite_link)
    except Exception as e:
        print("Failed to send invite email:", e)

    return {"ok": True, "message": "Invite sent successfully"}


# ------------------------------------------------------
# 2. COMPLETE INVITATION (User sets password)
# ------------------------------------------------------
@router.post("/complete-invite")
def complete_invite(
    email: str,
    token: str,
    password: str,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()

    if not user or user.status != "invited":
        raise HTTPException(status_code=400, detail="Invalid invitation")

    # Check expiry
    if datetime.utcnow() > user.invite_expires_at:
        raise HTTPException(status_code=400, detail="Invite expired")

    # Verify token
    hashed_input = hashlib.sha256(token.encode()).hexdigest()
    if hashed_input != user.invite_token_hash:
        raise HTTPException(status_code=400, detail="Invalid token")

    # Set password & activate
    user.password = hash_password(password)
    user.status = "active"
    user.invite_token_hash = None
    user.invite_expires_at = None

    db.commit()
    db.refresh(user)

    return {"ok": True, "message": "Password set successfully. You may login now."}


# ------------------------------------------------------
# 3. GET USERS (Used by AdminUsers.jsx)
# ------------------------------------------------------
@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


# ------------------------------------------------------
# 4. DELETE USER (Used by AdminUsers.jsx)
# ------------------------------------------------------
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"ok": True, "message": "User deleted"}
