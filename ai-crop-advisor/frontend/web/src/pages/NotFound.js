import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';
import { useLanguage } from "../i18n/LanguageContext";

const NotFound = () => {
    const { t } = useLanguage();

    return (
        <div className="notFound">
            <motion.div
                className="notFound__container glassCard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <span className="notFound__icon" role="img" aria-hidden="true">🌱</span>
                <h1 className="notFound__title">404</h1>
                <h2 className="notFound__subtitle">{t("notfound.subtitle")}</h2>
                <p className="notFound__text">{t("notfound.text")}</p>
                <Link to="/" className="btn btn--primary notFound__btn">
                    {t("notfound.button")} <span aria-hidden="true" className="btn__arrow">→</span>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
