import joblib
import shap
import numpy as np
import pandas as pd

MODEL_PATH = "artifacts/crop_pipeline.pkl"


class CropDecisionEngine:

    def __init__(self):
        """
        Initialize decision engine:
        - Load trained artifact
        - Extract calibrated model
        - Extract label encoder
        - Extract feature list
        - Extract underlying XGBoost model for SHAP
        - Initialize SHAP explainer once
        """

        loaded_artifact = joblib.load(MODEL_PATH)

        self.model_wrapper = loaded_artifact["pipeline"]  # CalibratedClassifierCV
        self.label_encoder = loaded_artifact["label_encoder"]
        self.model_version = loaded_artifact.get("model_version", "unknown")
        self.features = loaded_artifact["features"]

        # Extract real XGBoost model from CalibratedClassifierCV
        if hasattr(self.model_wrapper, "calibrated_classifiers_"):
            self.model = self.model_wrapper.calibrated_classifiers_[0].estimator
        else:
            self.model = self.model_wrapper

        # Initialize SHAP explainer using raw XGB model
        self.explainer = shap.TreeExplainer(self.model)

    def predict(self, input_data: dict):
        """
        Predict crop recommendation with confidence and SHAP explanation
        """

        # Ensure correct feature order
        input_df = pd.DataFrame([input_data])[self.features]

        # Predict
        encoded_prediction = self.model_wrapper.predict(input_df)[0]
        probabilities = self.model_wrapper.predict_proba(input_df)[0]

        prediction = self.label_encoder.inverse_transform(
            [encoded_prediction]
        )[0]

        confidence = float(np.max(probabilities))

        # Confidence tiers
        if confidence >= 0.85:
            confidence_level = "high"
        elif confidence >= 0.65:
            confidence_level = "medium"
        else:
            confidence_level = "low"

        # ==========================
        # SHAP Explanation
        # ==========================

        shap_values = self.explainer.shap_values(input_df)
        predicted_index = int(np.argmax(probabilities))

        # Handle new SHAP format (3D array: samples x features x classes)
        if isinstance(shap_values, np.ndarray) and len(shap_values.shape) == 3:
            class_shap_values = shap_values[0, :, predicted_index]

        # Handle old list format (list of arrays per class)
        elif isinstance(shap_values, list):
            class_shap_values = shap_values[predicted_index][0]

        # Fallback
        else:
            class_shap_values = shap_values[0]

        # Convert safely to float array
        class_shap_values = np.array(class_shap_values).astype(float)

        feature_impact = dict(zip(self.features, class_shap_values))

        # Sort safely by absolute impact
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

        return {
            "crop": prediction,
            "confidence": round(confidence, 4),
            "confidence_level": confidence_level,
            "top_positive_factors": top_positive,
            "top_negative_factors": top_negative,
            "model_version": self.model_version
        }


if __name__ == "__main__":

    engine = CropDecisionEngine()

    sample_input = {
        "N": 90,
        "P": 42,
        "K": 43,
        "temperature": 26.0,
        "humidity": 80,
        "ph": 6.5,
        "rainfall": 200
    }

    result = engine.predict(sample_input)
    print(result)
