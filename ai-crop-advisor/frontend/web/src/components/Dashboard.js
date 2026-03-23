import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

function ConfidenceBar({ value = 0, label, size = "lg" }) {
    const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
    const hue = value >= 0.7 ? 142 : value >= 0.4 ? 45 : 0;
    const fillColor = `hsl(${hue}, 72%, 52%)`;

    return (
        <div className={`confBar confBar--${size}`}>
            {label && <span className="confBar__label">{label}</span>}
            <div className="confBar__track">
                <motion.div
                    className="confBar__fill"
                    style={{ background: fillColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <span className="confBar__pct">{pct}%</span>
            </div>
        </div>
    );
}

const RISK_LEVELS = {
    low: { bg: "rgba(34,197,94,0.16)", border: "rgba(34,197,94,0.36)", color: "rgba(180,255,210,0.95)", text: "Low Risk" },
    medium: { bg: "rgba(245,158,11,0.16)", border: "rgba(245,158,11,0.36)", color: "rgba(255,230,180,0.95)", text: "Medium Risk" },
    high: { bg: "rgba(239,68,68,0.16)", border: "rgba(239,68,68,0.36)", color: "rgba(255,200,200,0.95)", text: "High Risk" },
};

function RiskBadge({ level = "medium" }) {
    const l = RISK_LEVELS[level] || RISK_LEVELS.medium;

    return (
        <motion.span
            className="riskBadge"
            style={{ background: l.bg, borderColor: l.border, color: l.color }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            {l.text}
        </motion.span>
    );
}

function ProfitChart({ items = [], label }) {
    if (!items.length) return null;
    const max = Math.max(...items.map((i) => i.profit_estimate || 0), 1);

    return (
        <div className="profitChart">
            {label && <span className="profitChart__label">{label}</span>}
            <div className="profitChart__bars">
                {items.map((item, idx) => {
                    const pct = Math.round(((item.profit_estimate || 0) / max) * 100);
                    return (
                        <div key={item.crop} className="profitChart__row">
                            <span className="profitChart__crop">{item.crop}</span>
                            <div className="profitChart__track">
                                <motion.div
                                    className="profitChart__fill"
                                    style={{
                                        background:
                                            idx === 0
                                                ? "linear-gradient(90deg, rgba(34,197,94,0.85), rgba(16,185,129,0.85))"
                                                : "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))",
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.12 }}
                                />
                            </div>
                            <span className="profitChart__value">₹{(item.profit_estimate || 0).toLocaleString("en-IN")}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const SUST_RATINGS = {
    low: { angle: -60, color: "hsl(0, 72%, 52%)", text: "Low" },
    medium: { angle: 0, color: "hsl(45, 85%, 52%)", text: "Medium" },
    high: { angle: 60, color: "hsl(142, 72%, 48%)", text: "High" },
};

function SustainabilityGauge({ rating = "medium", label }) {
    const r = SUST_RATINGS[rating] || SUST_RATINGS.medium;

    const R = 52;
    const CX = 60;
    const CY = 58;
    const SW = 10;

    const pt = (deg) => {
        const rad = (Math.PI * deg) / 180;
        return { x: CX + R * Math.cos(Math.PI - rad), y: CY - R * Math.sin(Math.PI - rad) };
    };

    const arc = (startDeg, endDeg) => {
        const s = pt(startDeg);
        const e = pt(endDeg);
        const large = endDeg - startDeg > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
    };

    const needleEnd = pt(90 + r.angle);

    return (
        <div className="gauge">
            {label && <span className="gauge__label">{label}</span>}
            <svg viewBox="0 0 120 68" className="gauge__svg" aria-hidden="true">
                <path d={arc(0, 60)} stroke="hsl(0, 72%, 52%)" strokeWidth={SW} fill="none" opacity={0.25} strokeLinecap="round" />
                <path d={arc(60, 120)} stroke="hsl(45, 85%, 52%)" strokeWidth={SW} fill="none" opacity={0.25} strokeLinecap="round" />
                <path d={arc(120, 180)} stroke="hsl(142, 72%, 48%)" strokeWidth={SW} fill="none" opacity={0.25} strokeLinecap="round" />

                {rating === "low" && <path d={arc(0, 60)} stroke="hsl(0, 72%, 52%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}
                {rating === "medium" && <path d={arc(60, 120)} stroke="hsl(45, 85%, 52%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}
                {rating === "high" && <path d={arc(120, 180)} stroke="hsl(142, 72%, 48%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}

                <motion.line
                    x1={CX} y1={CY}
                    x2={needleEnd.x} y2={needleEnd.y}
                    stroke={r.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
                <circle cx={CX} cy={CY} r={3.5} fill={r.color} />
            </svg>
            <div className="gauge__value" style={{ color: r.color }}>{r.text}</div>
        </div>
    );
}

/**
 * Dashboard — professional advisory view shown after a recommendation.
 *
 * Props:
 *   result — full API response from /api/recommend/
 */
export default function Dashboard({ result }) {
    const { t } = useLanguage();

    if (!result?.recommendation?.crop) return null;

    const rec = result.recommendation;
    const alts = result.alternatives || [];

    /* Merge primary + alternatives for the profit chart */
    const allCrops = [
        { crop: rec.crop, profit_estimate: rec.profit_estimate, confidence: rec.confidence },
        ...alts,
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { when: "beforeChildren", staggerChildren: 0.1, delayChildren: 0.05 },
        },
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
    };

    return (
        <motion.div
            className="dashboard"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* ── Hero Card ─────────────────── */}
            <motion.div className="dashboard__hero" variants={fadeUp}>
                <span className="dashboard__heroLabel">{t("dashboard.recommended")}</span>
                <h2 className="dashboard__cropName">{rec.crop}</h2>
                <div className="dashboard__heroBadges">
                    <RiskBadge level={rec.risk} />
                    {result.source && (
                        <span className="dashboard__srcBadge">{result.source}</span>
                    )}
                </div>
            </motion.div>

            {/* ── Metrics Row ───────────────── */}
            <motion.div className="dashboard__metrics" variants={fadeUp}>
                {/* Confidence */}
                <div className="dashboard__metricCard">
                    <ConfidenceBar
                        value={rec.confidence}
                        label={t("dashboard.confidence")}
                        size="lg"
                    />
                </div>

                {/* Sustainability */}
                <div className="dashboard__metricCard">
                    <SustainabilityGauge
                        rating={rec.sustainability}
                        label={t("dashboard.sustainability")}
                    />
                </div>

                {/* Profit */}
                <div className="dashboard__metricCard dashboard__metricCard--profit">
                    <span className="dashboard__metricLabel">{t("dashboard.profit")}</span>
                    <span className="dashboard__profitValue">
                        ₹{(rec.profit_estimate || 0).toLocaleString("en-IN")}
                        <span className="dashboard__profitUnit"> / {t("dashboard.hectare")}</span>
                    </span>
                </div>
            </motion.div>

            {/* ── Profit Comparison Chart ──── */}
            {allCrops.length > 1 && (
                <motion.div variants={fadeUp}>
                    <ProfitChart
                        items={allCrops}
                        label={t("dashboard.profitComparison")}
                    />
                </motion.div>
            )}

            {/* ── Alternative Crops ────────── */}
            {alts.length > 0 && (
                <motion.div className="dashboard__alts" variants={fadeUp}>
                    <span className="dashboard__altsTitle">{t("dashboard.alternatives")}</span>
                    <div className="dashboard__altGrid">
                        {alts.map((alt) => (
                            <motion.div
                                key={alt.crop}
                                className="dashboard__altCard"
                                whileHover={{ y: -2, boxShadow: "0 18px 42px rgba(0,0,0,0.32)" }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                            >
                                <div className="dashboard__altHeader">
                                    <span className="dashboard__altCrop">{alt.crop}</span>
                                    <RiskBadge level={alt.risk} />
                                </div>
                                <ConfidenceBar value={alt.confidence} size="sm" />
                                <div className="dashboard__altMeta">
                                    <span>₹{(alt.profit_estimate || 0).toLocaleString("en-IN")}</span>
                                    <span className={`dashboard__sustTag dashboard__sustTag--${alt.sustainability}`}>
                                        {alt.sustainability}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── Explanation ──────────────── */}
            {result.explanation && (
                <motion.div className="dashboard__explanation" variants={fadeUp}>
                    <span className="dashboard__explanationLabel">{t("dashboard.explanation")}</span>
                    <p className="dashboard__explanationText">{result.explanation}</p>
                </motion.div>
            )}
        </motion.div>
    );
}
