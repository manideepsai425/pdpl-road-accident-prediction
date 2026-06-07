import React from "react";
import { motion } from "framer-motion";

const riskConfig = {
  Critical: { bg: "linear-gradient(135deg, #FEF2F2, #FFF1F2)", border: "#FECACA", color: "#DC2626", glow: "rgba(220,38,38,0.15)",  emoji: "🔴", label: "Critical Risk"  },
  High:     { bg: "linear-gradient(135deg, #FEF2F2, #FFF7ED)", border: "#FCA5A5", color: "#EF4444", glow: "rgba(239,68,68,0.12)",   emoji: "🟠", label: "High Risk"     },
  Medium:   { bg: "linear-gradient(135deg, #FEFCE8, #FFFBEB)", border: "#FDE68A", color: "#CA8A04", glow: "rgba(202,138,4,0.12)",   emoji: "🟡", label: "Medium Risk"  },
  Low:      { bg: "linear-gradient(135deg, #F0FDF4, #ECFDF5)", border: "#86EFAC", color: "#16A34A", glow: "rgba(22,163,74,0.12)",   emoji: "🟢", label: "Low Risk"     },
};

function MetricPill({ label, value, color }) {
  return (
    <div style={{
      padding: "14px 16px", borderRadius: 14,
      background: "#fff", border: "1px solid #E2E8F0",
      boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
    }}>
      <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6, letterSpacing: 0.6, fontWeight: 500, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color,
        fontFamily: "'Bricolage Grotesque', sans-serif" }}>{value}</div>
    </div>
  );
}

export default function RiskCard({ result }) {
  if (!result) return null;
  const c = riskConfig[result.risk_label] || riskConfig.Low;

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 24, overflow: "hidden",
        boxShadow: `0 16px 48px ${c.glow}, 0 4px 16px rgba(15,23,42,0.08)`,
        border: `1.5px solid ${c.border}`,
      }}
    >
      {/* Header gradient */}
      <div style={{
        background: c.bg, padding: "32px 28px 24px",
        textAlign: "center", position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`,
        }} />

        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ fontSize: 56, marginBottom: 16, display: "inline-block" }}
        >
          {c.emoji}
        </motion.div>

        <div style={{ fontSize: 12, color: "#64748B", letterSpacing: 2, textTransform: "uppercase",
          marginBottom: 8, fontWeight: 600 }}>
          Risk Assessment
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, color: c.color, letterSpacing: "-1.5px",
          fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 4 }}>
          {c.label}
        </div>
        <div style={{ fontSize: 17, color: "#475569" }}>
          Score: <span style={{ color: c.color, fontWeight: 800, fontSize: 22 }}>{result.risk_score}</span>
          <span style={{ color: "#94A3B8" }}>/100</span>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ background: "#fff", padding: "20px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <MetricPill
            label="Accident Probability"
            value={`${(result.accident_probability * 100).toFixed(1)}%`}
            color={c.color}
          />
          <MetricPill
            label="Predicted Severity"
            value={result.severity_prediction}
            color={c.color}
          />
        </div>

        {/* Risk Factors */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase",
            fontWeight: 600, marginBottom: 12 }}>
            Risk Factors Identified
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result.top_risk_factors.map((f, i) => (
              <motion.div
                key={i}
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 12,
                  background: "#F8FAFC", border: "1px solid #E2E8F0",
                  fontSize: 13, color: "#374151", fontWeight: 500,
                }}
              >
                <span style={{ color: c.color, fontSize: 8 }}>●</span>
                {f}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div style={{
          padding: "12px 16px", borderRadius: 12,
          background: "#F8FAFC", border: "1px solid #E2E8F0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
            📍 {result.location_name}
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>
            {result.latitude?.toFixed(4)}°N, {result.longitude?.toFixed(4)}°E
          </div>
        </div>
      </div>
    </motion.div>
  );
}
