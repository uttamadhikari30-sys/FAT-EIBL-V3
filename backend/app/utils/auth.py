import smtplib
from email.message import EmailMessage
import os
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------------------------------------
# HASH PASSWORD
# ---------------------------------------------
def hash_password(password: str):
    return pwd_context.hash(password)


# ---------------------------------------------
# VERIFY PASSWORD (Required for /auth/login)
# ---------------------------------------------
def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)


# ---------------------------------------------
# SEND INVITATION EMAIL
# ---------------------------------------------
def send_invite_email(to_email: str, invite_link: str):
    """
    Sends invitation email using SMTP.
    Required ENV:
    SMTP_HOST
    SMTP_PORT
    SMTP_USER
    SMTP_PASS
    EMAIL_FROM
    """

    msg = EmailMessage()
    msg["Subject"] = "FAT-EIBL Account Invitation"
    msg["From"] = os.getenv("EMAIL_FROM")
    msg["To"] = to_email

    msg.set_content(
        f"""
Hello,

You have been invited to FAT-EIBL.

Please set your password using the link below:

{invite_link}

This link expires in 24 hours.

Regards,
FAT-EIBL Audit Team
"""
    )

    try:
        with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as smtp:
            smtp.starttls()
            smtp.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASS"))
            smtp.send_message(msg)
    except Exception as e:
        print("Email sending failed:", e)
        raise e
