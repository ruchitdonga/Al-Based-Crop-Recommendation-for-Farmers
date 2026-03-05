import React from "react";
import { motion } from "framer-motion";

/**
 * ProfitChart — horizontal bar chart comparing profit of up to 4 crops.
 *
 * Props:
 *   items — [{ crop: string, profit_estimate: number }]
 *   label — string (optional heading)
 */
export default function ProfitChart({ items = [], label }) {
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
                                        background: idx === 0
                                            ? "linear-gradient(90deg, rgba(34,197,94,0.85), rgba(16,185,129,0.85))"
                                            : "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))",
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.12 }}
                                />
                            </div>
                            <span className="profitChart__value">
                                ₹{(item.profit_estimate || 0).toLocaleString("en-IN")}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
