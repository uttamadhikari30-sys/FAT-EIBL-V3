from pydantic import BaseModel, EmailStr


# -----------------------------
# LOGIN (Email + Password)
# -----------------------------
class LoginSchema(BaseModel):
    email: EmailStr
    password: str


# -----------------------------
# OTP LOGIN (Optional – future)
# -----------------------------
class OtpLoginSchema(BaseModel):
    email: EmailStr | None = None
    mobile: str | None = None
    otp: str


# -----------------------------
# SEND OTP
# -----------------------------
class SendOtpSchema(BaseModel):
    email: EmailStr | None = None
    mobile: str | None = None
