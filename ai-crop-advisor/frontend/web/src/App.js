import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import "./App.css";
import Navbar from "./components/Navbar";
import TruckAnimation from "./components/TruckAnimation";
import Home from "./pages/Home";
import CropForm from "./pages/CropForm";
import { apiGet } from "./api";
import { useLanguage } from "./i18n/LanguageContext";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="app-page"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<CropForm />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const { t } = useLanguage();
  const [backendStatus, setBackendStatus] = useState({
    state: "checking",
    message: t("status.checking"),
  });

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await apiGet("/health/");
        const status = res?.data?.status;

        if (cancelled) return;

        if (!res.ok) {
          setBackendStatus({
            state: "down",
            message: t("status.down"),
          });
          return;
        }

        if (status && status !== "ok") {
          setBackendStatus({
            state: "degraded",
            message: t("status.degraded"),
          });
          return;
        }

        setBackendStatus({ state: "ok", message: "" });
      } catch {
        if (cancelled) return;
        setBackendStatus({
          state: "down",
          message: t("status.down"),
        });
      }
    };

    check();
    const intervalId = setInterval(check, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [t]);

  return (
    <Router>
      <Navbar />
      <TruckAnimation />
      {backendStatus.state === "down" && (
        <div className="statusBanner" role="status" aria-live="polite">
          {backendStatus.message}
        </div>
      )}
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
