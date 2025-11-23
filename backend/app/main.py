from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import shutil

# Load env
load_dotenv()

from app.database import Base, engine, SessionLocal

# ---------------------------------------------------------
# INIT APP
# ---------------------------------------------------------
app = FastAPI(title="FAT-EIBL Backend API")

# ---------------------------------------------------------
# CORS — FULL OPEN (fix Render CORS issue)
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # FIX CORS 100%
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
# IMPORT ROUTERS
# ---------------------------------------------------------
from app.routers import auth, users, forgot_password

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(forgot_password.router, prefix="/forgot", tags=["Forgot"])

# ---------------------------------------------------------
# HEALTH
# ---------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# ---------------------------------------------------------
# CREATE ALL TABLES
# ---------------------------------------------------------
from app.models.user import User
from app.models.otp import OtpModel

@app.get("/create-db")
def create_db():
    Base.metadata.create_all(bind=engine)
    return {"ok": True, "msg": "DB created"}

# ---------------------------------------------------------
# SEED ADMIN USER (one-time)
# ---------------------------------------------------------
SEED_SECRET = "devseed123"

@app.get("/seed-admin")
def seed_admin(secret: str, db: Session = Depends(get_db)):
    if secret != SEED_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")

    from app.utils.auth import hash_password

    # check if exists
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
