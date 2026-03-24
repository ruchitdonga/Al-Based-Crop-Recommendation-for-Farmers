import React from 'react';
import { motion } from 'framer-motion';
import './Features.css';
import { useLanguage } from "../i18n/LanguageContext";

const Features = () => {
    const { t } = useLanguage();

    return (
        <div className="featuresPage">
            <div className="featuresPage__bg" aria-hidden="true" />
            <div className="featuresPage__overlay" aria-hidden="true" />

            <motion.div
                className="featuresContainer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="featuresHero text-center">
                    <h1 className="featuresHero__title">{t("features.heroTitle")}</h1>
                    <p className="featuresHero__subtitle">{t("features.heroSubtitle")}</p>
                </div>

                <div className="featuresSection">
                    <h2 className="featuresSection__heading">{t("features.currentHeading")}</h2>
                    <div className="featuresGrid">
                        <motion.div
                            className="featureCard glassCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="featureCard__icon" role="img" aria-hidden="true">🧠</span>
                            <h3 className="featureCard__title">{t("features.aiTitle")}</h3>
                            <p className="featureCard__text">{t("features.aiText")}</p>
                        </motion.div>

                        <motion.div
                            className="featureCard glassCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="featureCard__icon" role="img" aria-hidden="true">💰</span>
                            <h3 className="featureCard__title">{t("features.profitTitle")}</h3>
                            <p className="featureCard__text">{t("features.profitText")}</p>
                        </motion.div>

                        <motion.div
                            className="featureCard glassCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="featureCard__icon" role="img" aria-hidden="true">🌍</span>
                            <h3 className="featureCard__title">{t("features.sustTitle")}</h3>
                            <p className="featureCard__text">{t("features.sustText")}</p>
                        </motion.div>

                        <motion.div
                            className="featureCard glassCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="featureCard__icon" role="img" aria-hidden="true">🎙️</span>
                            <h3 className="featureCard__title">{t("features.voiceTitle")}</h3>
                            <p className="featureCard__text">{t("features.voiceText")}</p>
                        </motion.div>
                    </div>
                </div>

                <div className="featuresSection featuresSection--future">
                    <h2 className="featuresSection__heading">{t("features.roadmapHeading")}</h2>
                    <div className="futureTimeline">

                        <motion.div
                            className="futureItem glassCard"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="futureItem__node"></div>
                            <h3 className="futureItem__title">{t("features.roadmap1Title")}</h3>
                            <p className="futureItem__text">{t("features.roadmap1Text")}</p>
                        </motion.div>

                        <motion.div
                            className="futureItem glassCard"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="futureItem__node"></div>
                            <h3 className="futureItem__title">{t("features.roadmap2Title")}</h3>
                            <p className="futureItem__text">{t("features.roadmap2Text")}</p>
                        </motion.div>

                        <motion.div
                            className="futureItem glassCard"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="futureItem__node"></div>
                            <h3 className="futureItem__title">{t("features.roadmap3Title")}</h3>
                            <p className="futureItem__text">{t("features.roadmap3Text")}</p>
                        </motion.div>

                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Features;
