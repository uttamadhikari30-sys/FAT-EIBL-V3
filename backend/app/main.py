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
from app.database import Base, engine

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    print("✅ Database ready")

# ===================== ROUTERS =====================
from app.routers.auth import router as auth_router

app.include_router(auth_router, prefix="/auth", tags=["Auth"])

@app.get("/health")
def health():
    return {"status": "ok"}
