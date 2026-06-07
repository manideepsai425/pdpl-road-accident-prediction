import joblib
import numpy as np
import pandas as pd
import os
from pathlib import Path

_model = None
_scaler = None
_label_encoders = {}

ARTIFACTS_DIR = Path(__file__).parent / "artifacts"

FEATURE_COLS = [
    "hour", "is_weekend", "is_peak_hour", "is_night",
    "speed_limit_kmph", "traffic_volume", "vehicles_involved",
    "road_type_enc", "weather_enc", "road_condition_enc",
    "light_condition_enc", "vehicle_type_enc", "collision_type_enc"
]

ROAD_TYPE_MAP = {
    "Highway": 0, "Bypass": 1, "District Road": 2, "Bridge Road": 3,
    "State Highway": 4, "Industrial Road": 5, "Village Road": 6, "Urban Road": 7
}
WEATHER_MAP = {
    "Clear": 0, "Rainy": 1, "Foggy": 2, "Overcast": 3, "Night Drizzle": 4
}
ROAD_COND_MAP = {
    "Good": 0, "Potholed": 1, "Wet": 2, "Under Construction": 3, "Gravelled": 4
}
LIGHT_MAP = {
    "Daylight": 0, "Dark – No Street Light": 1, "Dark – Street Light": 2, "Dawn/Dusk": 3
}
VEHICLE_MAP = {
    "Two-Wheeler": 0, "Car/Jeep": 1, "Auto-Rickshaw": 2,
    "Truck/Lorry": 3, "Bus": 4, "Tractor": 5
}
COLLISION_MAP = {
    "Head-On": 0, "Rear-End": 1, "Side-Swipe": 2,
    "Rollover": 3, "Hit-and-Run": 4, "Pedestrian": 5
}


def load_model():
    global _model, _scaler
    model_path  = ARTIFACTS_DIR / "model.pkl"
    scaler_path = ARTIFACTS_DIR / "scaler.pkl"
    if model_path.exists() and scaler_path.exists():
        _model  = joblib.load(model_path)
        _scaler = joblib.load(scaler_path)
    else:
        _train_and_save()


def _train_and_save():
    global _model, _scaler
    from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
    from sklearn.preprocessing import StandardScaler

    data_path = Path(__file__).parent.parent.parent / "data" / "peddapalli_accidents.csv"
    df = pd.read_csv(data_path)

    df["road_type_enc"]       = df["road_type"].map(ROAD_TYPE_MAP).fillna(0)
    df["weather_enc"]         = df["weather"].map(WEATHER_MAP).fillna(0)
    df["road_condition_enc"]  = df["road_condition"].map(ROAD_COND_MAP).fillna(0)
    df["light_condition_enc"] = df["light_condition"].map(LIGHT_MAP).fillna(0)
    df["vehicle_type_enc"]    = df["vehicle_type"].map(VEHICLE_MAP).fillna(0)
    df["collision_type_enc"]  = df["collision_type"].map(COLLISION_MAP).fillna(0)

    X = df[FEATURE_COLS].values
    y = df["accident_occurred"].values

    _scaler = StandardScaler()
    X_scaled = _scaler.fit_transform(X)

    rf  = RandomForestClassifier(n_estimators=100, random_state=42)
    gb  = GradientBoostingClassifier(n_estimators=100, random_state=42)
    clf = VotingClassifier([("rf", rf), ("gb", gb)], voting="soft")
    clf.fit(X_scaled, y)
    _model = clf

    ARTIFACTS_DIR.mkdir(exist_ok=True)
    joblib.dump(_model,  ARTIFACTS_DIR / "model.pkl")
    joblib.dump(_scaler, ARTIFACTS_DIR / "scaler.pkl")


def predict(features: dict) -> dict:
    if _model is None:
        load_model()

    row = [
        features.get("hour", 12),
        features.get("is_weekend", 0),
        features.get("is_peak_hour", 0),
        features.get("is_night", 0),
        features.get("speed_limit_kmph", 60),
        features.get("traffic_volume", 200),
        features.get("vehicles_involved", 2),
        ROAD_TYPE_MAP.get(features.get("road_type", "Highway"), 0),
        WEATHER_MAP.get(features.get("weather", "Clear"), 0),
        ROAD_COND_MAP.get(features.get("road_condition", "Good"), 0),
        LIGHT_MAP.get(features.get("light_condition", "Daylight"), 0),
        VEHICLE_MAP.get(features.get("vehicle_type", "Car/Jeep"), 1),
        COLLISION_MAP.get(features.get("collision_type", "Rear-End"), 1),
    ]

    X = np.array(row).reshape(1, -1)
    X_scaled = _scaler.transform(X)
    prob = float(_model.predict_proba(X_scaled)[0][1])

    risk_score = round(prob * 100, 1)

    if risk_score >= 70:
        label, color, severity = "Critical", "#FF3B30", "Fatal"
    elif risk_score >= 50:
        label, color, severity = "High",     "#FF9500", "Serious"
    elif risk_score >= 30:
        label, color, severity = "Medium",   "#FFCC00", "Serious"
    else:
        label, color, severity = "Low",      "#34C759", "Minor"

    factors = []
    if features.get("weather") in ["Rainy", "Foggy", "Night Drizzle"]:
        factors.append(f"Adverse weather: {features['weather']}")
    if features.get("road_condition") in ["Potholed", "Wet", "Under Construction"]:
        factors.append(f"Poor road condition: {features['road_condition']}")
    if features.get("light_condition") in ["Dark – No Street Light", "Dawn/Dusk"]:
        factors.append(f"Low visibility: {features['light_condition']}")
    if features.get("is_night"):
        factors.append("Night-time driving")
    if features.get("is_peak_hour"):
        factors.append("Peak traffic hour")
    if features.get("vehicles_involved", 1) >= 3:
        factors.append(f"Multiple vehicles: {features['vehicles_involved']}")
    if features.get("collision_type") in ["Head-On", "Rollover"]:
        factors.append(f"High-severity collision type: {features['collision_type']}")
    if not factors:
        factors.append("Moderate general risk conditions")

    return {
        "risk_score":           risk_score,
        "risk_label":           label,
        "risk_color":           color,
        "accident_probability": round(prob, 4),
        "severity_prediction":  severity,
        "top_risk_factors":     factors[:4],
}
