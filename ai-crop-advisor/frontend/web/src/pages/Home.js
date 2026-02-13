import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <div className="home">
      <div className="home__bg" aria-hidden="true" />
      <div className="home__overlay" aria-hidden="true" />

      <motion.section className="home__content" initial="hidden" animate="show" variants={container}>
        <motion.div
          className="glassCard"
          variants={item}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <motion.p className="badge" variants={item}>
            AI-powered • Weather-aware • Soil-smart
          </motion.p>

          <motion.h1 className="heroTitle" variants={item}>
            Grow smarter with AI crop recommendations.
          </motion.h1>

          <motion.p className="heroSubtitle" variants={item}>
            Enter your soil and climate details and get a crop suggestion optimized for yield and
            sustainability.
          </motion.p>

          <motion.div className="heroActions" variants={item}>
            <motion.button
              className="btn btn--primary"
              onClick={() => navigate("/predict")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Get Recommendation
              <span className="btn__arrow">→</span>
            </motion.button>

            <motion.a
              className="btn btn--ghost"
              href="#how-it-works"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              How it works
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div id="how-it-works" className="home__below" variants={item}>
          <div className="miniGrid">
            <div className="miniCard">
              <h3>Soil nutrients</h3>
              <p>N, P, K, pH and rainfall inputs.</p>
            </div>
            <div className="miniCard">
              <h3>Climate signals</h3>
              <p>Temperature and humidity trends.</p>
            </div>
            <div className="miniCard">
              <h3>Actionable output</h3>
              <p>A clear crop recommendation.</p>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default Home;
