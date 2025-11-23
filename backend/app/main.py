# backend/app/main.py
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import shutil
from datetime import date

# Load env
load_dotenv()

from app.database import Base, engine, SessionLocal

# -------------------------------------------------------------------
# App init
# -------------------------------------------------------------------
app = FastAPI(title="FAT-EIBL Backend API")

# -------------------------------------------------------------------
# CORS - allow everything for debugging; change to production origins later
# -------------------------------------------------------------------
# NOTE: For quick debugging set allow_origins=["*"]. After confirm working,
# set to your exact frontend URL(s) e.g. ["https://fat-eibl-frontend-x1sp.onrender.com"].
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- change to specific origin list in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# DB dependency
# -------------------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------------------------------------------
# Minimal internal models used in this file
# -------------------------------------------------------------------
from sqlalchemy import Column, Integer, String, Date, Text

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    department = Column(String(100))
    assignee = Column(String(100))
    status = Column(String(50), default="Pending")
    due_date = Column(Date)
    priority = Column(String(20))
    remarks = Column(Text)
    attachment = Column(String(255))

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    action = Column(String(50))
    detail = Column(Text)

# -------------------------------------------------------------------
# Routers
# -------------------------------------------------------------------
from app.routers import auth, users, forgot_password

# keep router prefixes same as frontend expects: /auth/...
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
# your forgot password router previously used prefix "/forgot" - keep same
app.include_router(forgot_password.router, prefix="/forgot", tags=["Forgot Password"])

# -------------------------------------------------------------------
# Health check
# -------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# -------------------------------------------------------------------
# Upload file
# -------------------------------------------------------------------
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/{task_id}")
async def upload_file(task_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    filename = f"task_{task_id}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    task.attachment = filename
    db.commit()

    return {"ok": True, "file": filename}

# ------------------------------
# Create DB
# ------------------------------
from app.models.user import User
from app.models.otp import OtpModel

@app.get("/create-db")
def create_db():
    Base.metadata.create_all(bind=engine)
    return {"ok": True, "msg": "All tables created"}


# -------------------------------------------------------------------
# CREATE DEFAULT ADMIN (Run only once)
# -------------------------------------------------------------------
@app.get("/create-admin")
def create_admin():
    from app.database import SessionLocal
    from app.models.user import User
    from app.utils.auth import hash_password

    db = SessionLocal()

    existing = db.query(User).filter(User.email == "admin@edmeinsurance.com").first()
    if existing:
        return {"ok": True, "msg": "Admin already exists"}

    admin = User(
        email="admin@edmeinsurance.com",
        hashed_password=hash_password("Edme@123"),
        role="admin",
        first_login=False
    )

    db.add(admin)
    db.commit()
    db.close()

    return {"ok": True, "msg": "Admin created successfully"}