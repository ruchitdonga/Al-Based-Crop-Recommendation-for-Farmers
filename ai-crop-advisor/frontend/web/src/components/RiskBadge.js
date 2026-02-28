import React from "react";
import { motion } from "framer-motion";

/**
 * RiskBadge — colored pill indicating risk level.
 * Props:
 *   level — "low" | "medium" | "high"
 */

const LEVELS = {
    low: { bg: "rgba(34,197,94,0.16)", border: "rgba(34,197,94,0.36)", color: "rgba(180,255,210,0.95)", text: "Low Risk" },
    medium: { bg: "rgba(245,158,11,0.16)", border: "rgba(245,158,11,0.36)", color: "rgba(255,230,180,0.95)", text: "Medium Risk" },
    high: { bg: "rgba(239,68,68,0.16)", border: "rgba(239,68,68,0.36)", color: "rgba(255,200,200,0.95)", text: "High Risk" },
};

export default function RiskBadge({ level = "medium" }) {
    const l = LEVELS[level] || LEVELS.medium;

    return (
        <motion.span
            className="riskBadge"
            style={{
                background: l.bg,
                borderColor: l.border,
                color: l.color,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            {l.text}
        </motion.span>
    );
}
