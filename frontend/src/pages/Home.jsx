import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSummary } from "../hooks/useAccidentData";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

function StatCard({ value, label, color = "#fff", delay = 0 }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -4, boxShadow: `0 20px 60px rgba(0,0,0,0.5)` }}
      style={{
        padding: "28px 24px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
        cursor: "default",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: "-1px", marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 0.8, textTransform: "uppercase" }}>
        {label}
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -6, background: "rgba(255,255,255,0.05)" }}
      style={{
        padding: "28px 24px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{title}</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{desc}</div>
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
    const ctx = canvas.getContext("2d");
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,59,48,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 60 }}>
      <div style={{ position: "relative", overflow: "hidden", padding: "100px 24px 80px", textAlign: "center" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,59,48,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <motion.div {...fadeUp(0)} style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 16px", borderRadius: 20,
            background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.25)",
            fontSize: 12, color: "#FF3B30", letterSpacing: 1,
            textTransform: "uppercase", fontWeight: 600, marginBottom: 28,
          }}>
            <motion.span animate={{ scale: [1,1.3,1] }} transition={{ repeat: Infinity, duration: 1.8 }}>â—</motion.span>
            Peddapalli District, Telangana
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          style={{
            fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800,
            letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 24,
            background: "linear-gradient(160deg, #fff 40%, rgba(255,255,255,0.35) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            position: "relative",
          }}
        >
          Predict Road<br />Accidents with AI
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          style={{ fontSize: 18, color: "rgba(255,255,255,0.45)", maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.7 }}
        >
          Machine-learning powered risk analysis for every road, junction, and weather condition across Peddapalli district.
        </motion.p>

        <motion.div {...fadeUp(0.3)} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(255,59,48,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/predict")}
            style={{
              padding: "15px 36px", borderRadius: 50,
              background: "linear-gradient(135deg, #FF3B30, #FF9500)",
              border: "none", color: "#fff", fontSize: 16, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.2,
            }}
          >
            âš¡ Predict Risk Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/zones")}
            style={{
              padding: "15px 36px", borderRadius: 50,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", fontSize: 16, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ðŸ—º View Risk Map
          </motion.button>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>
        {!loading && data && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 60 }}
          >
            <StatCard value={data.total_records}    label="Records"      delay={0.4} />
            <StatCard value={data.total_accidents}  label="Accidents"    color="#FF9500" delay={0.5} />
            <StatCard value={data.fatal_count}      label="Fatal"        color="#FF3B30" delay={0.6} />
            <StatCard value={data.avg_risk_score}   label="Avg Risk"     color="#FFCC00" delay={0.7} />
            <StatCard value={`${data.peak_hour}:00`} label="Peak Hour"   color="#0A84FF" delay={0.8} />
          </motion.div>
        )}

        <motion.h2 {...fadeUp(0.5)} style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.5px" }}>
          What RoadSafe AI Does
        </motion.h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 60 }}>
          <FeatureCard icon="ðŸ§ " title="ML Risk Prediction" desc="VotingClassifier ensemble â€” RandomForest + GradientBoosting â€” predicts accident probability in real time." delay={0.5} />
          <FeatureCard icon="ðŸ—º" title="Interactive Zone Map" desc="Leaflet-powered dark map of Peddapalli showing accident-prone zones with live popups and colour-coded risk levels." delay={0.6} />
          <FeatureCard icon="ðŸ“Š" title="Deep Analytics" desc="Hourly trends, severity distributions, weather correlations, and monthly accident patterns across the district." delay={0.7} />
          <FeatureCard icon="âš¡" title="Instant Results" desc="FastAPI backend on Render delivers predictions in milliseconds, deployed globally and always live." delay={0.8} />
        </div>

        <motion.div
          {...fadeUp(0.7)}
          style={{
            padding: "32px", borderRadius: 24,
            background: "linear-gradient(135deg, rgba(255,59,48,0.08), rgba(255,149,0,0.08))",
            border: "1px solid rgba(255,59,48,0.15)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Ready to analyse a route?</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Enter road conditions and get an instant risk prediction for Peddapalli roads.</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(255,59,48,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/predict")}
            style={{
              padding: "13px 28px", borderRadius: 50,
              background: "linear-gradient(135deg, #FF3B30, #FF9500)",
              border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Get Started â†’
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
  }
        
