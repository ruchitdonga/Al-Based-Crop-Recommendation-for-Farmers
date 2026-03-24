"""ML Client — sklearn pipeline + XGBoost yield prediction."""

import os
import joblib
import numpy as np
import pandas as pd
from functools import lru_cache


class MLClient:

    def __init__(self):
        models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

        crop_data = joblib.load(os.path.join(models_dir, "crop_pipeline.pkl"))
        self.pipeline = crop_data["pipeline"]
        self.label_encoder = crop_data["label_encoder"]
        self.model_version = crop_data["model_version"]
        self.feature_order = crop_data["features"]
        self.accuracy = crop_data.get("accuracy")

        try:
            yield_data = joblib.load(os.path.join(models_dir, "yield_models.pkl"))
            self.yield_models = yield_data.get("crop_models", {})
            self.season_encoder = yield_data.get("season_encoder")
            self.state_encoder = yield_data.get("state_encoder")
            self.valid_yield_crops = yield_data.get("valid_crops", [])
        except FileNotFoundError:
            self.yield_models = {}
            self.season_encoder = self.state_encoder = None
            self.valid_yield_crops = []

    def _prepare_input_df(self, features: dict) -> pd.DataFrame:
        enriched = {**features}
        n, p, k = enriched.get("N", 0), enriched.get("P", 0), enriched.get("K", 0)
        enriched["NPK_ratio"] = n / max(p + k, 1)
        enriched["temp_humidity"] = enriched.get("temperature", 0) * enriched.get("humidity", 0)
        enriched["rainfall_humidity"] = enriched.get("rainfall", 0) * enriched.get("humidity", 0)
        return pd.DataFrame([[enriched.get(c, 0) for c in self.feature_order]], columns=self.feature_order)

    def _predict_yield(self, crop: str, features: dict) -> float:
        key = crop.capitalize()
        if not (self.season_encoder and self.state_encoder and key in self.valid_yield_crops and key in self.yield_models):
            return None
        try:
            area = float(features.get("area", 1.0))
            fertilizer = float(features.get("N", 0) + features.get("P", 0) + features.get("K", 0))
            pesticide = float(features.get("pesticide", 10.0))

            try: season_enc = self.season_encoder.transform([features.get("season", "Kharif")])[0]
            except ValueError: season_enc = self.season_encoder.transform([self.season_encoder.classes_[0]])[0]
            try: state_enc = self.state_encoder.transform([features.get("state", "Maharashtra")])[0]
            except ValueError: state_enc = self.state_encoder.transform([self.state_encoder.classes_[0]])[0]

            row = pd.DataFrame([[
                features.get("crop_year", 2024), area,
                float(features.get("rainfall", 0) * 12),
                fertilizer, pesticide,
                fertilizer / area if area > 0 else 0,
                pesticide / area if area > 0 else 0,
                season_enc, state_enc,
            ]], columns=[
                "Crop_Year", "Area", "Annual_Rainfall", "Fertilizer", "Pesticide",
                "Fertilizer_per_area", "Pesticide_per_area", "Season_enc", "State_enc",
            ])

            result = float(self.yield_models[key].predict(row)[0])
            return max(result, 0.0)
        except Exception:
            return None

    def predict(self, features: dict) -> dict:
        df = self._prepare_input_df(features)
        idx = self.pipeline.predict(df)[0]
        crop = self.label_encoder.inverse_transform([idx])[0]
        probs = self.pipeline.predict_proba(df)[0]

        return {
            "prediction": {
                "crop": crop,
                "confidence": float(np.max(probs)),
                "estimated_yield": self._predict_yield(crop, features),
            },
            "source": "sklearn_pipeline",
            "model_version": self.model_version,
            "model_accuracy": self.accuracy,
        }

    def predict_top_k(self, features: dict, k: int = 5) -> list:
        df = self._prepare_input_df(features)
        probs = self.pipeline.predict_proba(df)[0]
        top_indices = np.argsort(probs)[::-1][:k]

        return [
            {
                "crop": self.label_encoder.inverse_transform([i])[0],
                "confidence": float(probs[i]),
                "estimated_yield": self._predict_yield(
                    self.label_encoder.inverse_transform([i])[0], features
                ),
            }
            for i in top_indices
        ]


@lru_cache(maxsize=1)
def get_ml_client() -> MLClient:
    return MLClient()