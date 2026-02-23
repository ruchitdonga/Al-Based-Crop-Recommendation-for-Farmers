"""
Feature Mapper

Transforms API input into ML-ready feature vector.
Loads dataset only once per process.
"""

from services.data_service import DatasetService


class FeatureMapper:

    _cached_dataset = None
    _cached_averages = None

    REQUIRED_COLUMNS = [
        "N",
        "P",
        "K",
        "temperature",
        "humidity",
        "ph",
        "rainfall",
    ]

    def __init__(self):

        if FeatureMapper._cached_dataset is None:
            ds = DatasetService()
            dataset = ds.load_dataset()

            # Validate required columns exist
            missing = [
                col for col in self.REQUIRED_COLUMNS
                if col not in dataset.columns
            ]

            if missing:
                raise ValueError(
                    f"Dataset missing required columns: {missing}"
                )

            FeatureMapper._cached_dataset = dataset
            FeatureMapper._cached_averages = dataset.mean(
                numeric_only=True
            )

        self.dataset = FeatureMapper._cached_dataset
        self.averages = FeatureMapper._cached_averages

    def build_feature_vector(self, api_input: dict) -> dict:

        soil = api_input.get("soil", {})
        climate = api_input.get("climate", {})

        feature_vector = {
            "N": float(soil["N"]),
            "P": float(soil["P"]),
            "K": float(soil["K"]),
            "temperature": float(climate["temperature"]),
            "humidity": float(climate["humidity"]),
            "ph": float(soil["ph"]),
            "rainfall": float(climate["rainfall"]),
        }

        return feature_vector