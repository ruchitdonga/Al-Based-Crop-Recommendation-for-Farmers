"""
Feature Mapper

Transforms API input into ML feature vector.
"""

from services.data_service import DatasetService


class FeatureMapper:

    def __init__(self):
        self.dataset_service = DatasetService()
        self.dataset = self.dataset_service.load_dataset()

    def build_feature_vector(self, api_input: dict) -> dict:
        """
        Convert API request into ML-ready feature vector.
        """

        soil = api_input.get("soil", {})
        soil_ph = soil.get("ph")

        # Temporary strategy:
        # Use dataset averages for missing values
        averages = self.dataset.mean(numeric_only=True)

        feature_vector = {
            "N": float(averages["N"]),
            "P": float(averages["P"]),
            "K": float(averages["K"]),
            "temperature": float(averages["temperature"]),
            "humidity": float(averages["humidity"]),
            "ph": float(soil_ph) if soil_ph is not None else float(averages["ph"]),
            "rainfall": float(averages["rainfall"]),
        }


        return feature_vector
