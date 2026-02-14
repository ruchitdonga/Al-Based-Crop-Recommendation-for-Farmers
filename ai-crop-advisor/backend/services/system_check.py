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
            fm.build_feature_vector({"soil": {"ph": 6.5}})
            return "ready"
        except Exception:
            return "error"

    def check_ml_client(self):
        try:
            ml = MLClient()
            ml.predict({"soil": {"ph": 6.5}})
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
