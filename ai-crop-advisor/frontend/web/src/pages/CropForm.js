import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { apiPost } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

function CropForm() {
  const { lang, t } = useLanguage();
  // Stores all form fields in a single object.
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    rainfall: "",
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
      { name: "N", label: t("field.N"), placeholder: t("placeholder.num"), type: "number" },
      { name: "P", label: t("field.P"), placeholder: t("placeholder.num"), type: "number" },
      { name: "K", label: t("field.K"), placeholder: t("placeholder.num"), type: "number" },
      { name: "temperature", label: t("field.temperature"), placeholder: t("placeholder.temp"), type: "number" },
      { name: "humidity", label: t("field.humidity"), placeholder: t("placeholder.humidity"), type: "number" },
      { name: "rainfall", label: t("field.rainfall"), placeholder: t("placeholder.rainfall"), type: "number" },
      { name: "ph", label: t("field.ph"), placeholder: t("placeholder.ph"), type: "number", step: "0.1" },
      { name: "last_crop", label: t("field.last_crop"), placeholder: t("placeholder.last_crop"), type: "text" },
    ],
    [t]
  );

  // Generic change handler for all inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStep = (field) => {
    const stepRaw = field?.step ?? 1;
    const stepNum = Number(stepRaw);
    return Number.isFinite(stepNum) && stepNum > 0 ? stepNum : 1;
  };

  const getDecimals = (field) => {
    const stepRaw = field?.step ?? 1;
    const text = String(stepRaw);
    const idx = text.indexOf(".");
    return idx >= 0 ? Math.max(0, text.length - idx - 1) : 0;
  };

  const stepNumberField = (field, direction) => {
    const step = getStep(field);
    const decimals = getDecimals(field);
    const factor = 10 ** decimals;

    setFormData((prev) => {
      const raw = String(prev[field.name] ?? "").trim();
      const current = Number(raw);

      if (!Number.isFinite(current)) {
        const nextInit = direction > 0 ? step : 0;
        return {
          ...prev,
          [field.name]: decimals > 0 ? nextInit.toFixed(decimals) : String(nextInit),
        };
      }

      const next = (Math.round(current * factor) + Math.round(step * factor) * direction) / factor;
      return {
        ...prev,
        [field.name]: decimals > 0 ? next.toFixed(decimals) : String(next),
      };
    });
  };

  // Validation: backend requires full soil/climate numeric input.
  const validate = () => {
    const requiredNumeric = ["N", "P", "K", "temperature", "humidity", "rainfall", "ph"];

    for (const key of requiredNumeric) {
      const raw = String(formData[key]).trim();
      if (raw === "") {
        return { ok: false, message: t("form.validation.required") };
      }
      const num = Number(raw);
      if (!Number.isFinite(num)) {
        return { ok: false, message: t("form.validation.number") };
      }
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
        const payload = {
          soil: {
            N: Number(String(formData.N).trim()),
            P: Number(String(formData.P).trim()),
            K: Number(String(formData.K).trim()),
            ph: Number(String(formData.ph).trim()),
          },
          climate: {
            temperature: Number(String(formData.temperature).trim()),
            humidity: Number(String(formData.humidity).trim()),
            rainfall: Number(String(formData.rainfall).trim()),
          },
          lang,
        };

        const lastCrop = String(formData.last_crop).trim();
        if (lastCrop) payload.last_crop = lastCrop;

        const res = await apiPost("/recommend/", payload);
        if (!res.ok) {
          if (res.status === 400 && res.data) {
            setError(t("form.error.invalid"));
          } else {
            setError(t("form.error.backend"));
          }
          setResult(null);
          return;
        }

        setResult(res.data ?? null);
      } catch {
        setError(t("form.error.backend"));
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
            {t("form.title")}
          </motion.h2>
          <motion.p className="formSubtitle" variants={fadeUp}>
            {t("form.subtitle")}
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
                {f.type === "number" ? (
                  <div className="field__inputWrap">
                    <input
                      className="field__input field__input--number"
                      name={f.name}
                      type="number"
                      step={f.step}
                      value={formData[f.name]}
                      placeholder={f.placeholder}
                      onChange={handleChange}
                      inputMode="decimal"
                      disabled={isLoading}
                    />
                    <div className="field__stepper" aria-hidden={isLoading ? "true" : "false"}>
                      <button
                        type="button"
                        className="field__stepBtn"
                        onClick={() => stepNumberField(f, +1)}
                        disabled={isLoading}
                        aria-label={`${t("input.stepUp")}: ${f.label}`}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="field__stepBtn"
                        onClick={() => stepNumberField(f, -1)}
                        disabled={isLoading}
                        aria-label={`${t("input.stepDown")}: ${f.label}`}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    className="field__input"
                    name={f.name}
                    type={f.type}
                    value={formData[f.name]}
                    placeholder={f.placeholder}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                )}
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
                {isLoading ? t("form.loading") : t("form.submit")}
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
                <span className="resultBox__label">{t("result.recommended")}</span>
                <div className="resultBox__value">{result.recommendation.crop}</div>

                {(result.recommendation.yield !== undefined || result.recommendation.profit !== undefined) && (
                  <div className="resultMeta">
                    <span>Yield: {result.recommendation.yield ?? "—"}</span>
                    <span>Profit: {result.recommendation.profit ?? "—"}</span>
                  </div>
                )}

                {result.source && (
                  <div className="resultMeta">
                    {t("result.source")}: {result.source}
                  </div>
                )}

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
