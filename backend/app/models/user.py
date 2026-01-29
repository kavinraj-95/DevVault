from sqlalchemy import Column, Integer, String, Boolean, Enum
from app.database import Base
import enum

class ClearanceLevel(str, enum.Enum):
    UNCLASSIFIED = "Unclassified"
    CONFIDENTIAL = "Confidential"
    SECRET = "Secret"
    TOP_SECRET = "Top Secret"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    clearance_level = Column(String, default=ClearanceLevel.UNCLASSIFIED)
    mfa_secret = Column(String, nullable=True)
    mfa_enabled = Column(Boolean, default=False)
    role = Column(String, default="Developer") # Developer, Admin, Architect
