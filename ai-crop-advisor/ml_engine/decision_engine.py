import joblib
from pathlib import Path
import pandas as pd

ARTIFACTS_DIR = Path("artifacts")
PIPELINE_PATH = ARTIFACTS_DIR / "crop_pipeline.pkl"


class DecisionEngine:
    def __init__(self):
        self.pipeline = None
        self.encoder = None
        self.features = None
        self.model_version = None

    def load_models(self):
        artifact = joblib.load(PIPELINE_PATH)

        self.pipeline = artifact["pipeline"]
        self.encoder = artifact["label_encoder"]
        self.features = artifact["features"]
        self.model_version = artifact["model_version"]

    def recommend(self, input_data: dict):
        df = pd.DataFrame([input_data])[self.features]

        probs = self.pipeline.predict_proba(df)[0]
        pred_class = probs.argmax()

        crop = self.encoder.inverse_transform([pred_class])[0]
        confidence = float(probs[pred_class])

        return {
            "crop": crop,
            "confidence": round(confidence, 4),
            "model_version": self.model_version
        }


if __name__ == "__main__":
    engine = DecisionEngine()
    engine.load_models()

    sample = {
        "N": 80.0,
        "P": 40.0,
        "K": 50.0,
        "temperature": 28.0,
        "humidity": 75.0,
        "ph": 6.8,
        "rainfall": 200.0
    }

    print(engine.recommend(sample))