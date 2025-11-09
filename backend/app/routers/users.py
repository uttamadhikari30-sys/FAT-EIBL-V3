from fastapi import APIRouter, Depends, HTTPException, Form
from passlib.hash import bcrypt
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

# ✅ Define router (this line is crucial)
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
    try:
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
    except Exception as e:
        return {"ok": False, "error": str(e)}

# ✅ Login route
@router.post("/login")
def login_user(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user or not bcrypt.verify(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return {
            "ok": True,
            "message": "Login successful",
            "user": {"id": user.id, "name": user.name, "role": user.role},
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}

# ✅ Get all users
@router.get("/")
def list_users(db: Session = Depends(get_db)):
    try:
        return db.query(User).all()
    except Exception as e:
        return {"ok": False, "error": str(e)}

# ✅ Delete user
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        db.delete(user)
        db.commit()
        return {"ok": True, "message": "User deleted"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

# ✅ Check Admin Users
@router.get("/check-admin")
def check_admin(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        return {"count": len(users), "users": [u.email for u in users]}
    except Exception as e:
        return {"ok": False, "error": str(e)}

# ✅ Seed Admin User (One-Time Setup) – FIXED bcrypt byte issue
@router.post("/seed-admin")
def seed_admin(db: Session = Depends(get_db)):
    try:
        email = "admin@edmeinsurance.com"
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return {"ok": True, "note": "Admin already exists"}

        # --- Fix bcrypt 72-byte password limit ---
        raw_password = "Edme@123"
        encoded = raw_password.encode("utf-8")
        if len(encoded) > 72:
            encoded = encoded[:72]
        safe_password = encoded.decode("utf-8", "ignore")
        hashed_password = bcrypt.hash(safe_password)
        # ------------------------------------------

        admin = User(
            name="Admin",
            email=email,
            hashed_password=hashed_password,
            department="Finance",
            role="admin",
            manager_email=None,
        )
        db.add(admin)
        db.commit()
        return {"ok": True, "note": "Admin created successfully"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
