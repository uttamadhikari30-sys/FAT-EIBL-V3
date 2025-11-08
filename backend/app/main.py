from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
import os, shutil
from dotenv import load_dotenv
import requests

# ✅ Import from database (moved get_db here to avoid circular import)
from app.database import Base, engine, get_db

# ✅ Import users router (no circular import now)
from app.routers import users

# Optional OpenAI
try:
    from openai import OpenAI
except Exception:
    OpenAI = None

# Load environment variables
load_dotenv()

# === FastAPI App ===
app = FastAPI(title="FAT-EIBL (Edme) – API")

# === CORS ===
allow = os.getenv("ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Models (local models only for tasks/audit) ===
from sqlalchemy import Column, Integer, String, Date, Text

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

# ✅ Create all tables (includes Task, AuditLog, and user models)
Base.metadata.create_all(bind=engine)

# === Pydantic Schemas ===
class TaskCreate(BaseModel):
    title: str
    department: str | None = None
    assignee: str | None = None
    status: str = "Pending"
    due_date: date | None = None
    priority: str | None = None
    remarks: str | None = None

class TaskOut(BaseModel):
    id: int
    title: str
    department: str | None
    assignee: str | None
    status: str
    due_date: date | None
    priority: str | None
    remarks: str | None
    attachment: str | None

    class Config:
        from_attributes = True

# === Routes ===

@app.get("/health")
def health():
    return {"status": "ok"}

# --- TASK CRUD ---
@app.get("/tasks", response_model=list[TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.due_date.is_(None), Task.due_date).all()

@app.post("/tasks", response_model=TaskOut)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    obj = Task(**task.dict())
    db.add(obj)
    db.add(AuditLog(action="create", detail=f"Task: {obj.title}"))
    db.commit()
    db.refresh(obj)
    return obj

@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    obj = db.get(Task, task_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")
    for k, v in task.dict().items():
        setattr(obj, k, v)
    db.add(AuditLog(action="update", detail=f"Task ID {task_id}"))
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    obj = db.get(Task, task_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(obj)
    db.add(AuditLog(action="delete", detail=f"Task ID {task_id}"))
    db.commit()
    return {"ok": True}

# --- UPLOAD ---
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

# --- SEED ---
@app.get("/seed")
def seed(db: Session = Depends(get_db)):
    if db.query(Task).count() == 0:
        for t in [
            Task(title="IRDAI Filing Q3", department="Compliance", assignee="Darpan", status="Pending", priority="High"),
            Task(title="Statutory Audit FY 24-25", department="Accounts", assignee="Priya", status="In Progress", priority="High"),
            Task(title="Investment Reconciliation", department="Ops", assignee="Rakesh", status="Pending", priority="Medium"),
        ]:
            db.add(t)
        db.add(AuditLog(action="seed", detail="Sample tasks added"))
        db.commit()
    return {"seeded": True}

# --- AI CHAT ---
@app.post("/ai/chat")
def ai_chat(prompt: str = Form(...)):
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key or OpenAI is None:
        return {"reply": "AI is not configured. Please set OPENAI_API_KEY in backend/.env."}
    client = OpenAI(api_key=api_key)
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are Vani, an AI assistant for an audit tracker."},
                {"role": "user", "content": prompt}
            ]
        )
        return {"reply": resp.choices[0].message.content}
    except Exception as e:
        return {"reply": f"AI error: {e}"}

# --- USER ROUTES ---
app.include_router(users.router, prefix="/users", tags=["Users"])

