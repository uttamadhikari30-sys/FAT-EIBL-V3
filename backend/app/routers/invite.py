from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud.invite_crud import create_invite, accept_invite
from app.utils.invite_email import send_invite_email

router = APIRouter()

class SendInvite(BaseModel):
    email: EmailStr
    role: str = "user"

class AcceptInvite(BaseModel):
    email: EmailStr
    token: str
    password: str

@router.post("/send")
def send_invite_api(req: SendInvite, db: Session = Depends(get_db)):
    try:
        token = create_invite(db, req.email, req.role)
        link = f"https://fat-eibl-frontend-x1sp.onrender.com/invite/accept?email={req.email}&token={token}"
        send_invite_email(req.email, link)
        return {"message": "Invite sent"}
    except Exception as e:
        raise HTTPException(400, str(e))


@router.post("/accept")
def accept_invite_api(req: AcceptInvite, db: Session = Depends(get_db)):
    try:
        user = accept_invite(db, req.email, req.token, req.password)
        return {"message": "User created", "user_id": user.id}
    except Exception as e:
        raise HTTPException(400, str(e))
