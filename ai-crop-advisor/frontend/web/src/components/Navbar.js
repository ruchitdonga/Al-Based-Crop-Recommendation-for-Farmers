import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import "../Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
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
            Home
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) => `navlink ${isActive ? "navlink--active" : ""}`}
          >
            Crop Advisor
          </NavLink>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
