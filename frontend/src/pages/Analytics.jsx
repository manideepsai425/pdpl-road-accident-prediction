import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area, AreaChart
} from "recharts";
import { useAnalytics, useSummary } from "../hooks/useAccidentData";

const GREEN_PALETTE  = ["#22C55E","#16A34A","#4ADE80","#86EFAC","#BBF7D0","#DCFCE7"];
const CHART_PALETTE  = ["#22C55E","#3B82F6","#14B8A6","#EAB308","#EF4444","#8B5CF6"];
const SEV_COLORS     = { Fatal: "#EF4444", Serious: "#EAB308", Minor: "#22C55E" };

const tooltipStyle = {
  contentStyle: {
    background: "#fff", border: "1px solid #E2E8F0",
    borderRadius: 14, fontSize: 13, boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
  },
  itemStyle: { color: "#374151", fontWeight: 600 },
  labelStyle: { color: "#64748B", fontWeight: 500 },
  cursor: { fill: "rgba(34,197,94,0.06)" },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

function ChartCard({ title, subtitle, children, delay, fullWidth = false }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      style={{
        background: "#fff", border: "1px solid #E2E8F0",
        borderRadius: 20, padding: "24px 20px",
        boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A",
          fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{subtitle}</div>}
      </div>
      {children}
    </motion.div>
  );
}

function Shimmer({ height = 200 }) {
  return (
    <div style={{ height, borderRadius: 12 }} className="shimmer-light" />
  );
}

function SummaryBadge({ value, label, color, bg, icon }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(15,23,42,0.1)" }}
      style={{
        background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16,
        padding: "20px 18px", textAlign: "center",
        boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color,
        fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
    </motion.div>
  );
}

export default function Analytics() {
  const { data, loading } = useAnalytics();
  const { data: summary }  = useSummary();

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 60, background: "var(--bg)", overflowY: "auto" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px" }}>

        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 24,
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
            fontSize: 11, color: "#2563EB", letterSpacing: 1, textTransform: "uppercase",
            fontWeight: 700, marginBottom: 14,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", display: "inline-block" }} />
            Peddapalli District Data
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 8,
            fontFamily: "'Bricolage Grotesque', sans-serif", color: "#0F172A" }}>
            Accident Analytics
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7 }}>
            Historical patterns, severity distributions, and trend analysis from Peddapalli district.
          </p>
        </motion.div>

        {/* Summary row */}
        {summary && (
          <motion.div
            {...fadeUp(0.05)}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 14, marginBottom: 32,
            }}
          >
            <SummaryBadge value={summary.total_records}   label="Records"    color="#3B82F6" icon="ðŸ“‹" />
            <SummaryBadge value={summary.total_accidents} label="Accidents"   color="#EAB308" icon="âš ï¸" />
            <SummaryBadge value={summary.fatal_count}     label="Fatal"       color="#EF4444" icon="ðŸ”´" />
            <SummaryBadge value={summary.serious_count}   label="Serious"     color="#CA8A04" icon="ðŸŸ¡" />
            <SummaryBadge value={summary.avg_risk_score}  label="Avg Risk"    color="#22C55E" icon="ðŸ“ˆ" />
            <SummaryBadge value={`${summary.peak_hour}:00`} label="Peak Hour" color="#14B8A6" icon="ðŸ•" />
          </motion.div>
        )}

        {/* Charts grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}>

          {/* Hourly bar */}
          <ChartCard title="Accidents by Hour of Day" subtitle="24-hour distribution" delay={0.1}>
            {loading ? <Shimmer /> : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data.hourly} barSize={12}>
                  <defs>
                    <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#14B8A6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="url(#barGreen)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Severity Pie â€” spinning on load */}
          <ChartCard title="Severity Distribution" subtitle="Fatal Â· Serious Â· Minor" delay={0.15}>
            {loading ? <Shimmer /> : (
              <div className="pie-spin-in">
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie
                      data={data.severity} dataKey="count" nameKey="severity"
                      cx="50%" cy="50%" innerRadius={58} outerRadius={88}
                      paddingAngle={4} isAnimationActive={true}
                    >
                      {data.severity?.map((entry, i) => (
                        <Cell key={i} fill={SEV_COLORS[entry.severity] || CHART_PALETTE[i]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: "#475569", fontWeight: 500 }}
                      iconType="circle" iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          {/* Weather horizontal bar */}
          <ChartCard title="Accidents by Weather" subtitle="Condition correlation" delay={0.2}>
            {loading ? <Shimmer /> : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data.weather} layout="vertical" barSize={14}>
                  <defs>
                    <linearGradient id="barBlue" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#14B8A6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="weather" type="category" width={110}
                    tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="url(#barBlue)" radius={[0,6,6,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Road Type Pie â€” spinning on load */}
          <ChartCard title="Road Type Risk Distribution" subtitle="By road category" delay={0.25}>
            {loading ? <Shimmer /> : (
              <div className="pie-spin-in" style={{ animationDelay: "0.15s" }}>
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie
                      data={data.roadTypes} dataKey="count" nameKey="road_type"
                      cx="50%" cy="50%" innerRadius={42} outerRadius={78}
                      paddingAngle={3} isAnimationActive={true}
                    >
                      {data.roadTypes?.map((_, i) => (
                        <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#475569", fontWeight: 500 }} iconType="circle" iconSize={7} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          {/* Monthly trend â€” full width */}
          <ChartCard title="Monthly Accident Trend" subtitle="2021 â€“ 2023 historical data" delay={0.3} fullWidth>
            {loading ? <Shimmer height={230} /> : (
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={data.monthly}>
                  <defs>
                    <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month_year" tick={{ fill: "#94A3B8", fontSize: 10 }}
                    interval={2} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={2.5}
                    fill="url(#areaGreen)" dot={{ fill: "#22C55E", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#16A34A" }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Collision type â€” full width */}
          <ChartCard title="Collision Type Breakdown" subtitle="By collision category" delay={0.35} fullWidth>
            {loading ? <Shimmer /> : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data.collisions} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="collision_type" tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" radius={[8,8,0,0]}>
                    {data.collisions?.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

        </div>
      </div>
    </div>
  );
}
