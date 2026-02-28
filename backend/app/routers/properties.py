from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas
from app.auth import get_current_user, require_admin
from app.models import User

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("", response_model=List[schemas.PropertyResponse])
def get_properties(
    community_id: Optional[int] = Query(None),
    district: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    min_area: Optional[float] = Query(None, ge=0),
    max_area: Optional[float] = Query(None, ge=0),
    min_rent_ratio: Optional[float] = Query(None, ge=0),
    max_rent_ratio: Optional[float] = Query(None, ge=0),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_properties(
        db,
        community_id=community_id,
        district=district,
        min_price=min_price,
        max_price=max_price,
        min_area=min_area,
        max_area=max_area,
        min_rent_ratio=min_rent_ratio,
        max_rent_ratio=max_rent_ratio,
        skip=skip,
        limit=limit
    )


@router.get("/{property_id}", response_model=schemas.PropertyResponse)
def get_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = crud.get_property(db, property_id)
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return property


@router.post("", response_model=schemas.PropertyResponse)
def create_property(
    property: schemas.PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Verify community exists
    community = crud.get_community(db, property.community_id)
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )
    return crud.create_property(db, property)


@router.put("/{property_id}", response_model=schemas.PropertyResponse)
def update_property(
    property_id: int,
    property: schemas.PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    updated = crud.update_property(db, property_id, property)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return updated


@router.delete("/{property_id}")
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    if not crud.delete_property(db, property_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return {"message": "Property deleted successfully"}
