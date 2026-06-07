from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, analytics, zones
from app.ml.model import load_model

app = FastAPI(
    title="Peddapalli Road Accident Prediction API",
    description="AI-powered road accident risk prediction for Peddapalli district, Telangana",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    load_model()

app.include_router(predict.router,   prefix="/api/predict",   tags=["Prediction"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(zones.router,     prefix="/api/zones",     tags=["Zones"])

@app.get("/")
def root():
    return {
        "message": "Peddapalli Road Accident Prediction API",
        "status":  "operational",
        "district": "Peddapalli, Telangana, India",
        "docs":    "/docs",
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
