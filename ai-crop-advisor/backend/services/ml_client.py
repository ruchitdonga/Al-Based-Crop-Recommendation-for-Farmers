"""
ML Client - Real sklearn Pipeline Integration
"""

import os
import joblib
import numpy as np
import pandas as pd
from functools import lru_cache

class MLClient:

    def __init__(self):
        # Path to models
        models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
        crop_model_path = os.path.join(models_dir, "crop_pipeline.pkl")
        yield_model_path = os.path.join(models_dir, "yield_models.pkl")

        # Load serialized dictionaries
        crop_model_data = joblib.load(crop_model_path)

        yield_model_data = None
        try:
            yield_model_data = joblib.load(yield_model_path)
        except FileNotFoundError:
            yield_model_data = None

        # Extract components
        self.pipeline = crop_model_data["pipeline"]
        self.label_encoder = crop_model_data["label_encoder"]
        self.model_version = crop_model_data["model_version"]
        self.feature_order = crop_model_data["features"]
        self.accuracy = crop_model_data.get("accuracy")

        # Yield Model components (optional)
        if yield_model_data:
            self.yield_models_dict = yield_model_data.get("crop_models", {})
            self.season_encoder = yield_model_data.get("season_encoder")
            self.state_encoder = yield_model_data.get("state_encoder")
            self.valid_yield_crops = yield_model_data.get("valid_crops", [])
        else:
            self.yield_models_dict = {}
            self.season_encoder = None
            self.state_encoder = None
            self.valid_yield_crops = []

    def _prepare_input_df(self, features: dict) -> pd.DataFrame:
        n, p, k = features.get("N", 0), features.get("P", 0), features.get("K", 0)
        features["NPK_ratio"] = n / max(p + k, 1)
        features["temp_humidity"] = features.get("temperature", 0) * features.get("humidity", 0)
        features["rainfall_humidity"] = features.get("rainfall", 0) * features.get("humidity", 0)
        return pd.DataFrame([[features.get(col, 0) for col in self.feature_order]], columns=self.feature_order)

    def _predict_yield(self, crop: str, features: dict) -> float:
        yield_prediction_key = crop.capitalize()
        if not (self.season_encoder and self.state_encoder and yield_prediction_key in self.valid_yield_crops and yield_prediction_key in self.yield_models_dict):
            return None
        try:
            area = float(features.get("area", 1.0))
            annual_rainfall = float(features.get("rainfall", 0) * 12)  # Proxy for annual
            fertilizer = float(features.get("N", 0) + features.get("P", 0) + features.get("K", 0))
            pesticide = float(features.get("pesticide", 10.0))
            fert_per_area = fertilizer / area if area > 0 else 0
            pest_per_area = pesticide / area if area > 0 else 0
            season = features.get("season", "Kharif")
            state = features.get("state", "Maharashtra")
            try: season_enc = self.season_encoder.transform([season])[0]
            except ValueError: season_enc = self.season_encoder.transform([self.season_encoder.classes_[0]])[0]
            try: state_enc = self.state_encoder.transform([state])[0]
            except ValueError: state_enc = self.state_encoder.transform([self.state_encoder.classes_[0]])[0]

            yield_input = pd.DataFrame([[
                features.get("crop_year", 2024), area, annual_rainfall, fertilizer, pesticide, 
                fert_per_area, pest_per_area, season_enc, state_enc
            ]], columns=['Crop_Year', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Fertilizer_per_area', 'Pesticide_per_area', 'Season_enc', 'State_enc'])
            
            yield_model_pipeline = self.yield_models_dict[yield_prediction_key]
            estimated_yield = float(yield_model_pipeline.predict(yield_input)[0])
            if estimated_yield < 0: estimated_yield = 0.0
            return estimated_yield
        except Exception as e:
            return None

    def predict(self, features: dict) -> dict:
        input_df = self._prepare_input_df(features)
        prediction_encoded = self.pipeline.predict(input_df)[0]
        prediction = self.label_encoder.inverse_transform([prediction_encoded])[0]
        probabilities = self.pipeline.predict_proba(input_df)[0]
        confidence = float(np.max(probabilities))
        estimated_yield = self._predict_yield(prediction, features)

        return {
            "prediction": {
                "crop": prediction,
                "confidence": confidence,
                "estimated_yield": estimated_yield
            },
            "source": "sklearn_pipeline",
            "model_version": self.model_version,
            "model_accuracy": self.accuracy
        }
    
    def predict_top_k(self, features: dict, k: int = 5) -> list:
        input_df = self._prepare_input_df(features)
        probabilities = self.pipeline.predict_proba(input_df)[0]
        top_indices = np.argsort(probabilities)[::-1][:k]
        
        candidates = []
        for idx in top_indices:
            crop = self.label_encoder.inverse_transform([idx])[0]
            conf = float(probabilities[idx])
            yld = self._predict_yield(crop, features)
            candidates.append({
                "crop": crop,
                "confidence": conf,
                "estimated_yield": yld
            })
        return candidates

@lru_cache(maxsize=1)
def get_ml_client() -> MLClient:
    """Returns a globally cached instance of the MLClient to prevent reloading .pkl models on every request."""
    return MLClient()