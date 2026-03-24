import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from "../i18n/LanguageContext";

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__brand">
                    <h2 className="footer__logo">{t("footer.brandTitle")}</h2>
                    <p className="footer__tagline">{t("footer.tagline")}</p>
                </div>

                <div className="footer__links">
                    <div className="footer__group">
                        <h3 className="footer__heading">{t("footer.featuresHeading")}</h3>
                        <Link to="/features" className="footer__link">{t("footer.capabilitiesRoadmap")}</Link>
                        <Link to="/predict" className="footer__link">{t("footer.cropPrediction")}</Link>
                        <Link to="/voice" className="footer__link">{t("footer.voiceAssistant")}</Link>
                        <Link to="/how-it-works" className="footer__link">{t("footer.howItWorks")}</Link>
                    </div>

                    <div className="footer__group">
                        <h3 className="footer__heading">{t("footer.supportHeading")}</h3>
                        <Link to="/" className="footer__link">{t("footer.documentation")}</Link>
                        <Link to="/" className="footer__link">{t("footer.contactUs")}</Link>
                        <Link to="/" className="footer__link">{t("footer.privacyPolicy")}</Link>
                    </div>
                </div>
            </div>

            <div className="footer__bottom">
                <p>
                    &copy; {new Date().getFullYear()} {t("footer.brandName")}. {t("footer.allRightsReserved")}
                </p>
                <p className="footer__disclaimer">{t("footer.disclaimer")}</p>
            </div>
        </footer>
    );
};

export default Footer;
