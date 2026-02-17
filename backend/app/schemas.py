from pydantic import BaseModel
from datetime import datetime

class RegistrationCreate(BaseModel):
    name: str
    phone: str
    email: str | None = None
    role: str                              # mentor | volunteer | donor
    city: str | None = None
    occupation: str | None = None
    donor_tier: str | None = None          # supporter | impact_contributor | education_patron
    address: str | None = None
    gender: str | None = None
    source: str | None = None
    notes: str | None = None
    registered_by: str | None = None

class RegistrationResponse(RegistrationCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DonorTierUpdate(BaseModel):
    donor_tier: str
