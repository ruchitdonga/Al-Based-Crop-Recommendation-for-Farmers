import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "../Navbar.css";
import { useLanguage } from "../i18n/LanguageContext";
import { LANGS } from "../i18n/translations";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
    >
      <div className="navbar__marquee" aria-label="Site banner">
        <div className="navbar__marqueeTrack" aria-hidden="true">
          <span className="navbar__marqueeText">
            <span className="navbar__growPlant" aria-hidden="true">🌱</span>
            Aura farmed by Krish Niyush Ruchit
          </span>
        </div>
      </div>

      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" aria-label="CropAdvisor home">
          <span className="navbar__brandIcon">🌿</span>
          <span className="navbar__brandText">CropAdvisor</span>
        </NavLink>

        <div className="navbar__links" role="navigation" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navlink ${isActive ? "navlink--active" : ""}`}
          >
            {t("nav.home")}
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) => `navlink ${isActive ? "navlink--active" : ""}`}
          >
            {t("nav.cropAdvisor")}
          </NavLink>

          <label className="langPicker" aria-label={t("nav.language")}>
            <select
              className="langPicker__select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
