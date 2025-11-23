from app.database import SessionLocal
from app.models.user import User
from app.utils.auth import hash_password

db = SessionLocal()

# Check if admin exists
existing = db.query(User).filter(User.email == "admin@edmeinsurance.com").first()

if existing:
    print("Admin already exists!")
else:
    admin = User(
        email="admin@edmeinsurance.com",
        hashed_password=hash_password("Edme@123"),
        role="admin",
        first_login=False
    )

    db.add(admin)
    db.commit()
    print("Admin created successfully!")

db.close()
