from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Date, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel
from datetime import date
import os, shutil
from dotenv import load_dotenv

# ⬇️ your database bits
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ⬇️ import models so SQLAlchemy knows about User
from app import models
# … define Task/AuditLog classes …
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FAT-EIBL (Edme) – API")

# CORS
allow = os.getenv("ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# at the bottom: include users router
from app.routers import users
app.include_router(users.router, prefix="/users", tags=["Users"])
# --- TEMPORARY: Create Database Tables on Render ---
from app.models.user import User
from app.database import Base, engine

@app.get("/create-db")
def create_database():
    try:
        Base.metadata.create_all(bind=engine)
        return {"ok": True, "message": "Database tables created successfully"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

