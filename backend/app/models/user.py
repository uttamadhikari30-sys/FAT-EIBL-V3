from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False, default="Finance")
    reporting_manager = Column(String, nullable=True)
    role = Column(String, nullable=False, default="Auditee")
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Legacy column kept for backward compatibility with older deployments
    password = Column(String, nullable=True)

    # First login flag
    first_login = Column(Boolean, default=True)

    # OTP login fields
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
