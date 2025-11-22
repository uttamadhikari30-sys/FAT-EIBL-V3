# backend/app/main.py
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.orm import Session
from datetime import date
from dotenv import load_dotenv
import os
import shutil

# Load environment
load_dotenv()

from app.database import Base, engine, SessionLocal

# ------------------------------
# FastAPI Init
# ------------------------------
app = FastAPI(title="FAT-EIBL (Edme) – API")

# ------------------------------
# 🔥 FIXED CORS — FINAL
# ------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fat-eibl-frontend-x1sp.onrender.com",
        "http://localhost:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# DB Session
# ------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------------------
# Models
# ------------------------------
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


# ------------------------------
# Routers
# ------------------------------
from app.routers import users, forgot_password, auth

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(forgot_password.router, prefix="/auth", tags=["Forgot Password"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])


# ------------------------------
# Health Check
# ------------------------------
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend running"}


# ------------------------------
# File Upload
# ------------------------------
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


# ------------------------------
# Create DB Manually
# ------------------------------
@app.get("/create-db")
def create_db():
    try:
        Base.metadata.create_all(bind=engine)
        return {"ok": True, "message": "Tables created"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
