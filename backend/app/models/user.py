from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)

    # Password stored only after user sets it
    hashed_password = Column(String(255), nullable=True)

    department = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="auditee")
    manager_email = Column(String(255), nullable=True)

    # Invite flow fields
    status = Column(String(50), nullable=False, default="invited")  # invited / active
    invite_token_hash = Column(String(255), nullable=True)
    invite_expires_at = Column(DateTime, nullable=True)

    # REQUIRED FIELD
    first_login = Column(Boolean, default=True)
