import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchOptions, postPrediction } from "../utils/api";
import RiskCard from "./RiskCard";

const inputStyle = {
  width: "100%", padding: "13px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12, color: "#fff", fontSize: 14,
  outline: "none", appearance: "none",
  fontFamily: "inherit", transition: "border 0.25s",
};

const labelStyle = {
  display: "block", marginBottom: 6,
  fontSize: 12, color: "rgba(255,255,255,0.45)",
  letterSpacing: 0.8, textTransform: "uppercase",
  fontWeight: 500,
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function PredictionForm() {
  const [opts, setOpts]       = useState(null);
  const [form, setForm]       = useState({});
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetchOptions().then(o => {
      setOpts(o);
      const now = new Date();
      setForm({
        location_name:    o.locations[0].name,
        latitude:         o.locations[0].lat,
        longitude:        o.locations[0].lon,
        road_type:        "Highway",
        weather:          "Clear",
        road_condition:   "Good",
        light_condition:  "Daylight",
        speed_limit_kmph: 60,
        traffic_volume:   200,
        vehicles_involved:2,
        vehicle_type:     "Car/Jeep",
        collision_type:   "Rear-End",
        hour:             now.getHours(),
        is_weekend:       now.getDay() === 0 || now.getDay() === 6 ? 1 : 0,
        is_peak_hour:     [7,8,9,17,18,19].includes(now.getHours()) ? 1 : 0,
        is_night:         now.getHours() >= 20 || now.getHours() <= 5 ? 1 : 0,
      });
    });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onLocationChange = (name) => {
    const loc = opts.locations.find(l => l.name === name);
    set("location_name", name);
    set("latitude",  loc?.lat ?? form.latitude);
    set("longitude", loc?.lon ?? form.longitude);
  };

  const onHourChange = (h) => {
    const hour = parseInt(h);
    set("hour",         hour);
    set("is_peak_hour", [7,8,9,17,18,19].includes(hour) ? 1 : 0);
    set("is_night",     hour >= 20 || hour <= 5 ? 1 : 0);
  };

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await postPrediction(form);
      setResult(res);
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e) {
      setError("Prediction failed. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!opts) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: 32, height: 32, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#FF3B30", borderRadius: "50%" }}
      />
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Location">
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={form.location_name}
            onChange={e => onLocationChange(e.target.value)}
          >
            {opts.locations.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
        </Field>

        <Field label="Hour of Day (0–23)">
          <input
            type="number" min={0} max={23}
            style={inputStyle}
            value={form.hour}
            onChange={e => onHourChange(e.target.value)}
          />
        </Field>

        <Field label="Weather">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.weather} onChange={e => set("weather", e.target.value)}>
            {opts.weather.map(w => <option key={w}>{w}</option>)}
          </select>
        </Field>

        <Field label="Road Condition">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.road_condition} onChange={e => set("road_condition", e.target.value)}>
            {opts.road_conditions.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="Light Condition">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.light_condition} onChange={e => set("light_condition", e.target.value)}>
            {opts.light_conditions.map(l => <option key={l}>{l}</option>)}
          </select>
        </Field>

        <Field label="Road Type">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.road_type} onChange={e => set("road_type", e.target.value)}>
            {opts.road_types.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="Vehicle Type">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.vehicle_type} onChange={e => set("vehicle_type", e.target.value)}>
            {opts.vehicle_types.map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>

        <Field label="Collision Type">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.collision_type} onChange={e => set("collision_type", e.target.value)}>
            {opts.collision_types.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Traffic Volume">
          <input
            type="number" min={10} max={1000}
            style={inputStyle}
            value={form.traffic_volume}
            onChange={e => set("traffic_volume", parseInt(e.target.value))}
          />
        </Field>

        <Field label="Vehicles Involved">
          <input
            type="number" min={1} max={10}
            style={inputStyle}
            value={form.vehicles_involved}
            onChange={e => set("vehicles_involved", parseInt(e.target.value))}
          />
        </Field>

        <Field label="Speed Limit (km/h)">
          <input
            type="number" min={20} max={120}
            style={inputStyle}
            value={form.speed_limit_kmph}
            onChange={e => set("speed_limit_kmph", parseInt(e.target.value))}
          />
        </Field>

        <Field label="Weekend?">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.is_weekend} onChange={e => set("is_weekend", parseInt(e.target.value))}>
            <option value={0}>No (Weekday)</option>
            <option value={1}>Yes (Weekend)</option>
          </select>
        </Field>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: 14, borderRadius: 12, background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.2)", color: "#FF3B30", fontSize: 13, marginBottom: 20 }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(255,59,48,0.4)" }}
        whileTap={{ scale: 0.97 }}
        onClick={submit}
        disabled={loading}
        style={{
          width: "100%", padding: "16px 32px",
          background: loading ? "rgba(255,59,48,0.3)" : "linear-gradient(135deg, #FF3B30, #FF9500)",
          border: "none", borderRadius: 16, color: "#fff",
          fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: 0.3, transition: "all 0.3s ease",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
            />
            Analysing Risk...
          </>
        ) : (
          "⚡ Predict Accident Risk"
        )}
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div
            id="result-section"
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ marginTop: 32 }}
          >
            <RiskCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
