import React from 'react';
import { motion } from 'framer-motion';
import './HowItWorks.css';
import { useLanguage } from "../i18n/LanguageContext";

const StepCard = ({ number, title, description, icon, delay }) => (
    <motion.div
        className="stepCard glassCard"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
        <div className="stepCard__number">{number}</div>
        <div className="stepCard__content">
            <div className="stepCard__header">
                <span className="stepCard__icon" role="img" aria-hidden="true">{icon}</span>
                <h3 className="stepCard__title">{title}</h3>
            </div>
            <p className="stepCard__text">{description}</p>
        </div>
    </motion.div>
);

const HowItWorks = () => {
    const { t } = useLanguage();

    return (
        <div className="howPage">
            <div className="howPage__bg" aria-hidden="true" />
            <div className="howPage__overlay" aria-hidden="true" />

            <div className="howContainer">
                <motion.div
                    className="howHero text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="howHero__title">{t("how.heroTitle")}</h1>
                    <p className="howHero__subtitle">{t("how.heroSubtitle")}</p>
                </motion.div>

                <div className="stepsWrapper">
                    <div className="stepsPath" aria-hidden="true"></div>

                    <StepCard
                        number="01"
                        icon="🧪"
                        title={t("how.step1Title")}
                        delay={0.1}
                        description={t("how.step1Text")}
                    />

                    <StepCard
                        number="02"
                        icon="🧠"
                        title={t("how.step2Title")}
                        delay={0.3}
                        description={t("how.step2Text")}
                    />

                    <StepCard
                        number="03"
                        icon="⚖️"
                        title={t("how.step3Title")}
                        delay={0.5}
                        description={t("how.step3Text")}
                    />

                    <StepCard
                        number="04"
                        icon="📊"
                        title={t("how.step4Title")}
                        delay={0.7}
                        description={t("how.step4Text")}
                    />
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
