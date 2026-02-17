from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import SessionLocal
from app import crud, schemas
from app.websocket_manager import manager

router = APIRouter(prefix="/register", tags=["Registration"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
async def register(data: schemas.RegistrationCreate, db: Session = Depends(get_db)):
    try:
        entry = crud.create_registration(db, data)
        
        # Get updated statistics
        stats = crud.get_statistics(db)

        # Prepare broadcast message
        broadcast_message = {
            "event": "new_registration",
            "data": {
                "id": entry.id,
                "name": entry.name,
                "role": entry.role,
                "phone": entry.phone,
                "email": entry.email,
                "gender": entry.gender,
                "address": entry.address,
                "created_at": entry.created_at.isoformat() if entry.created_at else None
            },
            "statistics": stats
        }
        
        # Broadcast new registration with statistics
        await manager.broadcast(broadcast_message)

        return entry
    except IntegrityError as e:
        db.rollback()
        error_msg = str(e.orig)
        if "phone" in error_msg.lower() and "unique" in error_msg.lower():
            raise HTTPException(
                status_code=400,
                detail=f"Phone number {data.phone} is already registered. Please use a different phone number."
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Registration failed due to a database constraint. Please check your input."
            )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while registering: {str(e)}"
        )

@router.get("/")
def list_all(db: Session = Depends(get_db)):
    return crud.get_all(db)

@router.get("/statistics")
def get_statistics(db: Session = Depends(get_db)):
    """Get current registration statistics"""
    return crud.get_statistics(db)

@router.patch("/{registration_id}/donor-tier")
def update_donor_tier(registration_id: int, body: schemas.DonorTierUpdate, db: Session = Depends(get_db)):
    """Update the donor tier for a registration"""
    valid_tiers = ["supporter", "impact_contributor", "education_patron"]
    if body.donor_tier not in valid_tiers:
        raise HTTPException(status_code=400, detail=f"Invalid tier. Must be one of: {valid_tiers}")
    entry = crud.update_donor_tier(db, registration_id, body.donor_tier)
    if not entry:
        raise HTTPException(status_code=404, detail="Registration not found")
    return {"message": "Donor tier updated", "donor_tier": body.donor_tier}
