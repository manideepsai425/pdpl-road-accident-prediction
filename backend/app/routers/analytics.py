from fastapi import APIRouter
from app.services.preprocessor import (
    load_data, get_summary, get_hourly_distribution,
    get_severity_distribution, get_weather_distribution,
    get_monthly_trend, get_road_type_distribution, get_collision_distribution
)

router = APIRouter()

@router.get("/summary")
def analytics_summary():
    df = load_data()
    return get_summary(df)

@router.get("/hourly")
def hourly_distribution():
    df = load_data()
    return get_hourly_distribution(df)

@router.get("/severity")
def severity_distribution():
    df = load_data()
    return get_severity_distribution(df)

@router.get("/weather")
def weather_distribution():
    df = load_data()
    return get_weather_distribution(df)

@router.get("/monthly")
def monthly_trend():
    df = load_data()
    return get_monthly_trend(df)

@router.get("/road-types")
def road_type_distribution():
    df = load_data()
    return get_road_type_distribution(df)

@router.get("/collisions")
def collision_distribution():
    df = load_data()
    return get_collision_distribution(df)
