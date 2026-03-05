import joblib
import shap
import numpy as np
import pandas as pd

from ml_engine.yield_engine import YieldDecisionEngine

MODEL_PATH = "artifacts/crop_pipeline.pkl"


class CropDecisionEngine:

    def __init__(self):
        loaded_artifact = joblib.load(MODEL_PATH)

        self.model_wrapper = loaded_artifact["pipeline"]
        self.label_encoder = loaded_artifact["label_encoder"]
        self.model_version = loaded_artifact.get("model_version", "unknown")
        self.features = loaded_artifact["features"]

        # Extract raw XGBoost model for SHAP
        if hasattr(self.model_wrapper, "calibrated_classifiers_"):
            self.model = self.model_wrapper.calibrated_classifiers_[0].estimator
        else:
            self.model = self.model_wrapper

        self.explainer = shap.TreeExplainer(self.model)

        # Initialize Yield Engine
        self.yield_engine = YieldDecisionEngine()

    # ==================================================
    # Primary Prediction (Classification + Yield)
    # ==================================================

    def predict(self, input_data: dict, yield_context: dict):

        input_df = pd.DataFrame([input_data])[self.features]

        probabilities = self.model_wrapper.predict_proba(input_df)[0]
        sorted_indices = np.argsort(probabilities)[::-1]

        # --------------------------------------------------
        # Align classification crop with yield coverage
        # --------------------------------------------------

        yield_keys_lower = {
            k.lower(): k for k in self.yield_engine.crop_models.keys()
        }

        recommended_crop_classifier = None
        recommended_crop_yield = None
        classification_confidence = None

        for idx in sorted_indices:
            crop_candidate = self.label_encoder.inverse_transform([idx])[0]

            if crop_candidate.lower() in yield_keys_lower:
                recommended_crop_classifier = crop_candidate
                recommended_crop_yield = yield_keys_lower[crop_candidate.lower()]
                classification_confidence = float(probabilities[idx])
                break

        if recommended_crop_classifier is None:
            return {
                "recommended_crop": None,
                "classification_confidence": None,
                "confidence_level": None,
                "predicted_yield_per_unit": None,
                "yield_rmse": None,
                "top_alternatives": [],
                "top_positive_factors": [],
                "top_negative_factors": [],
                "model_version": self.model_version
            }

        # Confidence tier
        if classification_confidence >= 0.85:
            confidence_level = "high"
        elif classification_confidence >= 0.65:
            confidence_level = "medium"
        else:
            confidence_level = "low"

        # --------------------------------------------------
        # SHAP Explanation
        # --------------------------------------------------

        predicted_index = list(self.label_encoder.classes_).index(
            recommended_crop_classifier
        )

        shap_values = self.explainer.shap_values(input_df)

        if isinstance(shap_values, np.ndarray) and len(shap_values.shape) == 3:
            class_shap_values = shap_values[0, :, predicted_index]
        elif isinstance(shap_values, list):
            class_shap_values = shap_values[predicted_index][0]
        else:
            class_shap_values = shap_values[0]

        class_shap_values = np.array(class_shap_values).astype(float)
        feature_impact = dict(zip(self.features, class_shap_values))

        sorted_features = sorted(
            feature_impact.items(),
            key=lambda x: abs(float(x[1])),
            reverse=True
        )

        top_positive = [
            {"feature": f, "impact": round(float(v), 4)}
            for f, v in sorted_features if float(v) > 0
        ][:3]

        top_negative = [
            {"feature": f, "impact": round(float(v), 4)}
            for f, v in sorted_features if float(v) < 0
        ][:3]

        # --------------------------------------------------
        # Yield Prediction
        # --------------------------------------------------

        yield_context_main = yield_context.copy()
        yield_context_main["Crop"] = recommended_crop_yield

        yield_result = self.yield_engine.predict_yield(yield_context_main)

        # --------------------------------------------------
        # Alternatives (Yield Supported Only)
        # --------------------------------------------------

        enriched_alternatives = []

        for idx in sorted_indices:
            crop_candidate = self.label_encoder.inverse_transform([idx])[0]

            if crop_candidate.lower() not in yield_keys_lower:
                continue

            alt_crop_classifier = crop_candidate
            alt_crop_yield = yield_keys_lower[crop_candidate.lower()]

            if alt_crop_yield == recommended_crop_yield:
                continue

            alt_context = yield_context.copy()
            alt_context["Crop"] = alt_crop_yield

            alt_yield = self.yield_engine.predict_yield(alt_context)

            enriched_alternatives.append({
                "crop": alt_crop_yield,
                "classification_confidence": round(float(probabilities[idx]), 4),
                "predicted_yield_per_unit": alt_yield.get("predicted_yield_per_unit"),
                "yield_rmse": alt_yield.get("historical_rmse")
            })

            if len(enriched_alternatives) == 3:
                break

        return {
            "recommended_crop": recommended_crop_yield,
            "classification_confidence": round(classification_confidence, 4),
            "confidence_level": confidence_level,
            "predicted_yield_per_unit": yield_result.get("predicted_yield_per_unit"),
            "yield_rmse": yield_result.get("historical_rmse"),
            "top_alternatives": enriched_alternatives,
            "top_positive_factors": top_positive,
            "top_negative_factors": top_negative,
            "model_version": self.model_version
        }


# ==================================================
# Demo Run
# ==================================================

if __name__ == "__main__":

    engine = CropDecisionEngine()

    classification_input = {
        "N": 90,
        "P": 42,
        "K": 43,
        "temperature": 26.0,
        "humidity": 80,
        "ph": 6.5,
        "rainfall": 200
    }

    yield_context = {
        "Season": "Kharif",
        "State": "Assam",
        "Crop_Year": 2014,
        "Area": 1000,
        "Annual_Rainfall": 2000,
        "Fertilizer": 500000,
        "Pesticide": 2000
    }

    result = engine.predict(classification_input, yield_context)
    print(result)