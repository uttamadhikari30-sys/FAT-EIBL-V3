from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)

    # Main password
    hashed_password = Column(String(255), nullable=True)

    department = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="auditee")
    manager_email = Column(String(255), nullable=True)

    # Invite fields
    status = Column(String(50), nullable=False, default="invited")  # invited / active
    invite_token_hash = Column(String(255), nullable=True)
    invite_expires_at = Column(DateTime, nullable=True)

    # First login flag
    first_login = Column(Boolean, default=True)

    # Password reset fields
    reset_token_hash = Column(String(255), nullable=True)
    reset_expires_at = Column(DateTime, nullable=True)

    # OTP login fields
    otp_code = Column(String(20), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
