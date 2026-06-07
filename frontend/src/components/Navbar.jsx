import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/",          label: "Home",      icon: "🏠" },
  { to: "/predict",   label: "Predict",   icon: "⚡" },
  { to: "/analytics", label: "Analytics", icon: "📊" },
  { to: "/zones",     label: "Zones",     icon: "🗺" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(248,250,252,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "#E2E8F0" : "transparent"}`,
        transition: "all 0.35s ease",
        padding: "0 28px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: scrolled ? "0 1px 20px rgba(15,23,42,0.07)" : "none",
      }}
    >
      {/* Logo */}
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{
              width: 36, height: 36, borderRadius: 12,
              background: "linear-gradient(135deg, #22C55E, #14B8A6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
            }}
          >🛡️</motion.div>
          <div>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px",
              color: "#0F172A", lineHeight: 1,
            }}>RoadSafe AI</div>
            <div style={{ fontSize: 10, color: "#94A3B8", letterSpacing: 0.5, lineHeight: 1.2 }}>
              Peddapalli District
            </div>
          </div>
        </motion.div>
      </NavLink>

      {/* Desktop Links */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "8px 18px",
                  borderRadius: 24,
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#fff" : "#475569",
                  background: isActive
                    ? "linear-gradient(135deg, #22C55E, #14B8A6)"
                    : "transparent",
                  border: isActive ? "none" : "1px solid transparent",
                  boxShadow: isActive ? "0 4px 14px rgba(34,197,94,0.3)" : "none",
                  transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: "absolute", inset: 0, borderRadius: 24,
                      background: "linear-gradient(135deg, #22C55E, #14B8A6)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Status badge */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 20,
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.2)",
          fontSize: 12, color: "#16A34A", fontWeight: 600,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
        Live
      </motion.div>
    </motion.nav>
  );
}
