from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.base import router as base_router
import os
from dotenv import load_dotenv
from .models import Counter
from .db import Base, engine, SessionLocal

load_dotenv()

app = FastAPI(title="FastAPI + React App")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Include routers
app.include_router(base_router, prefix="/api")

counter = {"value": 0}


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "FastAPI is running!"}

@app.post("/api/counter/increment")
def increment_counter(db: Session = Depends(get_db)):
    counter = db.query(Counter).first()
    counter.value += 1
    db.commit()
    db.refresh(counter)
    return {"count": counter.value}

@app.get("/api/counter")
def get_counter(db: Session = Depends(get_db)):
    counter = db.query(Counter).first()
    return {"count": counter.value}