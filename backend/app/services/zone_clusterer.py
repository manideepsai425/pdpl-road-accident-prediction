import pandas as pd
import numpy as np

RISK_LABEL_MAP = [
    (70, "Critical", "#FF3B30"),
    (50, "High",     "#FF9500"),
    (30, "Medium",   "#FFCC00"),
    (0,  "Low",      "#34C759"),
]

def get_risk_label(score: float):
    for threshold, label, color in RISK_LABEL_MAP:
        if score >= threshold:
            return label, color
    return "Low", "#34C759"

def get_zone_risks(df: pd.DataFrame) -> list:
    accidents = df[df["accident_occurred"] == 1]
    grouped = accidents.groupby("location_name").agg(
        latitude        = ("latitude",  "mean"),
        longitude       = ("longitude", "mean"),
        avg_risk_score  = ("risk_score","mean"),
        total_accidents = ("accident_id","count"),
        top_road_type   = ("road_type",  lambda x: x.mode()[0]),
        top_weather     = ("weather",    lambda x: x.mode()[0]),
    ).reset_index()

    severity_counts = accidents.groupby("location_name")["severity"].value_counts().unstack(fill_value=0)
    for col in ["Fatal", "Serious", "Minor"]:
        if col not in severity_counts.columns:
            severity_counts[col] = 0
    severity_counts = severity_counts.rename(columns={
        "Fatal":   "fatal_count",
        "Serious": "serious_count",
        "Minor":   "minor_count",
    })[["fatal_count", "serious_count", "minor_count"]]

    grouped = grouped.merge(severity_counts, on="location_name", how="left").fillna(0)

    result = []
    for i, row in enumerate(grouped.to_dict(orient="records")):
        label, color = get_risk_label(row["avg_risk_score"])
        result.append({
            "zone_id":        i + 1,
            "location_name":  row["location_name"],
            "latitude":       round(row["latitude"], 6),
            "longitude":      round(row["longitude"], 6),
            "avg_risk_score": round(row["avg_risk_score"], 1),
            "total_accidents":int(row["total_accidents"]),
            "fatal_count":    int(row["fatal_count"]),
            "serious_count":  int(row["serious_count"]),
            "minor_count":    int(row["minor_count"]),
            "risk_label":     label,
            "risk_color":     color,
            "top_road_type":  row["top_road_type"],
            "top_weather":    row["top_weather"],
        })
    result.sort(key=lambda x: x["avg_risk_score"], reverse=True)
    return result
