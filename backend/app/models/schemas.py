from pydantic import BaseModel
from typing import Optional

class PredictionInput(BaseModel):
    location_name: str
    latitude: float
    longitude: float
    road_type: str
    weather: str
    road_condition: str
    light_condition: str
    speed_limit_kmph: int
    traffic_volume: int
    vehicles_involved: int
    vehicle_type: str
    collision_type: str
    hour: int
    is_weekend: int
    is_peak_hour: int
    is_night: int

class PredictionOutput(BaseModel):
    risk_score: float
    risk_label: str
    risk_color: str
    accident_probability: float
    severity_prediction: str
    top_risk_factors: list[str]
    location_name: str
    latitude: float
    longitude: float

class ZoneRisk(BaseModel):
    zone_id: int
    location_name: str
    latitude: float
    longitude: float
    avg_risk_score: float
    total_accidents: int
    fatal_count: int
    serious_count: int
    minor_count: int
    risk_label: str
    risk_color: str
    top_road_type: str
    top_weather: str

class AnalyticsSummary(BaseModel):
    total_records: int
    total_accidents: int
    fatal_count: int
    serious_count: int
    minor_count: int
    avg_risk_score: float
    highest_risk_location: str
    peak_hour: int
    most_dangerous_weather: str
    most_dangerous_road: str
  
