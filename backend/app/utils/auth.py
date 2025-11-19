import smtplib
from email.message import EmailMessage
import os
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def send_invite_email(to_email: str, invite_link: str):
    """
    Sends invitation email to user using SMTP.
    Env vars required:
    SMTP_HOST
    SMTP_PORT
    SMTP_USER
    SMTP_PASS
    EMAIL_FROM
    """

    msg = EmailMessage()
    msg["Subject"] = "Your FAT-EIBL Account Invitation"
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
EIBL Audit Team
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
