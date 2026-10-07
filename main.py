import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.benchmark import router as benchmark_router
from database.db import init_db

app = FastAPI(
    title="Q-Bench API",
    description="Quantum vs Classical Machine Learning Fair Benchmarking Platform Backend",
    version="1.0.0"
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(benchmark_router)

@app.on_event("startup")
def startup_event():
    init_db()
    print("[Q-Bench] SQLite Database initialized.")

@app.get("/")
def root():
    return {
        "message": "Welcome to Q-Bench API - Quantum vs Classical ML Benchmarking Engine",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
