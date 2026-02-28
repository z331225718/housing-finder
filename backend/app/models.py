from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="viewer")
    created_at = Column(DateTime, default=datetime.utcnow)


class Community(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    district = Column(Text)
    address = Column(Text)
    property_fee = Column(Text)
    parking = Column(Text)
    build_year = Column(Integer)
    metro = Column(Text)
    primary_school = Column(Text)
    middle_school = Column(Text)
    environment_score = Column(Integer)
    photos = Column(Text)
    videos = Column(Text)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    properties = relationship("Property", back_populates="community", cascade="all, delete-orphan")


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    building = Column(Text)
    unit = Column(Text)
    room = Column(Text)
    area = Column(Float)
    layout = Column(Text)
    floor = Column(Text)
    orientation = Column(Text)
    decoration = Column(Text)
    price = Column(Float)
    price_per_sqm = Column(Float)
    rent = Column(Float)
    rent_ratio = Column(Float)
    expected_price = Column(Float)
    visit_date = Column(DateTime)
    photos = Column(Text)
    videos = Column(Text)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    community = relationship("Community", back_populates="properties")
