import React, { useState } from "react";
import { motion } from "framer-motion";

const riskConfig = {
  Critical: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  High:     { color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
  Medium:   { color: "#CA8A04", bg: "#FEFCE8", border: "#FDE68A" },
  Low:      { color: "#16A34A", bg: "#F0FDF4", border: "#86EFAC" },
};

const rankColors = ["#22C55E","#3B82F6","#14B8A6","#8B5CF6","#EAB308"];

const sortOptions = [
  { key: "avg_risk_score",  label: "Risk Score" },
  { key: "total_accidents", label: "Accidents"  },
  { key: "fatal_count",     label: "Fatal"      },
];

function MetricBox({ value, label, color }) {
  return (
    <div style={{ textAlign: "center", minWidth: 52 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color,
        fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500,
        textTransform: "uppercase", letterSpacing: 0.5, marginTop: 3 }}>{label}</div>
    </div>
  );
}

export default function ZoneTable({ zones }) {
  const [sort, setSort] = useState("avg_risk_score");
  const sorted = [...zones].sort((a, b) => b[sort] - a[sort]);

  return (
    <div>
      {/* Sort tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500,
          alignSelf: "center", marginRight: 4 }}>Sort by:</span>
        {sortOptions.map(opt => (
          <motion.button
            key={opt.key}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setSort(opt.key)}
            style={{
              padding: "8px 18px", borderRadius: 22, fontSize: 13, fontWeight: 600,
              background: sort === opt.key
                ? "linear-gradient(135deg, #22C55E, #14B8A6)"
                : "#fff",
              border: sort === opt.key ? "none" : "1.5px solid #E2E8F0",
              color: sort === opt.key ? "#fff" : "#475569",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: sort === opt.key ? "0 4px 14px rgba(34,197,94,0.25)" : "none",
              transition: "all 0.22s ease",
            }}
          >{opt.label}</motion.button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 13, color: "#94A3B8", alignSelf: "center" }}>
          {sorted.length} zones
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((z, i) => {
          const rc = riskConfig[z.risk_label] || riskConfig.Low;
          const rankColor = rankColors[i] || "#94A3B8";
          return (
            <motion.div
              key={z.zone_id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 4, boxShadow: "0 8px 28px rgba(15,23,42,0.1)", background: "#FAFBFF" }}
              style={{
                padding: "18px 20px",
                borderRadius: 18,
                background: "#fff",
                border: "1.5px solid #E2E8F0",
                display: "flex", alignItems: "center", gap: 16,
                transition: "all 0.25s ease",
                boxShadow: "0 1px 6px rgba(15,23,42,0.05)",
              }}
            >
              {/* Rank badge */}
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: `${rankColor}18`,
                border: `1.5px solid ${rankColor}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: rankColor,
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}>
                {i + 1}
              </div>

              {/* Location info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 700, color: "#0F172A",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  whiteSpace: "normal", wordBreak: "break-word",
                  lineHeight: 1.35, marginBottom: 5,
                }}>
                  {z.location_name}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#64748B", background: "#F1F5F9",
                    padding: "2px 8px", borderRadius: 8, fontWeight: 500 }}>
                    {z.top_road_type}
                  </span>
                  <span style={{ fontSize: 11, color: "#64748B", background: "#F1F5F9",
                    padding: "2px 8px", borderRadius: 8, fontWeight: 500 }}>
                    {z.top_weather}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div style={{
                display: "flex", gap: 20, flexShrink: 0,
                alignItems: "center",
                borderLeft: "1px solid #F1F5F9", paddingLeft: 20,
              }}>
                <MetricBox value={z.avg_risk_score.toFixed(0)} label="Risk" color={rc.color} />
                <MetricBox value={z.total_accidents}           label="Total" color="#3B82F6" />
                <MetricBox value={z.fatal_count}               label="Fatal" color={z.fatal_count > 2 ? "#EF4444" : "#94A3B8"} />
              </div>

              {/* Risk badge */}
              <div style={{
                padding: "6px 14px", borderRadius: 22, fontSize: 12, fontWeight: 700,
                background: rc.bg, border: `1px solid ${rc.border}`,
                color: rc.color, flexShrink: 0,
                letterSpacing: 0.3,
              }}>
                {z.risk_label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
