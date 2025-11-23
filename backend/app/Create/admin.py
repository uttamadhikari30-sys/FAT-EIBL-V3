from app.database import SessionLocal
from app.models.user import User
from app.utils.auth import hash_password

def create_admin():
    db = SessionLocal()
    admin = db.query(User).filter(User.email == "admin@edmeinsurance.com").first()
    if admin:
        print("Admin already exists")
        return

    admin = User(
        email="admin@edmeinsurance.com",
        hashed_password=hash_password("Edme@123"),
        role="admin",
        first_login=False
    )

    db.add(admin)
    db.commit()
    db.close()
    print("Admin created successfully")

if __name__ == "__main__":
    create_admin()
