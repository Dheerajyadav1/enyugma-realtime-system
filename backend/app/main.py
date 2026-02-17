import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.websocket_manager import manager
from app.routes.registration import router as registration_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup — if DB is unreachable, log error and continue."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created / verified successfully.")
    except Exception as e:
        logger.error(f"Could not connect to database on startup: {e}")
        logger.error("The server will start, but API calls requiring the DB will fail.")
    yield


app = FastAPI(lifespan=lifespan)

# Configure CORS - must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(registration_router)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            try:
                message = await websocket.receive()
                if "text" in message:
                    pass
                elif "bytes" in message:
                    pass
            except Exception:
                break
    except Exception:
        pass
    finally:
        manager.disconnect(websocket)
