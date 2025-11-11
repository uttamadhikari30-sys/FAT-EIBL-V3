from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Date, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from datetime import date
from dotenv import load_dotenv
from pydantic import BaseModel
import os, shutil

# ================================================
# 1️⃣ Load Environment Variables & Database Setup
# ================================================
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ================================================
# 2️⃣ Local Models for Internal Tables (Task + Audit Log)
# ================================================
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


# ================================================
# 3️⃣ FastAPI App Initialization
# ================================================
app = FastAPI(title="FAT-EIBL (Edme) – API")

# Enable CORS for the frontend
allow = os.getenv("ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================================
# 4️⃣ Database Dependency
# ================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================================================
# 5️⃣ Import Routers (Users, Forgot Password)
# ================================================
from app.routers import users, forgot_password

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(forgot_password.router, prefix="/users", tags=["Forgot Password"])

# ================================================
# 6️⃣ Health Check Endpoint
# ================================================
@app.get("/health")
def health_check():
    """Simple endpoint to verify backend health"""
    return {"status": "ok", "message": "Backend is running properly"}

# ================================================
# 7️⃣ File Upload Handler (Optional)
# ================================================
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/{task_id}")
async def upload_file(task_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Attach a file to a specific task"""
    obj = db.get(Task, task_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")

    safe_name = f"task_{task_id}_" + os.path.basename(file.filename)
    dest = os.path.join(UPLOAD_DIR, safe_name)

    with open(dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    obj.attachment = safe_name
    db.add(AuditLog(action="upload", detail=f"Task ID {task_id} uploaded file {safe_name}"))
    db.commit()

    return {"task_id": task_id, "filename": safe_name}

# ================================================
# 8️⃣ Database Initialization Endpoint (/create-db)
# ================================================
from app.models.user import User
from app.models.otp import OtpModel
from app.database import Base as DBBase, engine as DBEngine

@app.get("/create-db")
def create_database():
    """
    🔧 Create all database tables if they don't exist.
    Run this once on Render or local after migrations.
    """
    try:
        DBBase.metadata.create_all(bind=DBEngine)
        Base.metadata.create_all(bind=engine)
        return {"ok": True, "message": "✅ All database tables created successfully"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
