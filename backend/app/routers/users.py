from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.main import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def list_users(db: Session = Depends(get_db)):
    # For now, just a placeholder
    return {"message": "User list (placeholder)"}

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    # Simple fake login logic (replace later)
    if username == "admin" and password == "admin123":
        return {"message": "Login successful", "role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
