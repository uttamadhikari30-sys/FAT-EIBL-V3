from fastapi import APIRouter, Depends, HTTPException, Form
from passlib.hash import bcrypt
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

router = APIRouter()

# List all users
@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# Create new user
@router.post("/")
def create_user(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    department: str = Form(None),
    role: str = Form("auditee"),
    manager_email: str = Form(None),
    db: Session = Depends(get_db),
):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    user = User(
        name=name,
        email=email,
        hashed_password=bcrypt.hash(password),
        department=department,
        role=role,
        manager_email=manager_email,
    )
    db.add(user)
    db.commit()
    return {"ok": True}

# Delete user
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"ok": True}

# ✅ Login route
@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if not user or not bcrypt.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "status": "ok",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
        }
    }
