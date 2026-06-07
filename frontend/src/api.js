import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export const fetchSummary       = ()       => api.get("/api/analytics/summary").then(r => r.data);
export const fetchHourly        = ()       => api.get("/api/analytics/hourly").then(r => r.data);
export const fetchSeverity      = ()       => api.get("/api/analytics/severity").then(r => r.data);
export const fetchWeather       = ()       => api.get("/api/analytics/weather").then(r => r.data);
export const fetchMonthly       = ()       => api.get("/api/analytics/monthly").then(r => r.data);
export const fetchRoadTypes     = ()       => api.get("/api/analytics/road-types").then(r => r.data);
export const fetchCollisions    = ()       => api.get("/api/analytics/collisions").then(r => r.data);
export const fetchZones         = ()       => api.get("/api/zones/").then(r => r.data);
export const fetchHeatmap       = ()       => api.get("/api/zones/heatmap").then(r => r.data);
export const fetchOptions       = ()       => api.get("/api/predict/options").then(r => r.data);
export const postPrediction     = (body)   => api.post("/api/predict/", body).then(r => r.data);

export default api;
