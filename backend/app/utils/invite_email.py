import smtplib
from email.message import EmailMessage

FROM_EMAIL = "audit@edmeinsurance.com"
SMTP_HOST = "smtp.sendgrid.net"
SMTP_PORT = 587
SMTP_USER = "apikey"
SMTP_PASS = "SENDGRID_API_KEY"

def send_invite_email(to_email, link):
    msg = EmailMessage()
    msg["Subject"] = "EDME Invite"
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email
    msg.set_content(f"Click to create your account:\n\n{link}")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)
