import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

const NUMBER_LOCALE_BY_LANG = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
    gu: "gu-IN",
};

function getNumberLocale(lang) {
    return NUMBER_LOCALE_BY_LANG[lang] || "en-IN";
}

function normalizeTriLevel(value, fallback = "medium") {
    const s = (value ?? "").toString().trim().toLowerCase();
    if (s === "low" || s.includes("low")) return "low";
    if (s === "high" || s.includes("high")) return "high";
    if (s === "medium" || s.includes("med")) return "medium";
    return fallback;
}

function cropKeyFromName(name) {
    const key = (name ?? "").toString().trim().toLowerCase().replace(/[^a-z]/g, "");
    return key;
}

function translateCropName(t, cropName) {
    const keyPart = cropKeyFromName(cropName);
    if (!keyPart) return cropName;
    const key = `crop.${keyPart}`;
    const translated = t(key);
    return translated === key ? cropName : translated;
}

function toFiniteNumber(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "string") {
        const cleaned = value.replace(/[^0-9.+-]/g, "");
        if (!cleaned) return null;
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}

function normalizeCropNameForLookup(cropName) {
    return (cropName ?? "").toString().trim().toLowerCase();
}

// Very lightweight heuristic profit estimator (₹/hectare)
// Used only when backend doesn't provide `profit_estimate`.
function estimateProfitPerHectare({ crop, estimatedYield }) {
    const cropKey = normalizeCropNameForLookup(crop);

    // Typical farmgate price estimates (₹/kg)
    const PRICE_PER_KG = {
        rice: 22,
        paddy: 22,
        wheat: 22,
        maize: 18,
        cotton: 70,
        millet: 25,
        barley: 20,
        soybean: 50,
        chickpea: 60,
        lentil: 65,
        groundnut: 55,
        potato: 15,
        tomato: 12,
        onion: 18,
        sugarcane: 3,
    };

    // Typical cost of cultivation (₹/hectare)
    const COST_PER_HA = {
        rice: 50000,
        paddy: 50000,
        wheat: 38000,
        maize: 32000,
        cotton: 65000,
        millet: 28000,
        barley: 30000,
        soybean: 32000,
        chickpea: 30000,
        lentil: 30000,
        groundnut: 45000,
        potato: 70000,
        tomato: 90000,
        onion: 65000,
        sugarcane: 90000,
    };

    // Typical yields (kg/hectare) used only when ML doesn't return yield
    const TYPICAL_YIELD_KG_PER_HA = {
        rice: 4000,
        paddy: 4000,
        wheat: 3500,
        maize: 3000,
        cotton: 1500,
        millet: 2200,
        barley: 2800,
        soybean: 2500,
        chickpea: 1200,
        lentil: 1100,
        groundnut: 2000,
        potato: 25000,
        tomato: 25000,
        onion: 20000,
        sugarcane: 70000,
    };

    const pricePerKg = PRICE_PER_KG[cropKey] ?? 25;
    const costPerHa = COST_PER_HA[cropKey] ?? 40000;

    const yieldValue = toFiniteNumber(estimatedYield);
    let yieldKgPerHa;
    if (yieldValue !== null) {
        // Heuristic: most crop yields are either tonnes/ha (<200) or kg/ha (>=200)
        yieldKgPerHa = yieldValue >= 200 ? yieldValue : yieldValue * 1000;
    } else {
        yieldKgPerHa = TYPICAL_YIELD_KG_PER_HA[cropKey] ?? 3000;
    }

    const revenue = yieldKgPerHa * pricePerKg;
    const profit = revenue - costPerHa;
    // Don't show negative profits as a huge negative number in UI
    return Math.max(0, Math.round(profit));
}

function getProfitEstimate(item) {
    if (!item) return null;

    // Preferred backend contract (new): recommendation.financials.net_profit_inr
    const nestedFinancials =
        toFiniteNumber(item.financials?.net_profit_inr) ??
        toFiniteNumber(item.financials?.netProfitInr) ??
        toFiniteNumber(item.financials?.net_profit) ??
        toFiniteNumber(item.financials?.netProfit);

    if (nestedFinancials !== null) return nestedFinancials;

    // Accept multiple possible backend field names
    const direct =
        toFiniteNumber(item.profit_estimate) ??
        toFiniteNumber(item.net_profit_inr) ??
        toFiniteNumber(item.netProfitInr) ??
        toFiniteNumber(item.estimated_profit) ??
        toFiniteNumber(item.profit) ??
        toFiniteNumber(item.profit_per_hectare) ??
        toFiniteNumber(item.profitPerHectare) ??
        toFiniteNumber(item.profitEstimate);

    if (direct !== null) return direct;

    return estimateProfitPerHectare({
        crop: item.crop,
        estimatedYield: item.estimated_yield ?? item.estimatedYield,
    });
}

function formatInr(value, numberLocale) {
    const n = toFiniteNumber(value);
    if (n === null) return "—";
    return `₹${Math.round(n).toLocaleString(numberLocale)}`;
}

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
    low: { bg: "rgba(34,197,94,0.16)", border: "rgba(34,197,94,0.36)", color: "rgba(180,255,210,0.95)" },
    medium: { bg: "rgba(245,158,11,0.16)", border: "rgba(245,158,11,0.36)", color: "rgba(255,230,180,0.95)" },
    high: { bg: "rgba(239,68,68,0.16)", border: "rgba(239,68,68,0.36)", color: "rgba(255,200,200,0.95)" },
};

function RiskBadge({ level = "medium" }) {
    const { t } = useLanguage();
    const normalized = normalizeTriLevel(level, "medium");
    const l = RISK_LEVELS[normalized] || RISK_LEVELS.medium;
    const labelKey = `risk.${normalized}`;
    const label = t(labelKey);

    return (
        <motion.span
            className="riskBadge"
            style={{ background: l.bg, borderColor: l.border, color: l.color }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            {label === labelKey ? normalized : label}
        </motion.span>
    );
}

function ProfitChart({ items = [], label }) {
    const { lang, t } = useLanguage();
    const numberLocale = getNumberLocale(lang);

    if (!items.length) return null;
    const profits = items
        .map((i) => toFiniteNumber(i.profit_estimate))
        .filter((n) => n !== null);
    if (!profits.length) return null;
    const max = Math.max(...profits, 1);

    return (
        <div className="profitChart">
            {label && <span className="profitChart__label">{label}</span>}
            <div className="profitChart__bars">
                {items.map((item, idx) => {
                    const profit = toFiniteNumber(item.profit_estimate) ?? 0;
                    const pct = Math.round((profit / max) * 100);
                    return (
                        <div key={item.crop} className="profitChart__row">
                            <span className="profitChart__crop">{translateCropName(t, item.crop)}</span>
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
                            <span className="profitChart__value">{formatInr(profit, numberLocale)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const SUST_RATINGS = {
    low: { angle: -60, color: "hsl(0, 72%, 52%)" },
    medium: { angle: 0, color: "hsl(45, 85%, 52%)" },
    high: { angle: 60, color: "hsl(142, 72%, 48%)" },
};

function SustainabilityGauge({ rating = "medium", label }) {
    const { t } = useLanguage();
    const normalized = normalizeTriLevel(rating, "medium");
    const r = SUST_RATINGS[normalized] || SUST_RATINGS.medium;
    const valueKey = `sust.${normalized}`;
    const valueLabel = t(valueKey);

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

                {normalized === "low" && <path d={arc(0, 60)} stroke="hsl(0, 72%, 52%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}
                {normalized === "medium" && <path d={arc(60, 120)} stroke="hsl(45, 85%, 52%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}
                {normalized === "high" && <path d={arc(120, 180)} stroke="hsl(142, 72%, 48%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}

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
            <div className="gauge__value" style={{ color: r.color }}>
                {valueLabel === valueKey ? normalized : valueLabel}
            </div>
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
    const { lang, t } = useLanguage();
    const numberLocale = getNumberLocale(lang);

    if (!result?.recommendation?.crop) return null;

    const recRaw = result.recommendation;
    const altsRaw = result.alternatives || [];

    const rec = {
        ...recRaw,
        profit_estimate: getProfitEstimate(recRaw),
    };
    const alts = altsRaw.map((alt) => ({
        ...alt,
        profit_estimate: getProfitEstimate(alt),
    }));

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
                <h2 className="dashboard__cropName">{translateCropName(t, rec.crop)}</h2>
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
                        {formatInr(rec.profit_estimate, numberLocale)}
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
                                    <span className="dashboard__altCrop">{translateCropName(t, alt.crop)}</span>
                                    <RiskBadge level={alt.risk} />
                                </div>
                                <ConfidenceBar value={alt.confidence} size="sm" />
                                <div className="dashboard__altMeta">
                                    <span>{formatInr(alt.profit_estimate, numberLocale)}</span>
                                    <span className={`dashboard__sustTag dashboard__sustTag--${normalizeTriLevel(alt.sustainability, "medium")}`}>
                                        {(() => {
                                            const normalized = normalizeTriLevel(alt.sustainability, "medium");
                                            const key = `sust.${normalized}`;
                                            const label = t(key);
                                            return label === key ? normalized : label;
                                        })()}
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
