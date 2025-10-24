from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.base import router as base_router
import os
from dotenv import load_dotenv

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

# Include routers
app.include_router(base_router, prefix="/api")

counter = {"value": 0}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "FastAPI is running!"}

@app.post("/api/counter/increment")
def increment_counter():
    print("Incrementing...")
    counter["value"] += 1
    return {"count": counter["value"]}

@app.get("/api/counter")
async def get_counter():
    return {"count": counter["value"]}