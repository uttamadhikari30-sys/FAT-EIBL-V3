from fastapi import APIRouter, Depends, HTTPException, Form
from passlib.hash import bcrypt
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

router = APIRouter()

# ✅ Create a new user
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
    return {"ok": True, "message": "User created successfully"}

# ✅ Login route
@router.post("/login")
def login_user(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user or not bcrypt.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user": {"id": user.id, "name": user.name, "role": user.role}}

# ✅ Get all users
@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# ✅ Delete user
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"ok": True, "message": "User deleted"}
@router.get("/check-admin")
def check_admin(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"count": len(users), "users": [u.email for u in users]}
# ✅ Seed Admin User (one-time setup)
@router.post("/seed-admin")
def seed_admin(db: Session = Depends(get_db)):
    from passlib.hash import bcrypt

    email = "admin@edmeinsurance.com"
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return {"ok": True, "note": "Admin already exists"}

    admin = User(
        name="Admin",
        email=email,
        hashed_password=bcrypt.hash("Edme@123"),
        department="Finance",
        role="admin",
        manager_email=None,
    )
    db.add(admin)
    db.commit()
    return {"ok": True, "note": "Admin created"}


