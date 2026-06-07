from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    department = Column(String, nullable=False)
    audit_area = Column(String, nullable=False)
    request_details = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="Pending Response")
    priority = Column(String, nullable=False, default="Medium")
    requested_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    auditee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    response_note = Column(Text, nullable=True)
    due_date = Column(String, nullable=False)
    evidence_name = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
