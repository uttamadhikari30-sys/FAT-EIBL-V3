from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FAT-EIBL Backend API")

# ===================== CORS =====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fat-eibl-frontend-x1sp.onrender.com",
        "https://fat-eibl-v3.vercel.app",
        "http://localhost:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== DATABASE =====================
from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash
import os

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    # Ensure a default admin exists for first-time login in fresh deployments
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@edmeinsurance.com").strip().lower()
        admin_password = os.getenv("ADMIN_PASSWORD", "Edme@123")

        from sqlalchemy import func
        admin = db.query(User).filter(func.lower(User.email) == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                role="admin",
                first_login=False,
            )
            db.add(admin)

        # Keep admin credentials deterministic across environments
        admin.hashed_password = get_password_hash(admin_password)
        admin.first_login = False
        db.commit()
        print(f"✅ Default admin ensured: {admin_email}")
    finally:
        db.close()

    print("✅ Database ready")

# ===================== ROUTERS =====================
from app.routers.auth import router as auth_router

app.include_router(auth_router, prefix="/auth", tags=["Auth"])

@app.get("/health")
def health():
    return {"status": "ok"}
