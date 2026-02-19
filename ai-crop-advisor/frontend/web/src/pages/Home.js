import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const page = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const heroContainer = {
    hidden: {},
    show: {
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const revealOnScroll = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  return (
    <div className="home">
      <div className="home__bg" aria-hidden="true" />
      <div className="home__overlay" aria-hidden="true" />

      <motion.section className="home__content" initial="hidden" animate="show" variants={page}>
        <div className="home__container">
          <motion.div
            className="glassCard glassCard--hero"
            variants={heroContainer}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.01, boxShadow: "0 34px 86px rgba(0, 0, 0, 0.48)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <motion.p className="badge" variants={fadeUp}>
              {t("home.badge")}
            </motion.p>

            <motion.h1 className="heroTitle" variants={fadeUp}>
              {t("home.title")}
            </motion.h1>

            <motion.p className="heroSubtitle" variants={fadeUp}>
              {t("home.subtitle")}
            </motion.p>

            <motion.div className="heroActions" variants={fadeUp}>
              <motion.button
                className="btn btn--primary"
                onClick={() => navigate("/predict")}
                whileHover={{ scale: 1.04, boxShadow: "0 26px 56px rgba(34, 197, 94, 0.22), 0 14px 28px rgba(0, 0, 0, 0.26)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {t("home.cta")}
                <span className="btn__arrow">→</span>
              </motion.button>

              <motion.a
                className="btn btn--ghost"
                href="#how-it-works"
                whileHover={{ scale: 1.02, boxShadow: "0 18px 38px rgba(0, 0, 0, 0.24)" }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {t("home.howItWorks")}
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            id="how-it-works"
            className="home__below"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.22 }}
            variants={revealOnScroll}
          >
            <motion.div className="miniGrid" variants={revealOnScroll}>
              <motion.div
                className="miniCard"
                variants={fadeUp}
                whileHover={{ y: -2, scale: 1.02, boxShadow: "0 22px 52px rgba(0, 0, 0, 0.34)" }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h3 className="miniCard__title">{t("home.card1.title")}</h3>
                <p className="miniCard__text">{t("home.card1.text")}</p>
              </motion.div>
              <motion.div
                className="miniCard"
                variants={fadeUp}
                whileHover={{ y: -2, scale: 1.02, boxShadow: "0 22px 52px rgba(0, 0, 0, 0.34)" }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h3 className="miniCard__title">{t("home.card2.title")}</h3>
                <p className="miniCard__text">{t("home.card2.text")}</p>
              </motion.div>
              <motion.div
                className="miniCard"
                variants={fadeUp}
                whileHover={{ y: -2, scale: 1.02, boxShadow: "0 22px 52px rgba(0, 0, 0, 0.34)" }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h3 className="miniCard__title">{t("home.card3.title")}</h3>
                <p className="miniCard__text">{t("home.card3.text")}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
