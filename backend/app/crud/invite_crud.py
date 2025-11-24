from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets, hashlib
from passlib.context import CryptContext
from app.models.invite import Invite
from app.models.user import User

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_token(token):
    return hashlib.sha256(token.encode()).hexdigest()

def create_invite(db: Session, email: str, role: str):
    raw = secrets.token_urlsafe(32)
    token_hash = hash_token(raw)

    invite = Invite(
        email=email,
        token_hash=token_hash,
        role=role,
        expires_at=datetime.utcnow() + timedelta(hours=72)
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    return raw   # this is sent to user in email


def accept_invite(db: Session, email: str, raw_token: str, password: str):
    token_hash = hash_token(raw_token)

    invite = db.query(Invite).filter(
        Invite.email == email,
        Invite.token_hash == token_hash
    ).first()

    if not invite:
        raise Exception("Invalid link")

    if invite.used:
        raise Exception("Link already used")

    if invite.expires_at < datetime.utcnow():
        raise Exception("Invite expired")

    hashed_pwd = pwd.hash(password)

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(email=email, hashed_password=hashed_pwd)
        db.add(user)
    else:
        user.hashed_password = hashed_pwd

    invite.used = True
    invite.used_at = datetime.utcnow()

    db.commit()

    return user
