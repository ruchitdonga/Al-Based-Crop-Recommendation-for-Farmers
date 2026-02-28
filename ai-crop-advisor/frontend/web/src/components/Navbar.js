import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "../Navbar.css";
import { useLanguage } from "../i18n/LanguageContext";
import { LANGS } from "../i18n/translations";

const Navbar = () => {
  const { lang, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <span role="img" aria-label="leaf" className="navLogo__icon">
            🌿
          </span>
          CropAdvisor
        </Link>

        <button
          className={`mobileMenuBtn ${isMobileMenuOpen ? 'mobileMenuBtn--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navLinks ${isMobileMenuOpen ? 'navLinks--open' : ''}`}>
          <Link to="/features" className={getLinkClass("/features")} onClick={closeMenu}>
            Features
          </Link>
          <Link to="/how-it-works" className={getLinkClass("/how-it-works")} onClick={closeMenu}>
            How it Works
          </Link>
          <Link to="/predict" className={getLinkClass("/predict")} onClick={closeMenu}>
            {t("nav.cropAdvisor")}
          </Link>
          <Link to="/voice" className={getLinkClass("/voice")} onClick={closeMenu}>
            {t("nav.voiceChat")}
          </Link>

          <div className="langPicker">
            <select
              className="langPicker__select"
              value={lang}
              onChange={(e) => {
                setLanguage(e.target.value);
                closeMenu();
              }}
              aria-label="Select Language"
            >    {LANGS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
