from fastapi import APIRouter, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

# ✅ Generate random 6-digit OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# ✅ Send email via company mail (SMTP)
def send_otp_email(recipient_email: str, otp: str):
    sender_email = os.getenv("SMTP_SENDER_EMAIL", "support@edmeinsurance.com")
    sender_password = os.getenv("SMTP_PASSWORD", "your-app-password")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.office365.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))

    subject = "FAT-EIBL Password Reset OTP"
    body = f"""
    <html>
        <body>
            <p>Dear User,</p>
            <p>Your OTP for password reset is: <b>{otp}</b></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>Regards,<br>Finance Audit Tracker - Edme Insurance Brokers Ltd</p>
        </body>
    </html>
    """

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(f"✅ OTP sent to {recipient_email}")
    except Exception as e:
        print(f"❌ Error sending OTP: {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP email")

# ✅ Store OTP temporarily (in memory)
otp_storage = {}

@router.post("/forgot-password")
def forgot_password(email: str = Form(...), db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    # Generate OTP
    otp = generate_otp()

    # Save OTP temporarily (could use Redis or DB for production)
    otp_storage[email] = otp

    # Send email
    send_otp_email(email, otp)

    return {"ok": True, "message": f"OTP sent to {email}. Please check your inbox."}
