import React from "react";
import { motion } from "framer-motion";
import PredictionForm from "../components/PredictionForm";

export default function Predict() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginBottom: 36 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 20,
            background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.2)",
            fontSize: 11, color: "#FF3B30", letterSpacing: 1.2,
            textTransform: "uppercase", fontWeight: 600, marginBottom: 16,
          }}>
            <span>●</span> AI Prediction Engine
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 10 }}>
            Predict Accident Risk
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
            Configure road and environmental conditions for any location in Peddapalli district.
            The VotingClassifier model returns an instant risk score and top contributing factors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: "36px 32px",
          }}
        >
          <PredictionForm />
        </motion.div>
      </div>
    </div>
  );
}
