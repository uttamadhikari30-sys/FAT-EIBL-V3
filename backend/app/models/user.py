from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    department = Column(String(100))      # e.g., Accounts, Compliance, Ops
    role = Column(String(50))             # admin, auditor, auditee, manager
    manager_email = Column(String(255))   # reporting manager
    is_active = Column(Boolean, default=True)
