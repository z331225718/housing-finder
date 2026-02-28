from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas
from app.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=schemas.StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_stats(db)
