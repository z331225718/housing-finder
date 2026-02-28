from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models, schemas


def calculate_rent_ratio(price: float, rent: float) -> Optional[float]:
    if price and rent and price > 0:
        return (rent * 12) / (price * 10000) * 100
    return None


def calculate_price_per_sqm(price: float, area: float) -> Optional[float]:
    if price and area and area > 0:
        return price * 10000 / area
    return None


# User operations
def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = schemas.get_password_hash(user.password) if hasattr(schemas, 'get_password_hash') else None
    if hashed_password is None:
        from app.auth import get_password_hash
        hashed_password = get_password_hash(user.password)

    db_user = models.User(
        username=user.username,
        password_hash=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Community operations
def get_communities(db: Session, district: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[models.Community]:
    query = db.query(models.Community)
    if district:
        query = query.filter(models.Community.district == district)
    return query.offset(skip).limit(limit).all()


def get_community(db: Session, community_id: int) -> Optional[models.Community]:
    return db.query(models.Community).filter(models.Community.id == community_id).first()


def create_community(db: Session, community: schemas.CommunityCreate) -> models.Community:
    db_community = models.Community(**community.model_dump())
    db.add(db_community)
    db.commit()
    db.refresh(db_community)
    return db_community


def update_community(db: Session, community_id: int, community: schemas.CommunityUpdate) -> Optional[models.Community]:
    db_community = get_community(db, community_id)
    if db_community:
        for key, value in community.model_dump(exclude_unset=True).items():
            setattr(db_community, key, value)
        db.commit()
        db.refresh(db_community)
    return db_community


def delete_community(db: Session, community_id: int) -> bool:
    db_community = get_community(db, community_id)
    if db_community:
        db.delete(db_community)
        db.commit()
        return True
    return False


# Property operations
def get_properties(
    db: Session,
    community_id: Optional[int] = None,
    district: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_area: Optional[float] = None,
    max_area: Optional[float] = None,
    min_rent_ratio: Optional[float] = None,
    max_rent_ratio: Optional[float] = None,
    skip: int = 0,
    limit: int = 100
) -> List[models.Property]:
    query = db.query(models.Property)

    if community_id:
        query = query.filter(models.Property.community_id == community_id)

    if district:
        query = query.join(models.Community).filter(models.Community.district == district)

    if min_price is not None:
        query = query.filter(models.Property.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Property.price <= max_price)

    if min_area is not None:
        query = query.filter(models.Property.area >= min_area)
    if max_area is not None:
        query = query.filter(models.Property.area <= max_area)

    if min_rent_ratio is not None:
        query = query.filter(models.Property.rent_ratio >= min_rent_ratio)
    if max_rent_ratio is not None:
        query = query.filter(models.Property.rent_ratio <= max_rent_ratio)

    return query.offset(skip).limit(limit).all()


def get_property(db: Session, property_id: int) -> Optional[models.Property]:
    return db.query(models.Property).filter(models.Property.id == property_id).first()


def create_property(db: Session, property: schemas.PropertyCreate) -> models.Property:
    data = property.model_dump()

    # Calculate rent_ratio and price_per_sqm
    price = data.get("price")
    rent = data.get("rent")
    area = data.get("area")

    data["rent_ratio"] = calculate_rent_ratio(price, rent)
    data["price_per_sqm"] = calculate_price_per_sqm(price, area)

    db_property = models.Property(**data)
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property


def update_property(db: Session, property_id: int, property: schemas.PropertyUpdate) -> Optional[models.Property]:
    db_property = get_property(db, property_id)
    if db_property:
        data = property.model_dump(exclude_unset=True)

        # Recalculate rent_ratio and price_per_sqm
        price = data.get("price", db_property.price)
        rent = data.get("rent", db_property.rent)
        area = data.get("area", db_property.area)

        data["rent_ratio"] = calculate_rent_ratio(price, rent)
        data["price_per_sqm"] = calculate_price_per_sqm(price, area)

        for key, value in data.items():
            setattr(db_property, key, value)
        db.commit()
        db.refresh(db_property)
    return db_property


def delete_property(db: Session, property_id: int) -> bool:
    db_property = get_property(db, property_id)
    if db_property:
        db.delete(db_property)
        db.commit()
        return True
    return False


# Stats operations
def get_stats(db: Session) -> dict:
    total_communities = db.query(func.count(models.Community.id)).scalar() or 0
    total_properties = db.query(func.count(models.Property.id)).scalar() or 0

    avg_price = db.query(func.avg(models.Property.price)).scalar()
    avg_rent = db.query(func.avg(models.Property.rent)).scalar()
    avg_rent_ratio = db.query(func.avg(models.Property.rent_ratio)).scalar()

    # District stats
    district_stats = db.query(
        models.Community.district,
        func.count(models.Community.id).label("community_count"),
        func.count(models.Property.id).label("property_count"),
        func.avg(models.Property.price).label("avg_price")
    ).join(
        models.Property, models.Community.id == models.Property.community_id, isouter=True
    ).group_by(
        models.Community.district
    ).all()

    return {
        "total_communities": total_communities,
        "total_properties": total_properties,
        "average_price": avg_price,
        "average_rent": avg_rent,
        "average_rent_ratio": avg_rent_ratio,
        "district_stats": [
            {
                "district": stat[0] or "未知",
                "community_count": stat[1],
                "property_count": stat[2],
                "average_price": stat[3]
            }
            for stat in district_stats
        ]
    }
