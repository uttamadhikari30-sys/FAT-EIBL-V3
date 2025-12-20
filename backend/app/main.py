from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FAT-EIBL Backend API")

# ---------------- CORS ----------------
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

# ---------------- DATABASE ----------------
from app.database import Base, engine, SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- ROUTERS ----------------
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.invite import router as invite_router
from app.routers.forgot_password import router as forgot_router

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(invite_router, prefix="/invite", tags=["Invite"])
app.include_router(forgot_router, prefix="/forgot", tags=["Forgot"])

# ---------------- HEALTH ----------------
@app.get("/health")
def health():
    return {"status": "ok"}

# ---------------- DB CREATE ----------------
from app.models.user import User

@app.get("/create-db")
def create_db():
    Base.metadata.create_all(bind=engine)
    return {"ok": True}

# ---------------- SEED ADMIN ----------------
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
        hashed_password=get_password_hash("Edme@123"),
        role="admin",
        first_login=False
    )

    db.add(admin)
    db.commit()
    return {"ok": True, "msg": "Admin created"}
