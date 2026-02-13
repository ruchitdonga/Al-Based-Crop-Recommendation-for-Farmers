import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

function CropForm() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState("");

  const fields = useMemo(
    () => [
      { name: "nitrogen", label: "Nitrogen (N)", placeholder: "e.g. 60", type: "number" },
      { name: "phosphorus", label: "Phosphorus (P)", placeholder: "e.g. 45", type: "number" },
      { name: "potassium", label: "Potassium (K)", placeholder: "e.g. 55", type: "number" },
      { name: "temperature", label: "Temperature (°C)", placeholder: "e.g. 26", type: "number" },
      { name: "humidity", label: "Humidity (%)", placeholder: "e.g. 70", type: "number" },
      { name: "ph", label: "Soil pH", placeholder: "e.g. 6.5", type: "number", step: "0.1" },
      { name: "rainfall", label: "Rainfall (mm)", placeholder: "e.g. 110", type: "number" },
    ],
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const n = Number(formData.nitrogen);
    if (!Number.isFinite(n)) {
      setResult("");
      return;
    }

    setResult(n > 50 ? "Rice" : "Wheat");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.07 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <div className="formPage">
      <div className="formPage__bg" aria-hidden="true" />
      <div className="formPage__overlay" aria-hidden="true" />

      <motion.div
        className="formCard"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h2 className="formTitle" variants={item}>
            Crop Recommendation
          </motion.h2>
          <motion.p className="formSubtitle" variants={item}>
            Fill in your soil and climate values.
          </motion.p>

          <motion.form className="formGrid" onSubmit={handleSubmit} variants={container}>
            {fields.map((f) => (
              <motion.label key={f.name} className="field" variants={item}>
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
                />
              </motion.label>
            ))}

            <motion.div className="formActions" variants={item}>
              <motion.button
                type="submit"
                className="btn btn--primary btn--full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                Predict Crop
                <span className="btn__arrow">→</span>
              </motion.button>
            </motion.div>
          </motion.form>

          {result && (
            <motion.div
              className="resultBox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <span className="resultBox__label">Recommended Crop</span>
              <span className="resultBox__value">{result}</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CropForm;
