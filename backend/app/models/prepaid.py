from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.database import Base


class PrepaidItem(Base):
    __tablename__ = "prepaid_items"

    id = Column(Integer, primary_key=True, index=True)
    voucher_no = Column(String, nullable=False)
    addition_date = Column(String, nullable=False)
    party_code = Column(String, nullable=False)
    party_name = Column(String, nullable=False)
    prepaid_ledger_code = Column(String, nullable=False)
    prepaid_ledger_name = Column(String, nullable=False)
    expense_code = Column(String, nullable=False)
    expense_head = Column(String, nullable=False)
    amount_paid = Column(Float, nullable=False)
    period_from = Column(String, nullable=False)
    period_to = Column(String, nullable=False)
    prepaid_opening = Column(Float, nullable=False, default=0.0)
    apr_25 = Column(Float, nullable=False, default=0.0)
    may_25 = Column(Float, nullable=False, default=0.0)
    jun_25 = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
