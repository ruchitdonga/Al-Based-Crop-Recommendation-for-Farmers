import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
    const { t } = useLanguage();

    return (
        <div className="loadingContainer">
            <div className="loadingSpinner">
                <motion.div
                    className="loadingSpinner__ring loadingSpinner__ring--outer"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="loadingSpinner__ring loadingSpinner__ring--inner"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="loadingSpinner__center">
                    <span role="img" aria-label="leaf" className="loadingSpinner__icon">🌱</span>
                </div>
            </div>
            <motion.p
                className="loadingText"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                {t('status.calculating') || 'Analyzing optimal crop strategies...'}
            </motion.p>
        </div>
    );
};

export default LoadingSpinner;
