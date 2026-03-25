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

function formatNumber(value, numberLocale, options) {
    const n = toFiniteNumber(value);
    if (n === null) return "—";
    return n.toLocaleString(numberLocale, options);
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

    const analytics = result.analytics || {};
    const pestAlerts = Array.isArray(analytics.pest_alerts) ? analytics.pest_alerts : [];

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
                    {rec.risk ? <RiskBadge level={rec.risk} /> : null}
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

                {/* Estimated Yield */}
                <div className="dashboard__metricCard">
                    <span className="dashboard__metricLabel">{t("dashboard.yield")}</span>
                    <span className="dashboard__profitValue">
                        {formatNumber(rec.estimated_yield, numberLocale, { maximumFractionDigits: 2 })}
                        <span className="dashboard__profitUnit"> {t("dashboard.tonnes")}</span>
                    </span>
                </div>

                {/* Profit */}
                <div className="dashboard__metricCard dashboard__metricCard--profit">
                    <span className="dashboard__metricLabel">{t("dashboard.profit")}</span>
                    <span className="dashboard__profitValue">
                        {formatInr(rec.profit_estimate, numberLocale)}
                    </span>
                </div>
            </motion.div>

            {/* ── Financial Breakdown ─────── */}
            {rec.financials && (
                <motion.div className="dashboard__alts" variants={fadeUp}>
                    <span className="dashboard__altsTitle">{t("dashboard.financials")}</span>
                    <div className="dashboard__altGrid">
                        <div className="dashboard__altCard">
                            <span className="dashboard__metricLabel">{t("dashboard.revenue")}</span>
                            <div className="dashboard__altCrop">{formatInr(rec.financials.gross_revenue_inr, numberLocale)}</div>
                        </div>
                        <div className="dashboard__altCard">
                            <span className="dashboard__metricLabel">{t("dashboard.cost")}</span>
                            <div className="dashboard__altCrop">{formatInr(rec.financials.estimated_cost_inr, numberLocale)}</div>
                        </div>
                        <div className="dashboard__altCard">
                            <span className="dashboard__metricLabel">{t("dashboard.mspUsed")}</span>
                            <div className="dashboard__altCrop">{formatInr(rec.financials.msp_per_quintal_used, numberLocale)}</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── Analytics ───────────────── */}
            {(analytics.kcc_loan || analytics.fertilizer || analytics.irrigation) && (
                <motion.div className="dashboard__alts" variants={fadeUp}>
                    <span className="dashboard__altsTitle">{t("dashboard.analytics")}</span>
                    <div className="dashboard__altGrid">
                        {analytics.kcc_loan && (
                            <div className="dashboard__altCard">
                                <span className="dashboard__metricLabel">{t("dashboard.kccLoan")}</span>
                                <div className="dashboard__altCrop">{formatInr(analytics.kcc_loan.total_first_year_limit_inr, numberLocale)}</div>
                                <div className="dashboard__altMeta">
                                    <span>{t("dashboard.kccScale")}</span>
                                    <span>{formatInr(analytics.kcc_loan.scale_of_finance_per_ha, numberLocale)}</span>
                                </div>
                            </div>
                        )}

                        {analytics.fertilizer && (
                            <div className="dashboard__altCard">
                                <span className="dashboard__metricLabel">{t("dashboard.fertilizer")}</span>
                                <div className="dashboard__altCrop">{formatInr(analytics.fertilizer.estimated_cost_inr, numberLocale)}</div>
                                {analytics.fertilizer.bags_required && (
                                    <div className="dashboard__altMeta" style={{ justifyContent: "flex-start", gap: 12, flexWrap: "wrap" }}>
                                        <span>{t("dashboard.fertilizerBags")}:</span>
                                        <span>
                                            {t("dashboard.urea")} {formatNumber(analytics.fertilizer.bags_required.urea_45kg, numberLocale, { maximumFractionDigits: 1 })}
                                        </span>
                                        <span>
                                            {t("dashboard.dap")} {formatNumber(analytics.fertilizer.bags_required.dap_50kg, numberLocale, { maximumFractionDigits: 1 })}
                                        </span>
                                        <span>
                                            {t("dashboard.mop")} {formatNumber(analytics.fertilizer.bags_required.mop_50kg, numberLocale, { maximumFractionDigits: 1 })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {analytics.irrigation && (
                            <div className="dashboard__altCard">
                                <span className="dashboard__metricLabel">{t("dashboard.irrigation")}</span>
                                <div className="dashboard__altMeta">
                                    <span>{t("dashboard.waterDeficit")}</span>
                                    <span>{formatNumber(analytics.irrigation.deficit_mm, numberLocale, { maximumFractionDigits: 0 })} mm</span>
                                </div>
                                <div className="dashboard__altMeta">
                                    <span>{t("dashboard.extraWater")}</span>
                                    <span>
                                        {formatNumber(analytics.irrigation.extra_liters_required, numberLocale, { maximumFractionDigits: 0 })} {t("dashboard.liters")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ── Pest Alerts ─────────────── */}
            {pestAlerts.length > 0 && (
                <motion.div className="dashboard__explanation" variants={fadeUp}>
                    <span className="dashboard__explanationLabel">{t("dashboard.alerts")}</span>
                    <div className="dashboard__explanationText">
                        {pestAlerts.map((a, idx) => (
                            <p key={idx} style={{ margin: idx === 0 ? 0 : "10px 0 0" }}>{a}</p>
                        ))}
                    </div>
                </motion.div>
            )}

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
                                    {alt.risk !== null && alt.risk !== undefined && `${alt.risk}`.trim() !== "" ? (
                                        <RiskBadge level={alt.risk} />
                                    ) : null}
                                </div>
                                <ConfidenceBar value={alt.confidence} size="sm" />
                                <div className="dashboard__altMeta">
                                    <span>{formatInr(alt.profit_estimate, numberLocale)}</span>
                                    {alt.sustainability !== null && alt.sustainability !== undefined && `${alt.sustainability}`.trim() !== "" ? (
                                        <span className={`dashboard__sustTag dashboard__sustTag--${normalizeTriLevel(alt.sustainability, "medium")}`}>
                                            {(() => {
                                                const normalized = normalizeTriLevel(alt.sustainability, "medium");
                                                const key = `sust.${normalized}`;
                                                const label = t(key);
                                                return label === key ? normalized : label;
                                            })()}
                                        </span>
                                    ) : null}
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

            {/* ── History ─────────────────── */}
            {Array.isArray(result.history) && result.history.length > 0 && (
                <motion.div className="dashboard__alts" variants={fadeUp}>
                    <span className="dashboard__altsTitle">{t("dashboard.history")}</span>
                    <div className="dashboard__altGrid">
                        {result.history.slice(0, 6).map((h) => (
                            <div key={h.timestamp || `${h.crop}-${h.confidence}`} className="dashboard__altCard">
                                <div className="dashboard__altHeader">
                                    <span className="dashboard__altCrop">{translateCropName(t, h.crop)}</span>
                                </div>
                                <ConfidenceBar value={h.confidence} size="sm" />
                                {h.timestamp ? (
                                    <div className="dashboard__altMeta">
                                        <span>{t("dashboard.timestamp")}</span>
                                        <span>{h.timestamp}</span>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
