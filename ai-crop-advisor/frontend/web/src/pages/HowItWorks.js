import React from 'react';
import { motion } from 'framer-motion';
import './HowItWorks.css';

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
                    <h1 className="howHero__title">Demystifying the AI</h1>
                    <p className="howHero__subtitle">
                        How does Crop Advisor transform 7 simple numbers into a highly profitable, sustainable farming strategy? Let's look under the hood.
                    </p>
                </motion.div>

                <div className="stepsWrapper">
                    <div className="stepsPath" aria-hidden="true"></div>

                    <StepCard
                        number="01"
                        icon="🧪"
                        title="The Data Input"
                        delay={0.1}
                        description="We collect 4 soil metrics (Nitrogen, Phosphorus, Potassium, pH) and 3 weather metrics (Temperature, Humidity, Rainfall). You can type these manually, or simply speak them into our Multilingual Voice Assistant."
                    />

                    <StepCard
                        number="02"
                        icon="🧠"
                        title="The Machine Learning Engine"
                        delay={0.3}
                        description="Your data is sent to our Python backend, where it is scaled and fed into a trained Random Forest Classifier. This model was trained on historical agricultural datasets to identify complex patterns, resulting in a probability score for the top 3 optimal crops."
                    />

                    <StepCard
                        number="03"
                        icon="⚖️"
                        title="The Decision Engine"
                        delay={0.5}
                        description="The raw ML prediction isn't enough. Our custom Decision Engine cross-references the top crops against our Metadata Table, attaching crucial real-world context like estimated profit margins, ecological sustainability, and risk level."
                    />

                    <StepCard
                        number="04"
                        icon="📊"
                        title="The Actionable Dashboard"
                        delay={0.7}
                        description="Finally, the analyzed data is streamed back to your screen. You receive a professional advisory dashboard comparing your best primary crop against two alternative options, empowering you to make the right choice for your farm."
                    />
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
