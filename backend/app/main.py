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
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{path:path}")
def options_handler(path: str):
    return {}

# ===================== DATABASE =====================
from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash

# ===================== STARTUP =====================
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        admin_email = "admin@edmeinsurance.com"

        admin = db.query(User).filter(User.email == admin_email).first()

        if not admin:
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash("Edme@123"),
                role="admin",
                is_active=True,
                first_login=False,
            )
            db.add(admin)
            db.commit()
            print("✅ Admin user created at startup")
        else:
            print("ℹ️ Admin already exists")

    except Exception as e:
        db.rollback()
        print("❌ Startup error:", e)

    finally:
        db.close()

# ===================== ROUTERS =====================
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.invite import router as invite_router
from app.routers.forgot_password import router as forgot_router

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(invite_router, prefix="/invite", tags=["Invite"])
app.include_router(forgot_router, prefix="/forgot", tags=["Forgot"])

@app.get("/health")
def health():
    return {"status": "ok"}
