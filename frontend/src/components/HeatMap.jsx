import React, { useEffect, useRef } from "react";

const RISK_COLORS = {
  Critical: "#DC2626",
  High:     "#EF4444",
  Medium:   "#CA8A04",
  Low:      "#16A34A",
};

const RISK_BG = {
  Critical: "#FEF2F2",
  High:     "#FEF2F2",
  Medium:   "#FEFCE8",
  Low:      "#F0FDF4",
};

export default function HeatMap({ zones }) {
  const mapRef  = useRef(null);
  const mapInst = useRef(null);

  useEffect(() => {
    if (mapInst.current || !zones || zones.length === 0) return;
    const L = window.L;
    if (!L) return;

    mapInst.current = L.map(mapRef.current, {
      center: [18.6500, 79.4500],
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
    });

    // Light CartoDB tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(mapInst.current);

    zones.forEach(zone => {
      const color  = RISK_COLORS[zone.risk_label] || "#22C55E";
      const bgCol  = RISK_BG[zone.risk_label]    || "#F0FDF4";

      const icon = L.divIcon({
        html: `
          <div style="
            width: 48px; height: 48px;
            background: ${bgCol};
            border: 2.5px solid ${color};
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 16px ${color}40, 0 0 0 6px ${color}15;
            font-size: 20px;
            cursor: pointer;
            transition: transform 0.2s;
          ">⚠</div>
        `,
        className: "",
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      L.marker([zone.latitude, zone.longitude], { icon })
        .bindPopup(`
          <div style="
            font-family: 'DM Sans', sans-serif;
            min-width: 210px; padding: 4px;
          ">
            <div style="
              display:inline-block; padding:4px 12px; border-radius:20px;
              background:${bgCol}; border:1px solid ${color}40;
              color:${color}; font-weight:700; font-size:12px; margin-bottom:10px;
            ">${zone.risk_label} Risk</div>

            <div style="font-weight:700; font-size:13px; color:#0F172A; margin-bottom:10px; line-height:1.4">
              ${zone.location_name}
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
              ${[
                ["Risk Score", zone.avg_risk_score.toFixed(0), color],
                ["Accidents",  zone.total_accidents,            "#3B82F6"],
                ["Fatal",      zone.fatal_count,                "#EF4444"],
                ["Serious",    zone.serious_count,              "#CA8A04"],
              ].map(([l, v, c]) => `
                <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:8px;border-radius:10px;text-align:center">
                  <div style="color:${c};font-weight:800;font-size:17px;font-family:'Bricolage Grotesque',sans-serif">${v}</div>
                  <div style="color:#94A3B8;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px">${l}</div>
                </div>
              `).join("")}
            </div>

            <div style="font-size:11px;color:#94A3B8;border-top:1px solid #F1F5F9;padding-top:8px">
              ${zone.top_road_type} · ${zone.top_weather}
            </div>
          </div>
        `, { maxWidth: 270 })
        .addTo(mapInst.current);
    });

    return () => {
      mapInst.current?.remove();
      mapInst.current = null;
    };
  }, [zones]);

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1.5px solid #E2E8F0",
      boxShadow: "0 4px 20px rgba(15,23,42,0.08)" }}>
      <div ref={mapRef} style={{ width: "100%", height: 480, background: "#F8FAFC" }} />
    </div>
  );
}
