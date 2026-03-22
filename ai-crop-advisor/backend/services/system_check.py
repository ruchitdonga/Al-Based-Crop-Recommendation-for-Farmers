"""
System Check Service

Verifies backend components are ready.
"""

from services.data_service import DatasetService
from services.feature_mapper import FeatureMapper
from services.ml_client import MLClient


class SystemCheck:

    def check_dataset(self):
        try:
            ds = DatasetService()
            ds.load_dataset()
            return "loaded"
        except Exception:
            return "error"

    def check_feature_mapper(self):
        try:
            fm = FeatureMapper()
            mock_input = {
                "soil": {"N": 0, "P": 0, "K": 0, "ph": 6.5},
                "climate": {"temperature": 0, "humidity": 0, "rainfall": 0}
            }
            fm.build_feature_vector(mock_input)
            return "ready"
        except Exception:
            return "error"

    def check_ml_client(self):
        try:
            ml = MLClient()
            mock_features = {
                "N": 0, "P": 0, "K": 0,
                "temperature": 0, "humidity": 0,
                "ph": 6.5, "rainfall": 0
            }
            ml.predict(mock_features)
            return "ready"
        except Exception:
            return "error"

    def run_all(self):
        return {
            "api": "up",
            "dataset": self.check_dataset(),
            "feature_mapper": self.check_feature_mapper(),
            "ml_client": self.check_ml_client(),
        }
