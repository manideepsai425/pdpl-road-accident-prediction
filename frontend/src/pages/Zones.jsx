import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeatMap from "../components/HeatMap";
import ZoneTable from "../components/ZoneTable";
import { ... } from "../hooks/useAccidentData";


const LEGEND = [
  { label: "Critical", color: "#FF3B30", range: "70–100" },
  { label: "High",     color: "#FF9500", range: "50–69"  },
  { label: "Medium",   color: "#FFCC00", range: "30–49"  },
  { label: "Low",      color: "#34C759", range: "0–29"   },
];

export default function Zones() {
  const { data: zones, loading } = useZones();
  const [tab, setTab] = useState("map");

  useEffect(() => {
    if (!loading && zones.length > 0 && tab === "map") {
      setTimeout(() => {
        document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [loading]);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 36 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 20,
            background: "rgba(52,199,89,0.1)", border: "1px solid rgba(52,199,89,0.2)",
            fontSize: 11, color: "#34C759", letterSpacing: 1.2,
            textTransform: "uppercase", fontWeight: 600, marginBottom: 16,
          }}>
            <span>●</span> Peddapalli District
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 10 }}>
            Accident Risk Zones
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Interactive map and ranked table of all monitored zones across Peddapalli district.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["map", "table"].map(t => (
              <motion.button
                key={t}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setTab(t)}
                style={{
                  padding: "9px 22px", borderRadius: 22, fontSize: 14, fontWeight: 600,
                  background: tab === t ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: tab === t ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)",
                  color: tab === t ? "#fff" : "rgba(255,255,255,0.45)",
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.25s",
                }}
              >
                {t === "map" ? "🗺 Map View" : "📋 Table View"}
              </motion.button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {LEGEND.map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                <span style={{ color: "rgba(255,255,255,0.45)" }}>{l.label}</span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>{l.range}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: 40, height: 40, border: "2px solid rgba(255,255,255,0.08)", borderTopColor: "#34C759", borderRadius: "50%" }}
            />
          </div>
        ) : (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {tab === "map" ? (
              <div id="map-section">
                <HeatMap zones={zones} />
                <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                  Click any marker to see zone details · Map data © CARTO
                </div>
              </div>
            ) : (
              <ZoneTable zones={zones} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
