"""
Regenerate the Peddapalli synthetic accident dataset.
Usage:
    cd backend
    python data/generate_synthetic_data.py
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from pathlib import Path

np.random.seed(42)
random.seed(42)

locations = [
    {"name": "NH-163 Near Peddapalli Toll Plaza",       "lat": 18.6142, "lon": 79.3821, "road_type": "Highway"},
    {"name": "Ramagundam Bypass Junction",               "lat": 18.7548, "lon": 79.5002, "road_type": "Bypass"},
    {"name": "Manthani Bridge Approach",                 "lat": 18.6530, "lon": 79.6601, "road_type": "District Road"},
    {"name": "Sulthanabad Cross Roads",                  "lat": 18.5920, "lon": 79.4210, "road_type": "Highway"},
    {"name": "Godavari Bridge NH-163",                   "lat": 18.7021, "lon": 79.5180, "road_type": "Bridge Road"},
    {"name": "Jammikunta–Peddapalli Road",               "lat": 18.5612, "lon": 79.3104, "road_type": "State Highway"},
    {"name": "Ramagundam NTPC Gate Road",                "lat": 18.7780, "lon": 79.4930, "road_type": "Industrial Road"},
    {"name": "Dharmaram Crossroad",                      "lat": 18.6750, "lon": 79.3650, "road_type": "Village Road"},
    {"name": "Karimnagar Highway Fork Peddapalli",       "lat": 18.6005, "lon": 79.3540, "road_type": "Highway"},
    {"name": "Korutla Junction Near Peddapalli",         "lat": 18.5280, "lon": 79.3260, "road_type": "State Highway"},
    {"name": "Peddapalli Town Circle",                   "lat": 18.6160, "lon": 79.3790, "road_type": "Urban Road"},
    {"name": "Ramagundam Old Town Road",                 "lat": 18.7620, "lon": 79.4870, "road_type": "Urban Road"},
    {"name": "Srirampur Road Stretch",                   "lat": 18.7200, "lon": 79.5350, "road_type": "District Road"},
    {"name": "Mancherial Road – Peddapalli Border",      "lat": 18.6810, "lon": 79.4450, "road_type": "State Highway"},
    {"name": "Kataram Village Road",                     "lat": 18.6400, "lon": 79.4020, "road_type": "Village Road"},
]

weather_options   = ["Clear", "Rainy", "Foggy", "Overcast", "Night Drizzle"]
road_cond_options = ["Good", "Potholed", "Wet", "Under Construction", "Gravelled"]
light_options     = ["Daylight", "Dark – No Street Light", "Dark – Street Light", "Dawn/Dusk"]
vehicle_types     = ["Two-Wheeler", "Car/Jeep", "Auto-Rickshaw", "Truck/Lorry", "Bus", "Tractor"]
collision_types   = ["Head-On", "Rear-End", "Side-Swipe", "Rollover", "Hit-and-Run", "Pedestrian"]

start_date = datetime(2021, 1, 1)
rows = []

for i in range(500):
    loc     = random.choice(locations)
    date    = start_date + timedelta(days=random.randint(0, 1095))
    hour    = random.choices(range(24), weights=[1,1,1,1,2,3,5,7,6,5,5,5,5,5,5,5,6,7,6,5,4,3,2,1], k=1)[0]
    minute  = random.randint(0, 59)
    weather = random.choices(weather_options, weights=[50,20,10,12,8], k=1)[0]
    road_c  = random.choices(road_cond_options, weights=[40,25,15,12,8], k=1)[0]
    light   = random.choices(light_options, weights=[45,25,20,10], k=1)[0]
    speed_map = {"Highway": 80, "Bypass": 70, "District Road": 50, "Bridge Road": 60,
                 "State Highway": 60, "Industrial Road": 40, "Village Road": 30, "Urban Road": 40}
    speed_limit = speed_map.get(loc["road_type"], 60)
    traffic  = int(np.random.normal(loc=300 if "Highway" in loc["road_type"] or "Bypass" in loc["road_type"] else 150, scale=80))
    traffic  = max(20, traffic)
    vehicles = random.choices([1,2,3,4], weights=[10,55,25,10], k=1)[0]
    v_type   = random.choice(vehicle_types)
    c_type   = random.choices(collision_types, weights=[25,30,20,8,10,7], k=1)[0]
    risk = 0
    if weather in ["Rainy","Foggy","Night Drizzle"]: risk += 20
    if road_c  in ["Potholed","Wet","Under Construction","Gravelled"]: risk += 20
    if light   in ["Dark – No Street Light","Dawn/Dusk"]: risk += 15
    if hour    in [0,1,2,3,22,23]: risk += 15
    if hour    in [7,8,9,17,18,19]: risk += 10
    if loc["road_type"] in ["Highway","Bypass"]: risk += 10
    if vehicles >= 3: risk += 10
    if c_type in ["Head-On","Rollover"]: risk += 15
    risk += random.randint(-10, 10)
    risk = max(0, min(100, risk))
    severity = "Fatal" if risk >= 70 else ("Serious" if risk >= 40 else "Minor")
    accident = 1 if risk >= 30 else random.choices([0,1],[0.7,0.3])[0]
    rows.append({
        "accident_id": i+1001, "date": date.strftime("%Y-%m-%d"), "time": f"{hour:02d}:{minute:02d}",
        "hour": hour, "day_of_week": date.strftime("%A"), "month": date.month, "year": date.year,
        "location_name": loc["name"], "latitude": round(loc["lat"] + np.random.normal(0,0.005), 6),
        "longitude": round(loc["lon"] + np.random.normal(0,0.005), 6), "road_type": loc["road_type"],
        "weather": weather, "road_condition": road_c, "light_condition": light,
        "speed_limit_kmph": speed_limit, "traffic_volume": traffic, "vehicles_involved": vehicles,
        "vehicle_type": v_type, "collision_type": c_type, "severity": severity,
        "risk_score": risk, "accident_occurred": accident,
        "is_weekend": 1 if date.weekday() >= 5 else 0,
        "is_peak_hour": 1 if hour in [7,8,9,17,18,19] else 0,
        "is_night": 1 if hour in [20,21,22,23,0,1,2,3,4,5] else 0,
    })

out = Path(__file__).parent / "peddapalli_accidents.csv"
pd.DataFrame(rows).to_csv(out, index=False)
print(f"Saved {len(rows)} rows to {out}")
