import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { LANGS } from "../i18n/translations";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { lang, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLinkClass = (path) => {
    return location.pathname === path ? "navLink navLink--active" : "navLink";
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navLogo" onClick={closeMenu}>
          <img src={logo} alt="AI Crop Advisor Logo" className="navLogo__img" />
          {t("nav.cropAdvisor")}
        </Link>

        <button
          className={`mobileMenuBtn ${isMobileMenuOpen ? 'mobileMenuBtn--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={t("nav.toggleNavigation")}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navLinks ${isMobileMenuOpen ? 'navLinks--open' : ''}`}>
          <Link to="/features" className={getLinkClass("/features")} onClick={closeMenu}>
            {t("nav.features")}
          </Link>
          <Link to="/how-it-works" className={getLinkClass("/how-it-works")} onClick={closeMenu}>
            {t("nav.howItWorks")}
          </Link>
          <Link to="/predict" className={getLinkClass("/predict")} onClick={closeMenu}>
            {t("nav.cropAdvisor")}
          </Link>
          <Link to="/voice" className={getLinkClass("/voice")} onClick={closeMenu}>
            {t("nav.voiceChat")}
          </Link>

          <div className="langPicker" ref={langMenuRef}>
            <button
              className={`langPicker__btn ${isLangMenuOpen ? 'langPicker__btn--active' : ''}`}
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              aria-expanded={isLangMenuOpen}
              aria-label={t("nav.selectLanguage") || "Select Language"}
            >
              {LANGS.find(l => l.value === lang)?.label || "English"}
            </button>

            {isLangMenuOpen && (
              <ul className="langPicker__menu">
                {LANGS.map((l) => (
                  <li key={l.value}>
                    <button
                      className={`langPicker__option ${lang === l.value ? 'langPicker__option--selected' : ''}`}
                      onClick={() => {
                        setLanguage(l.value);
                        setIsLangMenuOpen(false);
                        closeMenu();
                      }}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
