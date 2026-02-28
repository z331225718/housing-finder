# File upload router
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from fastapi.responses import FileResponse

from app.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/upload", tags=["upload"])

# Configure upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file extensions
ALLOWED_PHOTOS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_VIDEOS = {".mp4", ".webm", ".mov", ".avi"}
ALLOWED_ALL = ALLOWED_PHOTOS | ALLOWED_VIDEOS


def get_file_extension(filename: str) -> str:
    """Get file extension in lowercase."""
    return Path(filename).suffix.lower()


def validate_file(filename: str) -> str:
    """Validate file type."""
    ext = get_file_extension(filename)
    if ext not in ALLOWED_ALL:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed: {', '.join(ALLOWED_ALL)}"
        )
    return ext


def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename with timestamp."""
    ext = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())[:8]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{timestamp}_{unique_id}{ext}"


@router.post("/photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Upload a photo file."""
    validate_file(file.filename)

    filename = generate_unique_filename(file.filename)
    file_path = UPLOAD_DIR / filename

    content = await file.read()
    file_path.write_bytes(content)

    return {
        "filename": filename,
        "url": f"/api/upload/files/{filename}",
        "original_name": file.filename
    }


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Upload a video file."""
    ext = validate_file(file.filename)

    if ext not in ALLOWED_VIDEOS:
        raise HTTPException(
            status_code=400,
            detail=f"Video type not allowed. Allowed: {', '.join(ALLOWED_VIDEOS)}"
        )

    filename = generate_unique_filename(file.filename)
    file_path = UPLOAD_DIR / filename

    content = await file.read()
    file_path.write_bytes(content)

    return {
        "filename": filename,
        "url": f"/api/upload/files/{filename}",
        "original_name": file.filename
    }


@router.get("/files/{filename}")
async def get_file(filename: str):
    """Serve uploaded files."""
    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@router.delete("/files/{filename}")
async def delete_file(
    filename: str,
    current_user: User = Depends(get_current_user)
) -> dict:
    """Delete an uploaded file."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete files")

    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    file_path.unlink()

    return {"message": "File deleted successfully"}
