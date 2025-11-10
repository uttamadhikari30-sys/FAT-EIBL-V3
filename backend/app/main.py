from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Date, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel
from datetime import date
import os, shutil
from dotenv import load_dotenv

# ==============================
# 1️⃣ Load environment variables
# ==============================
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ==============================
# 2️⃣ Database models (Tasks, Audit Logs)
# ==============================
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


# ✅ Create all tables initially (will also be re-created by /create-db)
Base.metadata.create_all(bind=engine)


# ==============================
# 3️⃣ FastAPI app setup
# ==============================
app = FastAPI(title="FAT-EIBL (Edme) – API")

# ✅ Enable CORS for frontend
allow = os.getenv("ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# 4️⃣ Database dependency
# ==============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==============================
# 5️⃣ Import Routers (User + Forgot Password)
# ==============================
from app.routers import users, forgot_password

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(forgot_password.router, prefix="/users", tags=["Forgot Password"])


# ==============================
# 6️⃣ Health check
# ==============================
@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend is running"}


# ==============================
# 7️⃣ File Uploads (optional)
# ==============================
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload/{task_id}")
async def upload_file(task_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    obj = db.get(Task, task_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")

    safe_name = f"task_{task_id}_" + os.path.basename(file.filename)
    dest = os.path.join(UPLOAD_DIR, safe_name)

    with open(dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    obj.attachment = safe_name
    db.add(AuditLog(action="upload", detail=f"Task ID {task_id} file {safe_name}"))
    db.commit()

    return {"task_id": task_id, "filename": safe_name}


# ==============================
# 8️⃣ Emergency endpoint: Create database tables
# ==============================
from app.models.user import User
from app.database import Base as DBBase, engine as DBEngine


@app.get("/create-db")
def create_database():
    """
    🔧 Use this endpoint on Render once if tables fail to auto-create.
    """
    try:
        DBBase.metadata.create_all(bind=DBEngine)
        return {"ok": True, "message": "Database tables created successfully"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
