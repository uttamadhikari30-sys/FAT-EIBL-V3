# ✅ Seed Admin User (One-Time Setup)
@router.post("/seed-admin")
def seed_admin(db: Session = Depends(get_db)):
    try:
        email = "admin@edmeinsurance.com"
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return {"ok": True, "note": "Admin already exists"}

        raw_password = "Edme@123"
        if len(raw_password.encode("utf-8")) > 72:
            raw_password = raw_password[:72]

        admin = User(
            name="Admin",
            email=email,
            hashed_password=bcrypt.hash(raw_password),
            department="Finance",
            role="admin",
            manager_email=None,
        )
        db.add(admin)
        db.commit()
        return {"ok": True, "note": "Admin created"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
