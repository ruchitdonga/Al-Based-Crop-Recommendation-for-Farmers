import React from "react";
import { motion } from "framer-motion";

/**
 * SustainabilityGauge — semi-circle arc gauge with three segments.
 * Props:
 *   rating — "low" | "medium" | "high"
 *   label  — string (optional)
 */

const RATINGS = {
    low: { angle: -60, color: "hsl(0, 72%, 52%)", text: "Low" },
    medium: { angle: 0, color: "hsl(45, 85%, 52%)", text: "Medium" },
    high: { angle: 60, color: "hsl(142, 72%, 48%)", text: "High" },
};

export default function SustainabilityGauge({ rating = "medium", label }) {
    const r = RATINGS[rating] || RATINGS.medium;

    /* SVG arc gauge: 180° arc split into 3 color bands */
    const R = 52;        // radius
    const CX = 60;       // center x
    const CY = 58;       // center y
    const SW = 10;       // stroke width

    /* Helper: point on arc at angle (0° = left, 180° = right) */
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

    /* Needle angle: -60 → low center, 0 → medium center, 60 → high center */
    const needleEnd = pt(90 + r.angle);

    return (
        <div className="gauge">
            {label && <span className="gauge__label">{label}</span>}
            <svg viewBox="0 0 120 68" className="gauge__svg" aria-hidden="true">
                {/* Background arcs */}
                <path d={arc(0, 60)} stroke="hsl(0, 72%, 52%)" strokeWidth={SW} fill="none" opacity={0.25} strokeLinecap="round" />
                <path d={arc(60, 120)} stroke="hsl(45, 85%, 52%)" strokeWidth={SW} fill="none" opacity={0.25} strokeLinecap="round" />
                <path d={arc(120, 180)} stroke="hsl(142, 72%, 48%)" strokeWidth={SW} fill="none" opacity={0.25} strokeLinecap="round" />

                {/* Active arc highlight */}
                {rating === "low" && <path d={arc(0, 60)} stroke="hsl(0, 72%, 52%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}
                {rating === "medium" && <path d={arc(60, 120)} stroke="hsl(45, 85%, 52%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}
                {rating === "high" && <path d={arc(120, 180)} stroke="hsl(142, 72%, 48%)" strokeWidth={SW} fill="none" strokeLinecap="round" />}

                {/* Needle */}
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
