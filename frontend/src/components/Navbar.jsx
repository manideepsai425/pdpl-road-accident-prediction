import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/",          label: "Home"      },
  { to: "/predict",   label: "Predict"   },
  { to: "/analytics", label: "Analytics" },
  { to: "/zones",     label: "Zones"     },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.3)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        transition: "all 0.4s ease",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #FF3B30, #FF9500)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: "0 4px 16px rgba(255,59,48,0.4)",
          }}>⚠️</div>
          <span style={{
            fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px",
            background: "linear-gradient(90deg, #fff 60%, rgba(255,255,255,0.5))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>RoadSafe AI</span>
        </motion.div>
      </NavLink>

      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "7px 16px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                  background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
              >
                {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
