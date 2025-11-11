from passlib.hash import bcrypt
from datetime import datetime
from app.models.otp import OtpModel

@router.post("/reset-password")
def reset_password(
    email: str = Form(...),
    otp: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db),
):
    # Check user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    # Verify OTP
    otp_entry = db.query(OtpModel).filter(OtpModel.email == email, OtpModel.otp == otp).first()
    if not otp_entry:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > otp_entry.expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")

    # Update password
    user.hashed_password = bcrypt.hash(new_password)
    db.delete(otp_entry)  # Remove OTP after successful use
    db.commit()

    return {"ok": True, "message": "Password reset successfully"}
