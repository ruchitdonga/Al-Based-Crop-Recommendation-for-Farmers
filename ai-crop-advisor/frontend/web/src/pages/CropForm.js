import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { apiPost } from "../api";

function CropForm() {
  // Stores all form fields in a single object.
  const [formData, setFormData] = useState({
    location: "",
    ph: "",
    last_crop: "",
  });

  // UI state for submit lifecycle.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Keep a ref to the active timeout so we can clean up on unmount.
  const loadingTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const fields = useMemo(
    () => [
      { name: "location", label: "Location", placeholder: "e.g. Pune", type: "text" },
      { name: "ph", label: "Soil pH", placeholder: "e.g. 6.8", type: "number", step: "0.1" },
      { name: "last_crop", label: "Last crop", placeholder: "e.g. Rice", type: "text" },
    ],
    []
  );

  // Generic change handler for all inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Basic validation: if pH is provided, it must be a valid number.
  const validate = () => {
    const phRaw = String(formData.ph).trim();
    if (phRaw === "") return { ok: true, message: "" };

    const phVal = Number(phRaw);
    if (!Number.isFinite(phVal)) {
      return { ok: false, message: "Please enter a valid number for Soil pH." };
    }

    return { ok: true, message: "" };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent double submits while loading.
    if (isLoading) return;

    const validation = validate();
    if (!validation.ok) {
      setError(validation.message);
      setResult(null);
      return;
    }

    setError("");
    setResult(null);
    setIsLoading(true);

    // API call: POST /api/recommend/
    loadingTimerRef.current = setTimeout(async () => {
      try {
        const payload = {};

        const location = String(formData.location).trim();
        if (location) payload.location = location;

        const lastCrop = String(formData.last_crop).trim();
        if (lastCrop) payload.last_crop = lastCrop;

        const phRaw = String(formData.ph).trim();
        if (phRaw) {
          payload.soil = { ph: Number(phRaw) };
        }

        payload.lang = "en";

        const res = await apiPost("/recommend/", payload);
        if (!res.ok) {
          setError("Backend unavailable");
          setResult(null);
          return;
        }

        setResult(res.data ?? null);
      } catch {
        setError("Backend unavailable");
        setResult(null);
      } finally {
        setIsLoading(false);
        loadingTimerRef.current = null;
      }
    }, 0);
  };

  const content = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const formStagger = {
    hidden: {},
    show: {
      transition: { when: "beforeChildren", staggerChildren: 0.075, delayChildren: 0.14 },
    },
  };

  return (
    <div className="formPage">
      <div className="formPage__bg" aria-hidden="true" />
      <div className="formPage__overlay" aria-hidden="true" />

      <motion.div
        className="formCard"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <motion.div variants={content} initial="hidden" animate="show">
          <motion.h2 className="formTitle" variants={fadeUp}>
            Crop Recommendation
          </motion.h2>
          <motion.p className="formSubtitle" variants={fadeUp}>
            Fill in your soil and climate values.
          </motion.p>

          <motion.form
            className="formGrid"
            onSubmit={handleSubmit}
            variants={formStagger}
            initial="hidden"
            animate="show"
          >
            {fields.map((f) => (
              <motion.label key={f.name} className="field" variants={fadeUp}>
                <span className="field__label">{f.label}</span>
                <input
                  className="field__input"
                  name={f.name}
                  type={f.type}
                  step={f.step}
                  value={formData[f.name]}
                  placeholder={f.placeholder}
                  onChange={handleChange}
                  inputMode="decimal"
                  disabled={isLoading}
                />
              </motion.label>
            ))}

            <motion.div className="formActions" variants={fadeUp}>
              <motion.button
                type="submit"
                className="btn btn--primary btn--full"
                whileHover={{ scale: 1.03, boxShadow: "0 26px 56px rgba(34, 197, 94, 0.22), 0 14px 28px rgba(0, 0, 0, 0.26)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Requesting…" : "Get Recommendation"}
                <span className="btn__arrow">→</span>
              </motion.button>
            </motion.div>
          </motion.form>

          {error && (
            <motion.p
              className="formSubtitle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              role="alert"
              aria-live="polite"
              style={{ color: "rgba(255, 214, 214, 0.92)" }}
            >
              {error}
            </motion.p>
          )}

          {result?.recommendation?.crop && (
            <motion.div
              className="resultBox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div>
                <span className="resultBox__label">Recommended Crop</span>
                <div className="resultBox__value">{result.recommendation.crop}</div>

                {(result.recommendation.yield !== undefined || result.recommendation.profit !== undefined) && (
                  <div className="resultMeta">
                    <span>Yield: {result.recommendation.yield ?? "—"}</span>
                    <span>Profit: {result.recommendation.profit ?? "—"}</span>
                  </div>
                )}

                {result.source && <div className="resultMeta">Source: {result.source}</div>}

                {result.explanation && (
                  <div className="resultExplanation">
                    {result.explanation}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CropForm;
