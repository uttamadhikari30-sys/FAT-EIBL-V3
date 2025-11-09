# ✅ Seed Admin User (One-Time Setup) – FIXED bcrypt byte issue
@router.post("/seed-admin")
def seed_admin(db: Session = Depends(get_db)):
    try:
        email = "admin@edmeinsurance.com"
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return {"ok": True, "note": "Admin already exists"}

        # --- Fix bcrypt 72-byte password limit ---
        raw_password = "Edme@123"
        encoded = raw_password.encode("utf-8")
        if len(encoded) > 72:
            encoded = encoded[:72]
        safe_password = encoded.decode("utf-8", "ignore")
        hashed_password = bcrypt.hash(safe_password)
        # ------------------------------------------

        admin = User(
            name="Admin",
            email=email,
            hashed_password=hashed_password,
            department="Finance",
            role="admin",
            manager_email=None,
        )
        db.add(admin)
        db.commit()
        return {"ok": True, "note": "Admin created successfully"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
