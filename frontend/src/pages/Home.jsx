import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSummary } from "../hooks/useAccidentData";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const statConfig = [
  { key: "total_records",   label: "Records",    icon: "📋", color: "#3B82F6", bg: "rgba(59,130,246,0.08)" },
  { key: "total_accidents", label: "Accidents",  icon: "⚠️", color: "#EAB308", bg: "rgba(234,179,8,0.08)"  },
  { key: "fatal_count",     label: "Fatal",      icon: "🔴", color: "#EF4444", bg: "rgba(239,68,68,0.08)"  },
  { key: "avg_risk_score",  label: "Avg Risk",   icon: "📈", color: "#22C55E", bg: "rgba(34,197,94,0.08)"  },
  { key: "peak_hour",       label: "Peak Hour",  icon: "🕐", color: "#14B8A6", bg: "rgba(20,184,166,0.08)", suffix: ":00" },
];

const features = [
  { icon: "🧠", title: "ML Risk Prediction", color: "#22C55E",
    desc: "VotingClassifier ensemble — RandomForest + GradientBoosting — predicts accident probability in real time." },
  { icon: "🗺", title: "Interactive Zone Map", color: "#3B82F6",
    desc: "Leaflet-powered map of Peddapalli showing accident-prone zones with live popups and risk levels." },
  { icon: "📊", title: "Deep Analytics", color: "#14B8A6",
    desc: "Hourly trends, severity distributions, weather correlations, and monthly patterns across the district." },
  { icon: "⚡", title: "Instant Results", color: "#EAB308",
    desc: "FastAPI backend on Render delivers predictions in milliseconds — deployed and always live." },
];

function StatCard({ value, label, icon, color, bg, suffix = "", delay }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(15,23,42,0.12)" }}
      style={{
        padding: "24px 20px", borderRadius: 20,
        background: "#fff", border: "1px solid #E2E8F0",
        textAlign: "center", cursor: "default",
        boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: bg, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 20, margin: "0 auto 14px",
      }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: "-1px", marginBottom: 4,
        fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        {value}{suffix}
      </div>
      <div style={{ fontSize: 12, color: "#94A3B8", letterSpacing: 0.8, textTransform: "uppercase", fontWeight: 500 }}>
        {label}
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, color, delay }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(15,23,42,0.1)" }}
      style={{
        padding: "28px 26px", borderRadius: 20,
        background: "#fff", border: "1px solid #E2E8F0",
        boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: `${color}14`,
        border: `1.5px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, marginBottom: 18,
      }}>{icon}</div>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: "#0F172A",
        fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</div>
      <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65 }}>{desc}</div>
    </motion.div>
  );
}

export default function Home() {
  const { data, loading } = useSummary();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.3 + 0.05,
      hue: Math.random() > 0.5 ? "34,197,94" : "20,184,166",
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    const ctx = canvas.getContext("2d");
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 64, background: "var(--bg)" }}>

      {/* Hero */}
      <div style={{
        position: "relative", overflow: "hidden",
        padding: "90px 24px 80px", textAlign: "center",
        background: "linear-gradient(180deg, #F0FDF4 0%, #F8FAFC 100%)",
      }}>
        <canvas ref={canvasRef} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(34,197,94,0.12) 0%, transparent 70%)",
        }} />

        {/* Badge */}
        <motion.div {...fadeUp(0)} style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 18px", borderRadius: 24,
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
            fontSize: 12, color: "#16A34A", letterSpacing: 0.8,
            textTransform: "uppercase", fontWeight: 700, marginBottom: 28,
          }}>
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block" }}
            />
            Peddapalli District · Telangana
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          style={{
            fontSize: "clamp(38px, 6.5vw, 76px)", fontWeight: 800,
            letterSpacing: "-2.5px", lineHeight: 1.04, marginBottom: 22,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            background: "linear-gradient(135deg, #0F172A 0%, #22C55E 50%, #14B8A6 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "gradient-shift 5s ease infinite",
            position: "relative",
          }}
        >
          Predict Road<br />Accidents with AI
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          style={{ fontSize: 18, color: "#475569", maxWidth: 540, margin: "0 auto 44px", lineHeight: 1.75, fontWeight: 400 }}
        >
          Machine-learning powered risk analysis for every road, junction, and weather condition across Peddapalli district.
        </motion.p>

        <motion.div {...fadeUp(0.3)} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 14px 40px rgba(34,197,94,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/predict")}
            style={{
              padding: "15px 36px", borderRadius: 50,
              background: "linear-gradient(135deg, #22C55E, #14B8A6)",
              border: "none", color: "#fff", fontSize: 16, fontWeight: 700,
              cursor: "pointer", letterSpacing: 0.2,
              boxShadow: "0 6px 24px rgba(34,197,94,0.3)",
            }}
          >
            ⚡ Predict Risk Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, background: "#F1F5F9", borderColor: "#CBD5E1" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/zones")}
            style={{
              padding: "15px 36px", borderRadius: 50,
              background: "#fff", border: "2px solid #E2E8F0",
              color: "#0F172A", fontSize: 16, fontWeight: 600,
              cursor: "pointer", transition: "all 0.25s ease",
            }}
          >
            🗺 View Risk Map
          </motion.button>
        </motion.div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>
        {!loading && data && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16, margin: "48px 0 64px",
            }}
          >
            {statConfig.map((s, i) => (
              <StatCard
                key={s.key}
                value={data[s.key]}
                label={s.label}
                icon={s.icon}
                color={s.color}
                bg={s.bg}
                suffix={s.suffix || ""}
                delay={0.35 + i * 0.08}
              />
            ))}
          </motion.div>
        )}

        {/* Section heading */}
        <motion.div {...fadeUp(0.5)} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 4, height: 28, borderRadius: 2, background: "linear-gradient(180deg, #22C55E, #14B8A6)" }} />
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", color: "#0F172A",
              fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              What RoadSafe AI Does
            </h2>
          </div>
          <p style={{ fontSize: 15, color: "#64748B", paddingLeft: 16 }}>
            Four pillars that make Peddapalli roads safer
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18, marginBottom: 64,
        }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={0.5 + i * 0.1} />
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          {...fadeUp(0.8)}
          style={{
            padding: "36px 40px", borderRadius: 28,
            background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDFA 100%)",
            border: "1.5px solid rgba(34,197,94,0.2)",
            boxShadow: "0 8px 32px rgba(34,197,94,0.08)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 24,
          }}
        >
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#0F172A",
              fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Ready to analyse a route?
            </h3>
            <p style={{ fontSize: 15, color: "#475569", maxWidth: 420 }}>
              Enter road conditions and get an instant risk prediction for any road in Peddapalli district.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 10px 32px rgba(34,197,94,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/predict")}
            style={{
              padding: "14px 30px", borderRadius: 50,
              background: "linear-gradient(135deg, #22C55E, #14B8A6)",
              border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 4px 16px rgba(34,197,94,0.25)",
            }}
          >
            Get Started →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
