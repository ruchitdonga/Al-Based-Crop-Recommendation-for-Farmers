import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__brand">
                    <h2 className="footer__logo">🌾 AI Crop Advisor</h2>
                    <p className="footer__tagline">Empowering farmers with intelligent, data-driven decisions for a sustainable future.</p>
                </div>

                <div className="footer__links">
                    <div className="footer__group">
                        <h3 className="footer__heading">Features</h3>
                        <Link to="/features" className="footer__link">Capabilities & Roadmap</Link>
                        <Link to="/predict" className="footer__link">Crop Prediction</Link>
                        <Link to="/voice" className="footer__link">Voice Assistant</Link>
                        <Link to="/how-it-works" className="footer__link">How it Works</Link>
                    </div>

                    <div className="footer__group">
                        <h3 className="footer__heading">Support</h3>
                        <Link to="/" className="footer__link">Documentation</Link>
                        <Link to="/" className="footer__link">Contact Us</Link>
                        <Link to="/" className="footer__link">Privacy Policy</Link>
                    </div>
                </div>
            </div>

            <div className="footer__bottom">
                <p>&copy; {new Date().getFullYear()} AI Crop Advisor. All rights reserved.</p>
                <p className="footer__disclaimer">Recommendations are based on historical data and AI models. Always consult local experts.</p>
            </div>
        </footer>
    );
};

export default Footer;
