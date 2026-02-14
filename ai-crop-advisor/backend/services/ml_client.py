"""
ML Client

Handles interaction with ML prediction system.
"""

from services.feature_mapper import FeatureMapper


class MLClient:

    def __init__(self):
        self.mapper = FeatureMapper()

    def predict(self, api_input: dict) -> dict:
        """
        Convert API input → ML features → prediction.
        """

        # Build ML feature vector
        features = self.mapper.build_feature_vector(api_input)

        # -----------------------------
        # TEMP ML PREDICTION (STUB)
        # -----------------------------
        # Later ML engineer replaces this block.

        prediction = {
            "crop": "PredictedCrop",
            "yield": 3.5,
            "profit": 12000,
            "confidence": 0.82,
        }

        return {
            "prediction": prediction,
            "features_used": features,
            "source": "ml_stub",
        }
