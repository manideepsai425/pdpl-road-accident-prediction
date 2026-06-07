import pandas as pd
from pathlib import Path
from functools import lru_cache

DATA_PATH = Path(__file__).parent.parent.parent / "data" / "peddapalli_accidents.csv"

@lru_cache(maxsize=1)
def load_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    return df

def get_summary(df: pd.DataFrame) -> dict:
    accidents = df[df["accident_occurred"] == 1]
    return {
        "total_records":          len(df),
        "total_accidents":        int(df["accident_occurred"].sum()),
        "fatal_count":            int((df["severity"] == "Fatal").sum()),
        "serious_count":          int((df["severity"] == "Serious").sum()),
        "minor_count":            int((df["severity"] == "Minor").sum()),
        "avg_risk_score":         round(float(df["risk_score"].mean()), 1),
        "highest_risk_location":  df.groupby("location_name")["risk_score"].mean().idxmax(),
        "peak_hour":              int(df[df["accident_occurred"]==1]["hour"].mode()[0]),
        "most_dangerous_weather": df[df["accident_occurred"]==1]["weather"].mode()[0],
        "most_dangerous_road":    df[df["accident_occurred"]==1]["road_condition"].mode()[0],
    }

def get_hourly_distribution(df: pd.DataFrame) -> list:
    hourly = df[df["accident_occurred"] == 1].groupby("hour").size().reset_index(name="count")
    return hourly.to_dict(orient="records")

def get_severity_distribution(df: pd.DataFrame) -> list:
    sev = df[df["accident_occurred"] == 1]["severity"].value_counts().reset_index()
    sev.columns = ["severity", "count"]
    return sev.to_dict(orient="records")

def get_weather_distribution(df: pd.DataFrame) -> list:
    w = df[df["accident_occurred"] == 1]["weather"].value_counts().reset_index()
    w.columns = ["weather", "count"]
    return w.to_dict(orient="records")

def get_monthly_trend(df: pd.DataFrame) -> list:
    df["month_year"] = pd.to_datetime(df["date"]).dt.to_period("M").astype(str)
    trend = df[df["accident_occurred"] == 1].groupby("month_year").size().reset_index(name="count")
    return trend.tail(24).to_dict(orient="records")

def get_road_type_distribution(df: pd.DataFrame) -> list:
    r = df[df["accident_occurred"] == 1]["road_type"].value_counts().reset_index()
    r.columns = ["road_type", "count"]
    return r.to_dict(orient="records")

def get_collision_distribution(df: pd.DataFrame) -> list:
    c = df[df["accident_occurred"] == 1]["collision_type"].value_counts().reset_index()
    c.columns = ["collision_type", "count"]
    return c.to_dict(orient="records")
  
