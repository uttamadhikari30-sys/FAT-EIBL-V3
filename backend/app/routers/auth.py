from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.auth import LoginSchema
from app.utils.security import verify_password

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.hashed_password:
        raise HTTPException(status_code=401, detail="Password login disabled")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "ok": True,
        "email": user.email,
        "role": user.role,
    }
