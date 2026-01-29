from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class CodeRepository(Base):
    __tablename__ = "code_repositories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    classification = Column(String) # Unclassified, Confidential, Secret, Top Secret
    owner_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text) # Storing code content directly for simplicity
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", backref="repositories")
