from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FAT-EIBL Backend API")

# ---------------------------------------------------------
# ✅ CORS — MUST BE BEFORE ROUTERS
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fat-eibl-frontend-x1sp.onrender.com",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# DATABASE
# ---------------------------------------------------------
from app.database import Base, engine, SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------------
# ✅ ROUTERS (FIXED IMPORTS)
# ---------------------------------------------------------
from app import auth, users, invite, forgot_password

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(invite.router, prefix="/invite", tags=["Invite"])
app.include_router(forgot_password.router, prefix="/forgot", tags=["Forgot"])

# ---------------------------------------------------------
# HEALTH
# ---------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# ---------------------------------------------------------
# CREATE DB
# ---------------------------------------------------------
from app.models.user import User
from app.models.otp import OtpModel
from app.models.invite import Invite

@app.get("/create-db")
def create_db():
    Base.metadata.create_all(bind=engine)
    return {"ok": True}

# ---------------------------------------------------------
# SEED ADMIN
# ---------------------------------------------------------
SEED_SECRET = "devseed123"

@app.get("/seed-admin")
def seed_admin(secret: str, db: Session = Depends(get_db)):
    if secret != SEED_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")

    from app.utils.security import get_password_hash

    email = "admin@edmeinsurance.com"

    user = db.query(User).filter(User.email == email).first()
    if user:
        return {"ok": True, "msg": "Admin already exists"}

    admin = User(
        email=email,
        password=get_password_hash("Edme@123"),
        role="admin",
        is_active=True
    )

    db.add(admin)
    db.commit()

    return {"ok": True, "msg": "Admin created"}
