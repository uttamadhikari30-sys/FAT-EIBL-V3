# app/utils/auth.py
import random
from datetime import datetime, timedelta
from passlib.context import CryptContext
import os, smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain):
    return pwd_ctx.hash(plain)

def verify_password(plain, hashed):
    return pwd_ctx.verify(plain, hashed)

def generate_otp():
    return f"{random.randint(100000, 999999)}"  # 6-digit string

def otp_expiry(minutes=10):
    return datetime.utcnow() + timedelta(minutes=minutes)

def send_otp_email(recipient_email: str, otp: str):
    # Configure via env vars
    sender_email = os.getenv("SMTP_SENDER_EMAIL")
    sender_password = os.getenv("SMTP_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.office365.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))

    subject = "Your FAT-EIBL one-time password (OTP)"
    body = f"""
    Hello,

    Use this one-time password (OTP) to sign in to FAT-EIBL: {otp}

    This OTP will expire in 10 minutes.

    If you didn't request this, contact your admin.

    Regards,
    FAT-EIBL
    """

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
