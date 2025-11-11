from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timedelta
from app.database import Base

class OtpModel(Base):
    __tablename__ = "otp_records"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    otp = Column(String, nullable=False)
    expires_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(minutes=10))
