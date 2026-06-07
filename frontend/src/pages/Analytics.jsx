import React from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { useAnalytics } from "../hooks/useAccidentData";

const COLORS = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#0A84FF", "#BF5AF2"];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const tooltipStyle = {
  contentStyle: { background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 },
  itemStyle: { color: "#fff" },
  labelStyle: { color: "rgba(255,255,255,0.5)" },
};

function ChartCard({ title, children, delay }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, padding: "24px 20px",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 20, letterSpacing: 0.2 }}>
        {title}
      </div>
      {children}
    </motion.div>
  );
}

function LoadingShimmer() {
  return (
    <div style={{ height: 200, borderRadius: 12, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s infinite" }} />
  );
}

export default function Analytics() {
  const { data, loading } = useAnalytics();

  return (
    <div style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <motion.div {...fadeUp(0)} style={{ marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 20,
            background: "rgba(10,132,255,0.1)", border: "1px solid rgba(10,132,255,0.2)",
            fontSize: 11, color: "#0A84FF", letterSpacing: 1.2,
            textTransform: "uppercase", fontWeight: 600, marginBottom: 16,
          }}>
            <span>●</span> Peddapalli District Data
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 10 }}>
            Accident Analytics
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Historical patterns, severity distributions, and trend analysis — all from Peddapalli synthetic accident data.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <ChartCard title="Accidents by Hour of Day" delay={0.1}>
            {loading ? <LoadingShimmer /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.hourly} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#FF3B30" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Severity Distribution" delay={0.15}>
            {loading ? <LoadingShimmer /> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.severity}
                    dataKey="count"
                    nameKey="severity"
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={3}
                  >
                    {data.severity?.map((_, i) => (
                      <Cell key={i} fill={["#FF3B30","#FF9500","#34C759"][i]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <ChartCard title="Accidents by Weather" delay={0.2}>
            {loading ? <LoadingShimmer /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.weather} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
                  <YAxis dataKey="weather" type="category" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} width={100} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#0A84FF" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Road Type Risk Distribution" delay={0.25}>
            {loading ? <LoadingShimmer /> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.roadTypes}
                    dataKey="count"
                    nameKey="road_type"
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={75}
                    paddingAngle={3}
                  >
                    {data.roadTypes?.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <ChartCard title="Monthly Accident Trend (2021–2023)" delay={0.3}>
          {loading ? <LoadingShimmer /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month_year" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} interval={2} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#FF9500" strokeWidth={2.5} dot={{ fill: "#FF9500", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <motion.div {...fadeUp(0.35)} style={{ marginTop: 20 }}>
          <ChartCard title="Collision Type Breakdown" delay={0.35}>
            {loading ? <LoadingShimmer /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.collisions} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="collision_type" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" radius={[4,4,0,0]}>
                    {data.collisions?.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </motion.div>
      </div>
    </div>
  );
}
