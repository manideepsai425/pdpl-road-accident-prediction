from fastapi import APIRouter
from app.models.schemas import PredictionInput, PredictionOutput
from app.ml.model import predict as run_predict

router = APIRouter()

@router.post("/", response_model=PredictionOutput)
def predict_accident(data: PredictionInput):
    result = run_predict(data.dict())
    return PredictionOutput(
        **result,
        location_name=data.location_name,
        latitude=data.latitude,
        longitude=data.longitude,
    )

@router.get("/options")
def get_options():
    return {
        "road_types":       ["Highway", "Bypass", "District Road", "Bridge Road",
                             "State Highway", "Industrial Road", "Village Road", "Urban Road"],
        "weather":          ["Clear", "Rainy", "Foggy", "Overcast", "Night Drizzle"],
        "road_conditions":  ["Good", "Potholed", "Wet", "Under Construction", "Gravelled"],
        "light_conditions": ["Daylight", "Dark – No Street Light", "Dark – Street Light", "Dawn/Dusk"],
        "vehicle_types":    ["Two-Wheeler", "Car/Jeep", "Auto-Rickshaw",
                             "Truck/Lorry", "Bus", "Tractor"],
        "collision_types":  ["Head-On", "Rear-End", "Side-Swipe",
                             "Rollover", "Hit-and-Run", "Pedestrian"],
        "locations": [
            {"name": "NH-163 Near Peddapalli Toll Plaza",   "lat": 18.6142, "lon": 79.3821},
            {"name": "Ramagundam Bypass Junction",           "lat": 18.7548, "lon": 79.5002},
            {"name": "Manthani Bridge Approach",             "lat": 18.6530, "lon": 79.6601},
            {"name": "Sulthanabad Cross Roads",              "lat": 18.5920, "lon": 79.4210},
            {"name": "Godavari Bridge NH-163",               "lat": 18.7021, "lon": 79.5180},
            {"name": "Jammikunta–Peddapalli Road",           "lat": 18.5612, "lon": 79.3104},
            {"name": "Ramagundam NTPC Gate Road",            "lat": 18.7780, "lon": 79.4930},
            {"name": "Dharmaram Crossroad",                  "lat": 18.6750, "lon": 79.3650},
            {"name": "Karimnagar Highway Fork Peddapalli",   "lat": 18.6005, "lon": 79.3540},
            {"name": "Korutla Junction Near Peddapalli",     "lat": 18.5280, "lon": 79.3260},
            {"name": "Peddapalli Town Circle",               "lat": 18.6160, "lon": 79.3790},
            {"name": "Ramagundam Old Town Road",             "lat": 18.7620, "lon": 79.4870},
            {"name": "Srirampur Road Stretch",               "lat": 18.7200, "lon": 79.5350},
            {"name": "Mancherial Road – Peddapalli Border",  "lat": 18.6810, "lon": 79.4450},
            {"name": "Kataram Village Road",                 "lat": 18.6400, "lon": 79.4020},
        ]
  }
                             
