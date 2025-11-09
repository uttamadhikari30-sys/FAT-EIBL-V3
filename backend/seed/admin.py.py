# ✅ Seed Admin User (One-Time Setup)
@router.post("/seed-admin")
def seed_admin(db: Session = Depends(get_db)):
    try:
        email = "admin@edmeinsurance.com"
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return {"ok": True, "note": "Admin already exists"}

        # Fix bcrypt 72-byte password limit safely
        raw_password = "Edme@123"
        encoded = raw_password.encode("utf-8")
        if len(encoded) > 72:
            encoded = encoded[:72]
        safe_password = encoded.decode("utf-8", "ignore")

        admin = User(
            name="Admin",
            email=email,
            hashed_password=bcrypt.hash(safe_password),
            department="Finance",
            role="admin",
            manager_email=None,
        )
        db.add(admin)
        db.commit()
        return {"ok": True, "note": "Admin created successfully"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
