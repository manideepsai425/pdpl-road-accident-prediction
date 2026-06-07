import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeatMap from "../components/HeatMap";
import ZoneTable from "../components/ZoneTable";
import { useZones } from "../hooks/useAccidentData";

const LEGEND = [
  { label: "Critical", color: "#DC2626", bg: "#FEF2F2", range: "70â€“100" },
  { label: "High",     color: "#EF4444", bg: "#FEF2F2", range: "50â€“69"  },
  { label: "Medium",   color: "#CA8A04", bg: "#FEFCE8", range: "30â€“49"  },
  { label: "Low",      color: "#16A34A", bg: "#F0FDF4", range: "0â€“29"   },
];

export default function Zones() {
  const { data: zones, loading } = useZones();
  const [tab, setTab] = useState("map");

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 64,
      background: "linear-gradient(180deg, #F0FDF4 0%, #F8FAFC 100px, #F8FAFC 100%)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 36 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 24,
            background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.25)",
            fontSize: 11, color: "#0D9488", letterSpacing: 1,
            textTransform: "uppercase", fontWeight: 700, marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#14B8A6", display: "inline-block" }} />
            Peddapalli District
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1.2px", marginBottom: 10,
            fontFamily: "'Bricolage Grotesque', sans-serif", color: "#0F172A" }}>
            Accident Risk Zones
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75 }}>
            Interactive map and ranked table of all monitored accident zones across Peddapalli district.
          </p>
        </motion.div>

        {/* Controls bar */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{
            display: "flex", gap: 10, marginBottom: 28,
            alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
          }}
        >
          {/* Tab toggle */}
          <div style={{
            display: "flex", gap: 4, background: "#fff",
            border: "1.5px solid #E2E8F0", borderRadius: 26, padding: 4,
            boxShadow: "0 1px 6px rgba(15,23,42,0.05)",
          }}>
            {[
              { key: "map",   label: "ðŸ—º Map View"   },
              { key: "table", label: "ðŸ“‹ Table View" },
            ].map(t => (
              <motion.button
                key={t.key}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.key)}
                style={{
                  padding: "9px 22px", borderRadius: 22, fontSize: 14, fontWeight: 600,
                  background: tab === t.key
                    ? "linear-gradient(135deg, #22C55E, #14B8A6)"
                    : "transparent",
                  border: "none",
                  color: tab === t.key ? "#fff" : "#64748B",
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: tab === t.key ? "0 3px 12px rgba(34,197,94,0.25)" : "none",
                  transition: "all 0.25s ease",
                }}
              >{t.label}</motion.button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {LEGEND.map(l => (
              <div key={l.label} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 20,
                background: l.bg, border: `1px solid ${l.color}30`,
                fontSize: 12, fontWeight: 600, color: l.color,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                {l.label}
                <span style={{ color: `${l.color}80`, fontWeight: 500 }}>{l.range}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center", height: 420, gap: 16 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: 44, height: 44, border: "3px solid #E2E8F0",
                borderTopColor: "#22C55E", borderRadius: "50%" }}
            />
            <div style={{ fontSize: 14, color: "#94A3B8", fontWeight: 500 }}>Loading zone data...</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "map" ? (
                <div>
                  <HeatMap zones={zones} />
                  <div style={{ marginTop: 12, fontSize: 12, color: "#94A3B8",
                    textAlign: "center", fontWeight: 500 }}>
                    Click any marker to view zone details Â· Map data Â© CARTO
                  </div>
                </div>
              ) : (
                <ZoneTable zones={zones} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
