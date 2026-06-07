import React from "react";
import { motion } from "framer-motion";
import PredictionForm from "../components/PredictionForm";

export default function Predict() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 64,
      background: "linear-gradient(180deg, #F0FDF4 0%, #F8FAFC 120px, #F8FAFC 100%)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 36 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 24,
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
            fontSize: 11, color: "#16A34A", letterSpacing: 1,
            textTransform: "uppercase", fontWeight: 700, marginBottom: 16,
          }}>
            <motion.span
              animate={{ scale: [1,1.4,1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }}
            />
            AI Prediction Engine
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1.2px", marginBottom: 12,
            fontFamily: "'Bricolage Grotesque', sans-serif", color: "#0F172A" }}>
            Predict Accident Risk
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75, maxWidth: 560 }}>
            Configure road and environmental conditions for any location in Peddapalli district.
            The VotingClassifier model returns an instant risk score and top contributing factors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "#fff",
            border: "1.5px solid #E2E8F0",
            borderRadius: 28, padding: "36px 32px",
            boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
          }}
        >
          <PredictionForm />
        </motion.div>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{
            marginTop: 20, padding: "14px 20px", borderRadius: 14,
            background: "#EFF6FF", border: "1px solid #BFDBFE",
            display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <span style={{ fontSize: 18 }}>ℹ️</span>
          <p style={{ fontSize: 13, color: "#1D4ED8", fontWeight: 500, margin: 0 }}>
            Powered by a VotingClassifier ensemble (RandomForest + GradientBoosting) trained on
            500 Peddapalli district accident records.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
