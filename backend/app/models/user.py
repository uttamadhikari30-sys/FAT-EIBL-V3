from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database import Base
from datetime import datetime, timedelta

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)

    # Required for login
    hashed_password = Column(String, nullable=True)

    # Roles
    role = Column(String, default="user")

    # First login flag
    first_login = Column(Boolean, default=True)

    # OTP login fields
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
