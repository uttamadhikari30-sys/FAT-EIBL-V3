from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.orm import Session
from datetime import date, datetime
from dotenv import load_dotenv
import os, shutil

# Load env
load_dotenv()

from app.database import Base, engine, SessionLocal

# Example simple models (shared Base)
class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    assignee = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, default="Pending")
    due_date = Column(Date, nullable=True)
    priority = Column(String(20), nullable=True)
    remarks = Column(Text, nullable=True)
    attachment = Column(String(255), nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    action = Column(String(50))
    detail = Column(Text)

# App init
app = FastAPI(title="FAT-EIBL (Edme) – API")

# CORS configuration
# Use ALLOW_ORIGINS env variable (comma separated) or fallback to frontend origin during dev
allow_origins_env = os.getenv("ALLOW_ORIGINS")
if allow_origins_env:
    allowed_origins = [o.strip() for o in allow_origins_env.split(",") if o.strip()]
else:
    # safe default for local dev: allow localhost; for production set ALLOW_ORIGINS explicitly
    allowed_origins = ["http://localhost:5173", "http://localhost:3000", "https://fat-eibl-frontend-x1sp.onrender.com"]

# If you need credentials (cookies/auth), ensure allow_credentials=True and use exact origins (not "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Include routers (auth, users, forgot_password)
from app.routers import users, forgot_password, auth
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(forgot_password.router, prefix="/auth", tags=["Forgot Password"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

# Simple health
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend running"}

# Upload endpoint (example)
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/{task_id}")
async def upload_file(task_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    filename = f"task_{task_id}_" + os.path.basename(file.filename)
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    task.attachment = filename
    db.add(AuditLog(action="upload", detail=f"File uploaded for task {task_id}"))
    db.commit()
    return {"ok": True, "filename": filename}

# Create tables endpoint (one-time)
from app.models.user import User
from app.models.otp import OtpModel

@app.get("/create-db")
def create_db():
    try:
        Base.metadata.create_all(bind=engine)
        return {"ok": True, "message": "Tables created"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
