import joblib
from pathlib import Path
from typing import Dict, List

from ml_engine.models.crop_suitability import CropSuitabilityModel

# Path to trained artifacts (runtime only, gitignored)
ARTIFACTS_DIR = Path("artifacts")
CROP_MODEL_PATH = ARTIFACTS_DIR / "crop_suitability.pkl"


class DecisionEngine:
    def __init__(self):
        self.crop_model: CropSuitabilityModel | None = None

    def load_models(self) -> None:
        if not CROP_MODEL_PATH.exists():
            raise FileNotFoundError(
                "Crop suitability model not found. "
                "Run the trainer before inference."
            )

        self.crop_model = joblib.load(CROP_MODEL_PATH)

        if not isinstance(self.crop_model, CropSuitabilityModel):
            raise RuntimeError(
                "Invalid model artifact format. "
                "Expected CropSuitabilityModel."
            )

    def recommend_crops(
        self,
        soil_weather_input: Dict,
        top_k: int = 3
    ) -> List[Dict]:
        if self.crop_model is None:
            raise RuntimeError("Models not loaded. Call load_models() first.")

        predictions = self.crop_model.predict_top_k(
            soil_weather_input,
            k=top_k
        )

        return [
            {"crop": crop, "confidence": round(float(score), 4)}
            for crop, score in predictions
        ]


# Local sanity test (never used in production)
if __name__ == "__main__":
    engine = DecisionEngine()
    engine.load_models()

    sample_input = {
        "N": 80,
        "P": 40,
        "K": 50,
        "temperature": 28,
        "humidity": 75,
        "ph": 6.8,
        "rainfall": 200
    }

    print(engine.recommend_crops(sample_input))