import os
os.environ.setdefault("DATABASE_URL", "sqlite:///./app.db")

from app.main import SessionLocal  # uses the same engine/session
from app.models.user import User
from passlib.hash import bcrypt

db = SessionLocal()

# delete old admin if exists
old = db.query(User).filter(User.email == "admin@edmeinsurance.com").first()
if old:
    db.delete(old)
    db.commit()

admin = User(
    name="Admin",
    email="admin@edmeinsurance.com",
    hashed_password=bcrypt.hash("Edme@123"),
    department="Finance",
    role="admin",
    manager_email=None
)
db.add(admin)
db.commit()
db.close()
print("✅ Admin created: admin@edmeinsurance.com / Edme@123")
