import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchOptions, postPrediction } from "../utils/api";
import RiskCard from "./RiskCard";

const selectStyle = {
  width: "100%", padding: "12px 16px",
  background: "#fff",
  border: "1.5px solid #E2E8F0",
  borderRadius: 12, color: "#0F172A", fontSize: 14,
  outline: "none", appearance: "none",
  fontFamily: "inherit", fontWeight: 500,
  transition: "border-color 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: 40,
};

const inputStyle = {
  width: "100%", padding: "12px 16px",
  background: "#fff", border: "1.5px solid #E2E8F0",
  borderRadius: 12, color: "#0F172A", fontSize: 14,
  outline: "none", fontFamily: "inherit", fontWeight: 500,
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle = {
  display: "block", marginBottom: 7,
  fontSize: 12, color: "#475569",
  letterSpacing: 0.5, textTransform: "uppercase",
  fontWeight: 600,
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
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    fetchOptions().then(o => {
      setOpts(o);
      const now = new Date();
      const hour = now.getHours();
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
        vehicles_involved: 2,
        vehicle_type:     "Car/Jeep",
        collision_type:   "Rear-End",
        hour,
        is_weekend:       [0, 6].includes(now.getDay()) ? 1 : 0,
        is_peak_hour:     [7,8,9,17,18,19].includes(hour) ? 1 : 0,
        is_night:         hour >= 20 || hour <= 5 ? 1 : 0,
      });
    });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onLocationChange = (name) => {
    const loc = opts.locations.find(l => l.name === name);
    set("location_name", name);
    if (loc) { set("latitude", loc.lat); set("longitude", loc.lon); }
  };

  const onHourChange = (h) => {
    const hour = parseInt(h);
    set("hour", hour);
    set("is_peak_hour", [7,8,9,17,18,19].includes(hour) ? 1 : 0);
    set("is_night", hour >= 20 || hour <= 5 ? 1 : 0);
  };

  const getFocusStyle = (name) => focused === name
    ? { borderColor: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.12)" }
    : {};

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await postPrediction(form);
      setResult(res);
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch {
      setError("Prediction failed. Please ensure the backend is running on Render.");
    } finally {
      setLoading(false);
    }
  };

  if (!opts) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 16 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: 36, height: 36, border: "3px solid #E2E8F0", borderTopColor: "#22C55E", borderRadius: "50%" }}
      />
      <div style={{ fontSize: 14, color: "#94A3B8" }}>Loading options...</div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", gridColumn: "1 / -1" }}>

          <Field label="Location">
            <select
              style={{ ...selectStyle, ...getFocusStyle("location") }}
              value={form.location_name}
              onChange={e => onLocationChange(e.target.value)}
              onFocus={() => setFocused("location")}
              onBlur={() => setFocused(null)}
            >
              {opts.locations.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
            </select>
          </Field>

          <Field label="Hour of Day (0–23)">
            <input
              type="number" min={0} max={23}
              style={{ ...inputStyle, ...getFocusStyle("hour") }}
              value={form.hour}
              onChange={e => onHourChange(e.target.value)}
              onFocus={() => setFocused("hour")}
              onBlur={() => setFocused(null)}
            />
          </Field>

          <Field label="Weather">
            <select style={{ ...selectStyle, ...getFocusStyle("weather") }} value={form.weather}
              onChange={e => set("weather", e.target.value)}
              onFocus={() => setFocused("weather")} onBlur={() => setFocused(null)}>
              {opts.weather.map(w => <option key={w}>{w}</option>)}
            </select>
          </Field>

          <Field label="Road Condition">
            <select style={{ ...selectStyle, ...getFocusStyle("road_c") }} value={form.road_condition}
              onChange={e => set("road_condition", e.target.value)}
              onFocus={() => setFocused("road_c")} onBlur={() => setFocused(null)}>
              {opts.road_conditions.map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>

          <Field label="Light Condition">
            <select style={{ ...selectStyle, ...getFocusStyle("light") }} value={form.light_condition}
              onChange={e => set("light_condition", e.target.value)}
              onFocus={() => setFocused("light")} onBlur={() => setFocused(null)}>
              {opts.light_conditions.map(l => <option key={l}>{l}</option>)}
            </select>
          </Field>

          <Field label="Road Type">
            <select style={{ ...selectStyle, ...getFocusStyle("road_t") }} value={form.road_type}
              onChange={e => set("road_type", e.target.value)}
              onFocus={() => setFocused("road_t")} onBlur={() => setFocused(null)}>
              {opts.road_types.map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>

          <Field label="Vehicle Type">
            <select style={{ ...selectStyle, ...getFocusStyle("v_type") }} value={form.vehicle_type}
              onChange={e => set("vehicle_type", e.target.value)}
              onFocus={() => setFocused("v_type")} onBlur={() => setFocused(null)}>
              {opts.vehicle_types.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>

          <Field label="Collision Type">
            <select style={{ ...selectStyle, ...getFocusStyle("c_type") }} value={form.collision_type}
              onChange={e => set("collision_type", e.target.value)}
              onFocus={() => setFocused("c_type")} onBlur={() => setFocused(null)}>
              {opts.collision_types.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Traffic Volume">
            <input type="number" min={10} max={1000}
              style={{ ...inputStyle, ...getFocusStyle("traffic") }}
              value={form.traffic_volume}
              onChange={e => set("traffic_volume", parseInt(e.target.value))}
              onFocus={() => setFocused("traffic")} onBlur={() => setFocused(null)}
            />
          </Field>

          <Field label="Vehicles Involved">
            <input type="number" min={1} max={10}
              style={{ ...inputStyle, ...getFocusStyle("vehicles") }}
              value={form.vehicles_involved}
              onChange={e => set("vehicles_involved", parseInt(e.target.value))}
              onFocus={() => setFocused("vehicles")} onBlur={() => setFocused(null)}
            />
          </Field>

          <Field label="Speed Limit (km/h)">
            <input type="number" min={20} max={120}
              style={{ ...inputStyle, ...getFocusStyle("speed") }}
              value={form.speed_limit_kmph}
              onChange={e => set("speed_limit_kmph", parseInt(e.target.value))}
              onFocus={() => setFocused("speed")} onBlur={() => setFocused(null)}
            />
          </Field>

          <Field label="Weekend?">
            <select style={{ ...selectStyle, ...getFocusStyle("weekend") }} value={form.is_weekend}
              onChange={e => set("is_weekend", parseInt(e.target.value))}
              onFocus={() => setFocused("weekend")} onBlur={() => setFocused(null)}>
              <option value={0}>No (Weekday)</option>
              <option value={1}>Yes (Weekend)</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Context chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {form.is_night ? (
          <span style={{ padding: "4px 12px", borderRadius: 20, background: "#EFF6FF", color: "#3B82F6", fontSize: 12, fontWeight: 600 }}>🌙 Night-time</span>
        ) : null}
        {form.is_peak_hour ? (
          <span style={{ padding: "4px 12px", borderRadius: 20, background: "#FEF3C7", color: "#D97706", fontSize: 12, fontWeight: 600 }}>🚦 Peak Hour</span>
        ) : null}
        {form.is_weekend ? (
          <span style={{ padding: "4px 12px", borderRadius: 20, background: "#F0FDF4", color: "#16A34A", fontSize: 12, fontWeight: 600 }}>📅 Weekend</span>
        ) : null}
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: "14px 18px", borderRadius: 12, marginBottom: 20,
            background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, fontWeight: 500 }}>
          ⚠️ {error}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 10px 36px rgba(34,197,94,0.35)" }}
        whileTap={{ scale: 0.97 }}
        onClick={submit}
        disabled={loading}
        style={{
          width: "100%", padding: "16px 32px",
          background: loading
            ? "#E2E8F0"
            : "linear-gradient(135deg, #22C55E, #14B8A6)",
          border: "none", borderRadius: 16,
          color: loading ? "#94A3B8" : "#fff",
          fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: 0.3, transition: "all 0.3s ease",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          boxShadow: loading ? "none" : "0 4px 20px rgba(34,197,94,0.25)",
        }}
      >
        {loading ? (
          <>
            <motion.div animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              style={{ width: 20, height: 20, border: "2.5px solid #CBD5E1", borderTopColor: "#64748B", borderRadius: "50%" }}
            />
            Analysing Risk...
          </>
        ) : "⚡ Predict Accident Risk"}
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div id="result-section" key="result"
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: 36 }}
          >
            <RiskCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
