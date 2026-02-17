from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas

def create_registration(db: Session, data: schemas.RegistrationCreate):
    entry = models.Registration(**data.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def get_all(db: Session):
    return db.query(models.Registration).order_by(models.Registration.id.desc()).all()

def get_statistics(db: Session):
    """Get counts of registrations by role"""
    stats = db.query(
        models.Registration.role,
        func.count(models.Registration.id).label('count')
    ).group_by(models.Registration.role).all()
    
    result = {
        "mentor": 0,
        "volunteer": 0,
        "donor": 0,
        "total": 0
    }
    
    for role, count in stats:
        if role in result:
            result[role] = count
        result["total"] += count
    
    return result

def update_donor_tier(db: Session, registration_id: int, donor_tier: str):
    entry = db.query(models.Registration).filter(models.Registration.id == registration_id).first()
    if not entry:
        return None
    entry.donor_tier = donor_tier
    db.commit()
    db.refresh(entry)
    return entry
