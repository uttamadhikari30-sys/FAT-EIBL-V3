from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import shutil
from datetime import date

# Load .env
load_dotenv()

from app.database import Base, engine, SessionLocal

# ---------------------------------------------------------
# 1️⃣ INITIALIZE APP
# ---------------------------------------------------------
app = FastAPI(title="FAT-EIBL API", version="3.0")

# ---------------------------------------------------------
# 2️⃣ FIXED — FULL CORS FOR FRONTEND + OTP + LOGIN
# ---------------------------------------------------------

# ⭐ IMPORTANT: Add your Render frontend domain here ⭐
allowed_origins = [
    "https://fat-eibl-frontend-x1sp.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"     # keep this for safe wildcard
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 3️⃣ DATABASE SESSION
# ---------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------------
# 4️⃣ ROUTERS
# ---------------------------------------------------------
from app.routers import auth, users, forgot_password

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(forgot_password.router, prefix="/auth", tags=["Forgot Password"])

# ---------------------------------------------------------
# 5️⃣ HEALTH CHECK
# ---------------------------------------------------------
@app.get("/health")
def health():
    return {"ok": True, "message": "Backend running"}

# ---------------------------------------------------------
# 6️⃣ CREATE TABLES
# ---------------------------------------------------------
from app.models.user import User
from app.models.otp import OtpModel

@app.get("/create-db")
def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        return {"ok": True, "message": "Tables created"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
