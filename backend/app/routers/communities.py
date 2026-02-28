from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas
from app.auth import get_current_user, require_admin
from app.models import User

router = APIRouter(prefix="/communities", tags=["communities"])


@router.get("", response_model=List[schemas.CommunityResponse])
def get_communities(
    district: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_communities(db, district=district, skip=skip, limit=limit)


@router.get("/{community_id}", response_model=schemas.CommunityResponse)
def get_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    community = crud.get_community(db, community_id)
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )
    return community


@router.post("", response_model=schemas.CommunityResponse)
def create_community(
    community: schemas.CommunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return crud.create_community(db, community)


@router.put("/{community_id}", response_model=schemas.CommunityResponse)
def update_community(
    community_id: int,
    community: schemas.CommunityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    updated = crud.update_community(db, community_id, community)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )
    return updated


@router.delete("/{community_id}")
def delete_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    if not crud.delete_community(db, community_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )
    return {"message": "Community deleted successfully"}
