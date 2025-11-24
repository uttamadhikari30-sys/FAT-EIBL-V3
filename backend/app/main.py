from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import shutil

# Load env
load_dotenv()

# ---------------------------------------------------------
# INIT APP
# ---------------------------------------------------------
app = FastAPI(title="FAT-EIBL Backend API")

# ---------------------------------------------------------
# CORS — MUST BE AT THE TOP BEFORE ROUTERS
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fat-eibl-frontend-x1sp.onrender.com",  # your frontend
        "http://localhost:3000",                        # local dev
        "*"                                             # allow all (fallback)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# IMPORT DB
# ---------------------------------------------------------
from app.database import Base, engine, SessionLocal

# ---------------------------------------------------------
# DB Dependency
# ---------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------------
# IMPORT ROUTERS (AFTER CORS)
# ---------------------------------------------------------
from app.routers import auth, users, forgot_password, invite

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(forgot_password.router, prefix="/forgot", tags=["Forgot"])

# ⭐ Invite Feature
app.include_router(invite.router, prefix="/invite", tags=["Invite"])

# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# ---------------------------------------------------------
# CREATE DB TABLES
# ---------------------------------------------------------
from app.models.user import User
from app.models.otp import OtpModel
from app.models.invite import Invite

@app.get("/create-db")
def create_db():
    Base.metadata.create_all(bind=engine)
    return {"ok": True, "msg": "DB created"}

# ---------------------------------------------------------
# SEED ADMIN USER
# ---------------------------------------------------------
SEED_SECRET = "devseed123"

@app.get("/seed-admin")
def seed_admin(secret: str, db: Session = Depends(get_db)):
    if secret != SEED_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")

    from app.utils.auth import hash_password

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

    return {"ok": True, "msg": "Admin created"}
