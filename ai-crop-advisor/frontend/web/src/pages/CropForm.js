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

  // Voice input state.
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [voiceError, setVoiceError] = useState("");

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const recognizedTextRef = useRef("");

  const SpeechRecognitionCtor = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  const canRecognize = Boolean(SpeechRecognitionCtor);

  // Keep a ref to the active timeout so we can clean up on unmount.
  const loadingTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }

      try {
        recognitionRef.current?.stop?.();
      } catch {
        // no-op
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

  const applyVoiceToForm = (rawText) => {
    const original = String(rawText ?? "").trim();
    if (!original) return;

    // Normalize a bit for common STT output (e.g. "6 point 8").
    const normalized = original
      .toLowerCase()
      .replace(/(\d)\s*point\s*(\d)/g, "$1.$2")
      .replace(/\s+/g, " ")
      .trim();

    const pick = (re) => {
      const m = normalized.match(re);
      return m && m[1] != null ? String(m[1]).trim() : null;
    };

    const updates = {};
    const labeled = {
      N: pick(/(?:\bnitrogen\b|\bn\b)\s*(?:is|=|:)?\s*(-?\d+(?:\.\d+)?)/i),
      P: pick(/(?:\bphosphorus\b|\bp\b)\s*(?:is|=|:)?\s*(-?\d+(?:\.\d+)?)/i),
      K: pick(/(?:\bpotassium\b|\bk\b)\s*(?:is|=|:)?\s*(-?\d+(?:\.\d+)?)/i),
      temperature: pick(/(?:\btemperature\b|\btemp\b)\s*(?:is|=|:)?\s*(-?\d+(?:\.\d+)?)/i),
      humidity: pick(/\bhumidity\b\s*(?:is|=|:)?\s*(-?\d+(?:\.\d+)?)/i),
      rainfall: pick(/(?:\brainfall\b|\brain\b)\s*(?:is|=|:)?\s*(-?\d+(?:\.\d+)?)/i),
      ph: pick(/\bph\b\s*(?:is|=|:)?\s*(-?\d+(?:\.\d+)?)/i),
    };

    const labeledFound = Object.values(labeled).some((v) => v != null && v !== "");
    if (labeledFound) {
      for (const [key, value] of Object.entries(labeled)) {
        if (value != null && value !== "") updates[key] = value;
      }
    } else {
      // If no labels are present, fall back to sequential fill.
      const nums = normalized.match(/-?\d+(?:\.\d+)?/g) ?? [];
      const order = ["N", "P", "K", "temperature", "humidity", "rainfall", "ph"];
      let idx = 0;

      for (const key of order) {
        const current = String(formData[key] ?? "").trim();
        if (current) continue;
        if (idx >= nums.length) break;
        updates[key] = nums[idx++];
      }
    }

    if (Object.keys(updates).length === 0) {
      setVoiceError("No numbers detected. Try: Nitrogen 90, Phosphorus 40, Temperature 25");
      return;
    }

    setVoiceError("");
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        // no-op
      }
    }
    setIsListening(false);
  };

  const startListening = () => {
    setVoiceError("");

    if (!canRecognize) {
      setVoiceError("Speech recognition is not supported in this browser. Use Chrome.");
      return;
    }

    // Reset transcript buffers.
    finalTranscriptRef.current = "";
    setRecognizedText("");

    const rec = new SpeechRecognitionCtor();
    recognitionRef.current = rec;

    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : lang === "gu" ? "gu-IN" : "en-US";

    rec.onstart = () => {
      setIsListening(true);
      setVoiceError("");
    };

    rec.onerror = (event) => {
      const msg = event?.error
        ? `Speech recognition error: ${event.error}`
        : "Speech recognition error.";
      setVoiceError(msg);
      setIsListening(false);
    };

    rec.onresult = (event) => {
      let interim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) {
          finalChunk += transcript;
        } else {
          interim += transcript;
        }
      }

      if (finalChunk.trim()) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalChunk}`.replace(/\s+/g, " ").trim();
      }

      const combined = `${finalTranscriptRef.current} ${interim}`.replace(/\s+/g, " ").trim();
      setRecognizedText(combined);
      recognizedTextRef.current = combined;
    };

    rec.onspeechend = () => {
      try {
        rec.stop();
      } catch {
        // no-op
      }
    };

    rec.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;

      const finalText = String(finalTranscriptRef.current || recognizedTextRef.current).trim();
      if (finalText) applyVoiceToForm(finalText);
    };

    try {
      rec.start();
    } catch {
      setVoiceError("Unable to start microphone. Check permissions and try again.");
      setIsListening(false);
    }
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

          <motion.div className="voiceRow" variants={fadeUp}>
            <div className="voiceRow__actions">
              <button
                type="button"
                className={`btn btn--ghost ${isListening ? "voiceBtn voiceBtn--active" : "voiceBtn"}`}
                onClick={() => (isListening ? stopListening() : startListening())}
                disabled={isLoading || !canRecognize}
                aria-pressed={isListening}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
                title={!canRecognize ? "Speech recognition requires Chrome" : undefined}
              >
                <span aria-hidden="true">{isListening ? "■" : "🎤"}</span>
                {isListening ? "Listening…" : "Speak"}
              </button>

              <button
                type="button"
                className="btn btn--ghost voiceBtn"
                onClick={() => {
                  setRecognizedText("");
                  setVoiceError("");
                }}
                disabled={isLoading || (!recognizedText && !voiceError)}
              >
                Clear
              </button>
            </div>

            <div className="voiceBox" aria-live="polite">
              <div className="voiceBox__label">Recognized text</div>
              <div className="voiceBox__text">{recognizedText || "—"}</div>
              {voiceError ? <div className="voiceBox__error">{voiceError}</div> : null}
            </div>
          </motion.div>

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
