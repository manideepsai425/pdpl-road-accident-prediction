import React from "react";
import { motion } from "framer-motion";

const colorMap = {
  Critical: { bg: "rgba(255,59,48,0.12)",  border: "rgba(255,59,48,0.3)",  glow: "rgba(255,59,48,0.4)"  },
  High:     { bg: "rgba(255,149,0,0.12)",  border: "rgba(255,149,0,0.3)",  glow: "rgba(255,149,0,0.4)"  },
  Medium:   { bg: "rgba(255,204,0,0.12)",  border: "rgba(255,204,0,0.3)",  glow: "rgba(255,204,0,0.4)"  },
  Low:      { bg: "rgba(52,199,89,0.12)",  border: "rgba(52,199,89,0.3)",  glow: "rgba(52,199,89,0.4)"  },
};

const emojiMap = { Critical: "🔴", High: "🟠", Medium: "🟡", Low: "🟢" };

export default function RiskCard({ result }) {
  if (!result) return null;
  const c = colorMap[result.risk_label] || colorMap.Low;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 24,
        padding: 32,
        boxShadow: `0 0 60px ${c.glow}`,
        textAlign: "center",
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        style={{ fontSize: 56, marginBottom: 16 }}
      >
        {emojiMap[result.risk_label]}
      </motion.div>

      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
        Risk Level
      </div>
      <div style={{ fontSize: 42, fontWeight: 800, color: result.risk_color, letterSpacing: "-1px", marginBottom: 4 }}>
        {result.risk_label}
      </div>
      <div style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>
        Score: <span style={{ color: "#fff", fontWeight: 700 }}>{result.risk_score}</span>/100
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <StatPill label="Accident Probability" value={`${(result.accident_probability * 100).toFixed(1)}%`} color={result.risk_color} />
        <StatPill label="Predicted Severity"   value={result.severity_prediction}                         color={result.risk_color} />
      </div>

      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
          Risk Factors
        </div>
        {result.top_risk_factors.map((f, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.75)",
            }}
          >
            <span style={{ color: result.risk_color, fontSize: 10 }}>●</span> {f}
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.04)", fontSize: 12, color: "rgba(255,255,255,0.45)", textAlign: "left" }}>
        📍 {result.location_name}
        <span style={{ float: "right" }}>
          {result.latitude.toFixed(4)}°N, {result.longitude.toFixed(4)}°E
        </span>
      </div>
    </motion.div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      padding: "14px 16px", borderRadius: 14,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
