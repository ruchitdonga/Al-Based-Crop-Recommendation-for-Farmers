import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import ConfidenceBar from "./ConfidenceBar";
import SustainabilityGauge from "./SustainabilityGauge";
import ProfitChart from "./ProfitChart";
import RiskBadge from "./RiskBadge";

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
