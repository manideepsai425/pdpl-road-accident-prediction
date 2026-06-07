import React, { useState } from "react";
import { motion } from "framer-motion";

const colorMap = {
  Critical: "#FF3B30",
  High:     "#FF9500",
  Medium:   "#FFCC00",
  Low:      "#34C759",
};

export default function ZoneTable({ zones }) {
  const [sort, setSort] = useState("avg_risk_score");

  const sorted = [...zones].sort((a, b) => b[sort] - a[sort]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["avg_risk_score", "total_accidents", "fatal_count"].map(k => (
          <motion.button
            key={k}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setSort(k)}
            style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13,
              background: sort === k ? "rgba(10,132,255,0.2)" : "rgba(255,255,255,0.04)",
              border: sort === k ? "1px solid rgba(10,132,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
              color: sort === k ? "#0A84FF" : "rgba(255,255,255,0.55)",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            {k === "avg_risk_score" ? "Risk Score" : k === "total_accidents" ? "Accidents" : "Fatal"}
          </motion.button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map((z, i) => (
          <motion.div
            key={z.zone_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 4, background: "rgba(255,255,255,0.05)" }}
            style={{
              padding: "16px 20px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", gap: 16,
              transition: "all 0.25s ease", cursor: "default",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${colorMap[z.risk_label]}20`,
              border: `1px solid ${colorMap[z.risk_label]}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: colorMap[z.risk_label],
              flexShrink: 0,
            }}>
              {i + 1}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {z.location_name}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {z.top_road_type} · {z.top_weather}
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, flexShrink: 0, textAlign: "center" }}>
              <Stat value={z.avg_risk_score.toFixed(0)} label="Risk" color={colorMap[z.risk_label]} />
              <Stat value={z.total_accidents}           label="Total" />
              <Stat value={z.fatal_count}               label="Fatal" color={z.fatal_count > 2 ? "#FF3B30" : undefined} />
            </div>

            <div style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: `${colorMap[z.risk_label]}18`,
              border: `1px solid ${colorMap[z.risk_label]}35`,
              color: colorMap[z.risk_label], flexShrink: 0,
            }}>
              {z.risk_label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label, color }) {
  return (
    <div>
      <div style={{ fontSize: 17, fontWeight: 700, color: color || "#fff" }}>{value}</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}
