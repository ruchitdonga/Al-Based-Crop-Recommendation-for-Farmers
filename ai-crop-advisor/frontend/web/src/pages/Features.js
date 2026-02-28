import React from 'react';
import { motion } from 'framer-motion';
import './Features.css';

const Features = () => {
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
                    <h1 className="featuresHero__title">The Future of Smart Farming</h1>
                    <p className="featuresHero__subtitle">
                        Powered by advanced Machine Learning, Crop Advisor translates raw soil and weather data into profitable, sustainable agriculture.
                    </p>
                </div>

                <div className="featuresSection">
                    <h2 className="featuresSection__heading">Current Capabilities</h2>
                    <div className="featuresGrid">
                        <motion.div
                            className="featureCard glassCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="featureCard__icon" role="img" aria-label="brain">🧠</span>
                            <h3 className="featureCard__title">AI Predictions</h3>
                            <p className="featureCard__text">
                                An advanced Random Forest ensemble model trained on vast agricultural datasets to predict the optimal crop with high statistical confidence.
                            </p>
                        </motion.div>

                        <motion.div
                            className="featureCard glassCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="featureCard__icon" role="img" aria-label="money">💰</span>
                            <h3 className="featureCard__title">Profit Estimation</h3>
                            <p className="featureCard__text">
                                Compare potential yields and market values. Our decision engine enriches ML predictions with expected profit per hectare to maximize your ROI.
                            </p>
                        </motion.div>

                        <motion.div
                            className="featureCard glassCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="featureCard__icon" role="img" aria-label="earth">🌍</span>
                            <h3 className="featureCard__title">Sustainability Metrics</h3>
                            <p className="featureCard__text">
                                Farm for the future. We evaluate the ecological impact of growing specific crops, categorizing them by water usage and soil nutrient depletion.
                            </p>
                        </motion.div>

                        <motion.div
                            className="featureCard glassCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="featureCard__icon" role="img" aria-label="microphone">🎙️</span>
                            <h3 className="featureCard__title">Multilingual Voice AI</h3>
                            <p className="featureCard__text">
                                Speak naturally to our AI Assistant in English, Hindi, Marathi, or Gujarati to get instant farming advice tailored to your region.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="featuresSection featuresSection--future">
                    <h2 className="featuresSection__heading">Roadmap & Future Vision</h2>
                    <div className="futureTimeline">

                        <motion.div
                            className="futureItem glassCard"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="futureItem__node"></div>
                            <h3 className="futureItem__title">Multi-Objective Optimization</h3>
                            <p className="futureItem__text">
                                Moving beyond single predictions to suggest crop rotations that perfectly balance short-term profit with long-term soil health sustainability.
                            </p>
                        </motion.div>

                        <motion.div
                            className="futureItem glassCard"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="futureItem__node"></div>
                            <h3 className="futureItem__title">Live Market Integration</h3>
                            <p className="futureItem__text">
                                Connecting our decision engine to real-time `mandi` (market) APIs to adjust profit estimates dynamically based on current local crop prices.
                            </p>
                        </motion.div>

                        <motion.div
                            className="futureItem glassCard"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="futureItem__node"></div>
                            <h3 className="futureItem__title">Satellite Weather Link</h3>
                            <p className="futureItem__text">
                                Replacing manual temperature and rainfall inputs with automated, hyper-local weather fetching based on the farmer's GPS coordinates.
                            </p>
                        </motion.div>

                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Features;
