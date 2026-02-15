"""
ML Client

Nearest neighbor classification baseline
using dataset label column.
"""

from services.feature_mapper import FeatureMapper
from services.ml_contract import MLContract


class MLClient:

    def __init__(self):
        self.mapper = FeatureMapper()
        self.dataset = self.mapper.dataset

    def predict(self, api_input: dict) -> dict:

        features = self.mapper.build_feature_vector(api_input)

        MLContract.validate_input(features)

        user_ph = features["ph"]

        df = self.dataset.copy()
        df["ph_distance"] = (df["ph"] - user_ph).abs()

        nearest = df.sort_values("ph_distance").head(50)

        predicted_crop = nearest["label"].mode()[0]

        prediction = {
            "crop": predicted_crop
        }

        MLContract.validate_output(prediction)

        return {
            "prediction": prediction,
            "features_used": features,
            "source": "nearest_ph_baseline",
        }