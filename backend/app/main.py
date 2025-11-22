from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.orm import Session
from datetime import date
import os
import shutil
from dotenv import load_dotenv

load_dotenv()

from app.database import Base, engine, SessionLocal

# -----------------------------------------------------
# FASTAPI APP
# -----------------------------------------------------
app = FastAPI(title="FAT-EIBL (Edme) – API")

# -----------------------------------------------------
# FIXED CORS (WORKING ON RENDER)
# -----------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fat-eibl-frontend-x1sp.onrender.com",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
