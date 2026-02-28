import React from "react";
import { motion } from "framer-motion";

/**
 * ConfidenceBar — animated horizontal bar showing a 0–1 confidence value.
 * Props:
 *   value  — number 0..1
 *   label  — string (optional)
 *   size   — "sm" | "lg"  (default "lg")
 */
export default function ConfidenceBar({ value = 0, label, size = "lg" }) {
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
