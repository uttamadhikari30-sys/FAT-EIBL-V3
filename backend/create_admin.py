from app.database import SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash

db = SessionLocal()

admin = User(
    email="admin@edmeinsurance.com",
    password=get_password_hash("Edme@123"),
    role="admin",
    is_active=True
)

db.add(admin)
db.commit()
db.close()

print("Admin user created successfully")
