from collections import defaultdict
from datetime import datetime
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine, get_db
from app.models.prepaid import PrepaidItem
from app.models.requirement import Requirement
from app.models.task import Task
from app.models.user import User
from app.utils.security import get_password_hash, verify_password


app = FastAPI(title="FAT-EIBL Audit Workspace")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    department: str
    reporting_manager: Optional[str] = None
    role: str
    password: str


class TaskCreate(BaseModel):
    title: str
    description: str
    status: str
    priority: str
    due_date: str
    owner_id: Optional[int] = None


class TaskUpdate(BaseModel):
    status: str


class RequirementCreate(BaseModel):
    title: str
    department: str
    audit_area: str
    request_details: str
    priority: str
    requested_by_id: int
    auditee_id: int
    due_date: str
    evidence_name: Optional[str] = None


class RequirementUpdate(BaseModel):
    status: str
    response_note: Optional[str] = None
    evidence_name: Optional[str] = None


class PrepaidCreate(BaseModel):
    voucher_no: str
    addition_date: str
    party_code: str
    party_name: str
    prepaid_ledger_code: str
    prepaid_ledger_name: str
    expense_code: str
    expense_head: str
    amount_paid: float
    period_from: str
    period_to: str
    prepaid_opening: float = 0.0
    apr_25: float = 0.0
    may_25: float = 0.0
    jun_25: float = 0.0


def serialize_user(user: User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "department": user.department,
        "reporting_manager": user.reporting_manager,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat(),
    }


def serialize_task(task: Task, owner: Optional[User]):
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "due_date": task.due_date,
        "owner_id": task.owner_id,
        "owner_name": owner.name if owner else "Unassigned",
        "created_at": task.created_at.isoformat(),
    }


def serialize_requirement(requirement: Requirement, users_by_id: dict[int, User]):
    requester = users_by_id.get(requirement.requested_by_id)
    auditee = users_by_id.get(requirement.auditee_id)
    return {
        "id": requirement.id,
        "title": requirement.title,
        "department": requirement.department,
        "audit_area": requirement.audit_area,
        "request_details": requirement.request_details,
        "status": requirement.status,
        "priority": requirement.priority,
        "requested_by_id": requirement.requested_by_id,
        "requested_by_name": requester.name if requester else "Unknown",
        "auditee_id": requirement.auditee_id,
        "auditee_name": auditee.name if auditee else "Unknown",
        "response_note": requirement.response_note or "",
        "due_date": requirement.due_date,
        "evidence_name": requirement.evidence_name or "",
        "created_at": requirement.created_at.isoformat(),
    }


def serialize_prepaid(item: PrepaidItem):
    months = [item.apr_25, item.may_25, item.jun_25]
    prepaid_balance = item.amount_paid - sum(months)
    return {
        "id": item.id,
        "voucher_no": item.voucher_no,
        "addition_date": item.addition_date,
        "party_code": item.party_code,
        "party_name": item.party_name,
        "prepaid_ledger_code": item.prepaid_ledger_code,
        "prepaid_ledger_name": item.prepaid_ledger_name,
        "expense_code": item.expense_code,
        "expense_head": item.expense_head,
        "amount_paid": item.amount_paid,
        "period_from": item.period_from,
        "period_to": item.period_to,
        "prepaid_opening": item.prepaid_opening,
        "apr_25": item.apr_25,
        "may_25": item.may_25,
        "jun_25": item.jun_25,
        "prepaid_balance": prepaid_balance,
        "created_at": item.created_at.isoformat(),
    }


def ensure_seed_data():
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            admin = User(
                name="Audit Administrator",
                email="admin@edmeinsurance.com",
                department="Internal Audit",
                reporting_manager="CFO Office",
                role="Admin",
                hashed_password=get_password_hash("Admin@123"),
                is_active=True,
            )
            finance = User(
                name="Priya Sharma",
                email="priya.sharma@edmeinsurance.com",
                department="Finance",
                reporting_manager="Rakesh Nair",
                role="Auditee",
                hashed_password=get_password_hash("Welcome@123"),
                is_active=True,
            )
            ops = User(
                name="Rahul Menon",
                email="rahul.menon@edmeinsurance.com",
                department="Operations",
                reporting_manager="Sonal Deshpande",
                role="Auditor",
                hashed_password=get_password_hash("Welcome@123"),
                is_active=True,
            )
            it_user = User(
                name="Neha Kulkarni",
                email="neha.kulkarni@edmeinsurance.com",
                department="IT",
                reporting_manager="Sonal Deshpande",
                role="Auditee",
                hashed_password=get_password_hash("Welcome@123"),
                is_active=True,
            )
            db.add_all([admin, finance, ops, it_user])
            db.commit()

        if db.query(Task).count() == 0:
            users = db.query(User).all()
            user_by_email = {user.email: user for user in users}
            db.add_all(
                [
                    Task(
                        title="Validate premium reconciliation",
                        description="Review February premium statements against the ledger and flag variances above 2%.",
                        status="In Progress",
                        priority="High",
                        due_date="2026-04-30",
                        owner_id=user_by_email.get("priya.sharma@edmeinsurance.com").id,
                    ),
                    Task(
                        title="Refresh control testing plan",
                        description="Update control owners, evidence frequency, and escalation notes for Q2 walkthroughs.",
                        status="Open",
                        priority="Medium",
                        due_date="2026-05-04",
                        owner_id=user_by_email.get("rahul.menon@edmeinsurance.com").id,
                    ),
                    Task(
                        title="Close prior year findings",
                        description="Collect remediation evidence for all open findings from the 2025 finance audit.",
                        status="Completed",
                        priority="High",
                        due_date="2026-04-18",
                        owner_id=user_by_email.get("admin@edmeinsurance.com").id,
                    ),
                ]
            )
            db.commit()

        if db.query(Requirement).count() == 0:
            users = db.query(User).all()
            user_by_email = {user.email: user for user in users}
            db.add_all(
                [
                    Requirement(
                        title="Upload premium reconciliation workbook",
                        department="Finance",
                        audit_area="Revenue Assurance",
                        request_details="Share ledger-to-banker reconciliation with commentary for all unexplained differences above INR 50,000.",
                        status="Pending Response",
                        priority="High",
                        requested_by_id=user_by_email["rahul.menon@edmeinsurance.com"].id,
                        auditee_id=user_by_email["priya.sharma@edmeinsurance.com"].id,
                        due_date="2026-05-03",
                        evidence_name="Pending",
                    ),
                    Requirement(
                        title="Submit user access review evidence",
                        department="IT",
                        audit_area="IT General Controls",
                        request_details="Provide latest privileged access review sign-off, deprovisioning tracker, and open exceptions list.",
                        status="Submitted",
                        priority="Medium",
                        requested_by_id=user_by_email["rahul.menon@edmeinsurance.com"].id,
                        auditee_id=user_by_email["neha.kulkarni@edmeinsurance.com"].id,
                        due_date="2026-04-29",
                        response_note="Attached April access matrix and approval mail trail.",
                        evidence_name="IT_Access_Review_April.xlsx",
                    ),
                    Requirement(
                        title="Clarify prepaid insurance schedule variance",
                        department="Finance",
                        audit_area="Prepaids",
                        request_details="Explain mismatch between prepaid register and monthly expense release for fleet insurance.",
                        status="Query Raised",
                        priority="High",
                        requested_by_id=user_by_email["rahul.menon@edmeinsurance.com"].id,
                        auditee_id=user_by_email["priya.sharma@edmeinsurance.com"].id,
                        due_date="2026-05-01",
                        response_note="Need one more supporting journal and policy copy.",
                        evidence_name="Fleet_Insurance_Schedule.pdf",
                    ),
                ]
            )
            db.commit()

        if db.query(PrepaidItem).count() == 0:
            db.add_all(
                [
                    PrepaidItem(
                        voucher_no="JV24001",
                        addition_date="2026-04-01",
                        party_code="VEND-102",
                        party_name="Secure Brokers Services",
                        prepaid_ledger_code="PL-004",
                        prepaid_ledger_name="Prepaid Insurance",
                        expense_code="EX-219",
                        expense_head="Insurance",
                        amount_paid=360000,
                        period_from="2026-04-01",
                        period_to="2027-03-31",
                        prepaid_opening=360000,
                        apr_25=30000,
                        may_25=30000,
                        jun_25=30000,
                    ),
                    PrepaidItem(
                        voucher_no="JV24008",
                        addition_date="2026-04-12",
                        party_code="VEND-334",
                        party_name="Orbit Technologies",
                        prepaid_ledger_code="PL-011",
                        prepaid_ledger_name="Annual Software AMC",
                        expense_code="EX-414",
                        expense_head="Software Maintenance",
                        amount_paid=120000,
                        period_from="2026-04-01",
                        period_to="2027-03-31",
                        prepaid_opening=120000,
                        apr_25=10000,
                        may_25=10000,
                        jun_25=10000,
                    ),
                ]
            )
            db.commit()
    finally:
        db.close()


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    ensure_seed_data()


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.get("/seed")
def reseed():
    ensure_seed_data()
    return {"ok": True}


@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return {
        "access_token": f"demo-token-{user.id}",
        "user": serialize_user(user),
    }


@app.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    requirements = db.query(Requirement).all()
    prepaid_items = db.query(PrepaidItem).all()
    users = db.query(User).all()

    status_counts = {"Open": 0, "In Progress": 0, "Completed": 0}
    for task in tasks:
        status_counts[task.status] = status_counts.get(task.status, 0) + 1

    requirement_counts = defaultdict(int)
    department_counts = defaultdict(lambda: {"pending": 0, "completed": 0, "total": 0})
    for requirement in requirements:
        requirement_counts[requirement.status] += 1
        department_counts[requirement.department]["total"] += 1
        if requirement.status in {"Closed", "Submitted"}:
            department_counts[requirement.department]["completed"] += 1
        else:
            department_counts[requirement.department]["pending"] += 1

    return {
        "total_tasks": len(tasks),
        "open_tasks": status_counts.get("Open", 0),
        "in_progress_tasks": status_counts.get("In Progress", 0),
        "completed_tasks": status_counts.get("Completed", 0),
        "team_members": len(users),
        "requirements_total": len(requirements),
        "requirements_pending": requirement_counts.get("Pending Response", 0)
        + requirement_counts.get("Query Raised", 0),
        "requirements_closed": requirement_counts.get("Closed", 0),
        "requirements_submitted": requirement_counts.get("Submitted", 0),
        "prepaid_entries": len(prepaid_items),
        "departments": department_counts,
    }


@app.get("/dashboard/departments")
def dashboard_departments(db: Session = Depends(get_db)):
    requirements = db.query(Requirement).all()
    grouped = defaultdict(lambda: {"pending": 0, "completed": 0, "high_priority": 0})
    for item in requirements:
        if item.status in {"Closed", "Submitted"}:
            grouped[item.department]["completed"] += 1
        else:
            grouped[item.department]["pending"] += 1
        if item.priority == "High":
            grouped[item.department]["high_priority"] += 1
    return [
        {"department": department, **values}
        for department, values in sorted(grouped.items(), key=lambda value: value[0])
    ]


@app.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.name.asc()).all()
    return [serialize_user(user) for user in users]


@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        name=payload.name,
        email=payload.email,
        department=payload.department,
        reporting_manager=payload.reporting_manager,
        role=payload.role,
        hashed_password=get_password_hash(payload.password),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return serialize_user(user)


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"ok": True}


@app.get("/tasks")
def list_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).order_by(Task.created_at.desc()).all()
    users = {user.id: user for user in db.query(User).all()}
    return [serialize_task(task, users.get(task.owner_id)) for task in tasks]


@app.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    if payload.owner_id:
        owner = db.query(User).filter(User.id == payload.owner_id).first()
        if not owner:
            raise HTTPException(status_code=404, detail="Task owner not found")

    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    owner = db.query(User).filter(User.id == task.owner_id).first() if task.owner_id else None
    return serialize_task(task, owner)


@app.patch("/tasks/{task_id}")
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = payload.status
    db.commit()
    db.refresh(task)
    owner = db.query(User).filter(User.id == task.owner_id).first() if task.owner_id else None
    return serialize_task(task, owner)


@app.get("/requirements")
def list_requirements(db: Session = Depends(get_db)):
    requirements = db.query(Requirement).order_by(Requirement.created_at.desc()).all()
    users_by_id = {user.id: user for user in db.query(User).all()}
    return [serialize_requirement(item, users_by_id) for item in requirements]


@app.post("/requirements", status_code=status.HTTP_201_CREATED)
def create_requirement(payload: RequirementCreate, db: Session = Depends(get_db)):
    requester = db.query(User).filter(User.id == payload.requested_by_id).first()
    auditee = db.query(User).filter(User.id == payload.auditee_id).first()
    if not requester or not auditee:
        raise HTTPException(status_code=404, detail="Requester or auditee not found")

    item = Requirement(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    users_by_id = {user.id: user for user in db.query(User).all()}
    return serialize_requirement(item, users_by_id)


@app.patch("/requirements/{requirement_id}")
def update_requirement(requirement_id: int, payload: RequirementUpdate, db: Session = Depends(get_db)):
    item = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Requirement not found")

    item.status = payload.status
    if payload.response_note is not None:
        item.response_note = payload.response_note
    if payload.evidence_name is not None:
        item.evidence_name = payload.evidence_name

    db.commit()
    db.refresh(item)
    users_by_id = {user.id: user for user in db.query(User).all()}
    return serialize_requirement(item, users_by_id)


@app.get("/prepaids")
def list_prepaids(db: Session = Depends(get_db)):
    items = db.query(PrepaidItem).order_by(PrepaidItem.created_at.desc()).all()
    return [serialize_prepaid(item) for item in items]


@app.post("/prepaids", status_code=status.HTTP_201_CREATED)
def create_prepaid(payload: PrepaidCreate, db: Session = Depends(get_db)):
    item = PrepaidItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return serialize_prepaid(item)
