from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    username: str
    role: str = "viewer"


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


class InitAdminRequest(BaseModel):
    username: str = "admin"
    password: str


# Community schemas
class CommunityBase(BaseModel):
    name: str
    district: Optional[str] = None
    address: Optional[str] = None
    property_fee: Optional[str] = None
    parking: Optional[str] = None
    build_year: Optional[int] = None
    metro: Optional[str] = None
    primary_school: Optional[str] = None
    middle_school: Optional[str] = None
    environment_score: Optional[int] = Field(None, ge=1, le=10)
    photos: Optional[str] = None
    videos: Optional[str] = None
    notes: Optional[str] = None


class CommunityCreate(CommunityBase):
    pass


class CommunityUpdate(CommunityBase):
    pass


class CommunityResponse(CommunityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Property schemas
class PropertyBase(BaseModel):
    community_id: int
    building: Optional[str] = None
    unit: Optional[str] = None
    room: Optional[str] = None
    area: Optional[float] = None
    layout: Optional[str] = None
    floor: Optional[str] = None
    orientation: Optional[str] = None
    decoration: Optional[str] = None
    price: Optional[float] = None
    rent: Optional[float] = None
    expected_price: Optional[float] = None
    visit_date: Optional[datetime] = None
    photos: Optional[str] = None
    videos: Optional[str] = None
    notes: Optional[str] = None


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(PropertyBase):
    pass


class PropertyResponse(PropertyBase):
    id: int
    price_per_sqm: Optional[float] = None
    rent_ratio: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    community: Optional[CommunityResponse] = None

    class Config:
        from_attributes = True


# Stats schemas
class StatsResponse(BaseModel):
    total_communities: int
    total_properties: int
    average_price: Optional[float]
    average_rent: Optional[float]
    average_rent_ratio: Optional[float]
    district_stats: List[dict]
