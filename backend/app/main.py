# backend/app/main.py
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os, shutil
from datetime import date

load_dotenv()

from app.database import Base, engine, SessionLocal

app = FastAPI(title="FAT-EIBL Backend API")

# --- TEMP: Allow everyone (fix CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------ INTERNAL MODELS (Tasks + Logs) ------------
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

# ------------ ROUTERS ------------
from app.routers import auth, users, forgot_password
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(forgot_password.router, prefix="/forgot", tags=["Forgot Password"])

# ------------ HEALTH CHECK ------------
@app.get("/health")
def health():
    return {"status": "ok"}

# ------------ FILE UPLOAD ------------
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

# ------------ CREATE TABLES ------------
from app.models.user import User
from app.models.otp import OtpModel

@app.get("/create-db")
def create_db():
    Base.metadata.create_all(bind=engine)
    return {"ok": True, "msg": "All tables created"}

# ------------ SEED ADMIN USER ------------
SEED_SECRET = os.getenv("SEED_SECRET", "devseed123")

@app.get("/seed-admin")
def seed_admin(secret: str = Query(None), db: Session = Depends(get_db)):
    if secret != SEED_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")

    from app.utils.auth import hash_password

    exists = db.query(User).filter(User.email == "admin@edmeinsurance.com").first()
    if exists:
        return {"ok": True, "message": "Admin already exists"}

    admin = User(
        email="admin@edmeinsurance.com",
        hashed_password=hash_password("Edme@123"),
        role="admin",
        first_login=False
    )
    db.add(admin)
    db.commit()

    return {"ok": True, "message": "Admin created"}
