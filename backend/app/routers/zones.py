from fastapi import APIRouter
from app.services.preprocessor import load_data
from app.services.zone_clusterer import get_zone_risks

router = APIRouter()

@router.get("/")
def all_zones():
    df = load_data()
    return get_zone_risks(df)

@router.get("/heatmap")
def heatmap_data():
    df = load_data()
    zones = get_zone_risks(df)
    return [
        {
            "lat":        z["latitude"],
            "lon":        z["longitude"],
            "weight":     z["avg_risk_score"] / 100,
            "risk_label": z["risk_label"],
            "name":       z["location_name"],
        }
        for z in zones
    ]
