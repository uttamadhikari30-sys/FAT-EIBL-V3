# app/models/user.py (SQLAlchemy)
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  # hashed
    department = Column(String(100))
    manager_email = Column(String(255))
    role = Column(String(50), default="auditee")

    # OTP + reset fields
    otp_code = Column(String(10), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    first_login = Column(Boolean, default=True)
