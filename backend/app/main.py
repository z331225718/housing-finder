# FastAPI main application
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import init_db
from app.routers import auth, communities, properties, stats, upload, import_export

app = FastAPI(
    title="Housing Finder API",
    description="上海房源管理系统 API",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "housing-finder-api"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Housing Finder API",
        "docs": "/docs",
        "health": "/health"
    }


# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(communities.router, prefix="/api")
app.include_router(properties.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(import_export.router, prefix="/api")

# Serve uploaded files
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
app.mount("/api/upload/files", StaticFiles(directory="uploads"), name="uploads")
