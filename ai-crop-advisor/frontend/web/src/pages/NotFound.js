import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="notFound">
            <motion.div
                className="notFound__container glassCard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <span className="notFound__icon" role="img" aria-label="sad seedling">🌱</span>
                <h1 className="notFound__title">404</h1>
                <h2 className="notFound__subtitle">Oops! Wrong Field.</h2>
                <p className="notFound__text">
                    Looks like you've wandered into an unplanted area. The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn--primary notFound__btn">
                    Return to Dashboard <span aria-hidden="true" className="btn__arrow">→</span>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
