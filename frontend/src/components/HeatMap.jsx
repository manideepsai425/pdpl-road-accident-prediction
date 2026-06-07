import React, { useEffect, useRef } from "react";

const RISK_COLORS = {
  Critical: "#FF3B30",
  High:     "#FF9500",
  Medium:   "#FFCC00",
  Low:      "#34C759",
};

export default function HeatMap({ zones }) {
  const mapRef    = useRef(null);
  const mapInst   = useRef(null);
  const markersRef = useRef([]);

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

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(mapInst.current);

    zones.forEach(zone => {
      const color = RISK_COLORS[zone.risk_label] || "#fff";

      const icon = L.divIcon({
        html: `
          <div style="
            width: 44px; height: 44px;
            background: ${color}22;
            border: 2px solid ${color};
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 20px ${color}66;
            font-size: 18px;
            backdrop-filter: blur(4px);
          ">⚠</div>
        `,
        className: "",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([zone.latitude, zone.longitude], { icon })
        .bindPopup(`
          <div style="
            background: #111; color: #fff;
            border-radius: 12px; padding: 14px;
            font-family: Sora, sans-serif; min-width: 200px;
            border: 1px solid ${color}40;
          ">
            <div style="font-weight:700; margin-bottom:8px; font-size:13px; color:${color}">
              ${zone.risk_label} Risk Zone
            </div>
            <div style="font-size:12px; color:rgba(255,255,255,0.75); margin-bottom:10px; line-height:1.5">
              ${zone.location_name}
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px;">
              <div style="background:rgba(255,255,255,0.06); padding:8px; border-radius:8px; text-align:center">
                <div style="color:${color}; font-weight:700; font-size:16px">${zone.avg_risk_score.toFixed(0)}</div>
                <div style="color:rgba(255,255,255,0.4); font-size:10px">Risk Score</div>
              </div>
              <div style="background:rgba(255,255,255,0.06); padding:8px; border-radius:8px; text-align:center">
                <div style="color:#fff; font-weight:700; font-size:16px">${zone.total_accidents}</div>
                <div style="color:rgba(255,255,255,0.4); font-size:10px">Accidents</div>
              </div>
              <div style="background:rgba(255,59,48,0.1); padding:8px; border-radius:8px; text-align:center">
                <div style="color:#FF3B30; font-weight:700; font-size:16px">${zone.fatal_count}</div>
                <div style="color:rgba(255,255,255,0.4); font-size:10px">Fatal</div>
              </div>
              <div style="background:rgba(255,149,0,0.1); padding:8px; border-radius:8px; text-align:center">
                <div style="color:#FF9500; font-weight:700; font-size:16px">${zone.serious_count}</div>
                <div style="color:rgba(255,255,255,0.4); font-size:10px">Serious</div>
              </div>
            </div>
            <div style="margin-top:10px; font-size:11px; color:rgba(255,255,255,0.35)">
              ${zone.top_road_type} · ${zone.top_weather}
            </div>
          </div>
        `, { maxWidth: 260 })
        .addTo(mapInst.current);

      markersRef.current.push(marker);
    });

    return () => {
      mapInst.current?.remove();
      mapInst.current = null;
      markersRef.current = [];
    };
  }, [zones]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%", height: 460, borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0a0a0a",
      }}
    />
  );
            }
        
