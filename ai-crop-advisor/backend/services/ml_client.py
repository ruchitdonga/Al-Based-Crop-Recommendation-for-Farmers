"""
ML Client - Real sklearn Pipeline Integration
"""

import os
import joblib
import numpy as np
import pandas as pd


class MLClient:

    def __init__(self):

        # Path to model file
        model_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "models",
            "crop_pipeline.pkl"
        )

        # Load serialized dictionary
        model_data = joblib.load(model_path)

        # Extract components
        self.pipeline = model_data["pipeline"]
        self.label_encoder = model_data["label_encoder"]
        self.model_version = model_data["model_version"]
        self.feature_order = model_data["features"]
        self.accuracy = model_data.get("accuracy")

    def predict(self, features: dict) -> dict:

        # Create DataFrame with correct feature names
        input_df = pd.DataFrame(
            [[features[col] for col in self.feature_order]],
            columns=self.feature_order
        )

        # Predict encoded label
        prediction_encoded = self.pipeline.predict(input_df)[0]

        # Decode label
        prediction = self.label_encoder.inverse_transform(
            [prediction_encoded]
        )[0]

        # Get probabilities
        probabilities = self.pipeline.predict_proba(input_df)[0]
        confidence = float(np.max(probabilities))

        return {
            "prediction": {
                "crop": prediction,
                "confidence": confidence
            },
            "source": "sklearn_pipeline",
            "model_version": self.model_version,
            "model_accuracy": self.accuracy
        }
    