from app.database import SessionLocal
from app.models.user import User
from app.utils.auth import hash_password

db = SessionLocal()

admin = User(
    email="admin@edmeinsurance.com",
    hashed_password=hash_password("Edme@123"),
    role="admin",
    first_login=False
)

db.add(admin)
db.commit()
db.close()

print("Admin user created successfully!")
