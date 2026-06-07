import { useState, useEffect } from "react";
import {
  fetchSummary, fetchHourly, fetchSeverity,
  fetchWeather, fetchMonthly, fetchRoadTypes,
  fetchCollisions, fetchZones
} from "../utils/api";

export function useSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useAnalytics() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchHourly(),
      fetchSeverity(),
      fetchWeather(),
      fetchMonthly(),
      fetchRoadTypes(),
      fetchCollisions(),
    ])
      .then(([hourly, severity, weather, monthly, roadTypes, collisions]) => {
        setData({ hourly, severity, weather, monthly, roadTypes, collisions });
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useZones() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchZones()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
                                         }
            
