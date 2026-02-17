from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=True)
    role = Column(String, nullable=False)              # mentor | volunteer | donor
    city = Column(String, nullable=True)               # city of residence
    occupation = Column(String, nullable=True)          # occupation
    donor_tier = Column(String, nullable=True)          # supporter | impact_contributor | education_patron
    address = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    source = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    registered_by = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
