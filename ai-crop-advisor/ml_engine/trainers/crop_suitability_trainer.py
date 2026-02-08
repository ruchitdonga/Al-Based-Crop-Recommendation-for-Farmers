import pandas as pd
import joblib
from pathlib import Path

from ml_engine.models.crop_suitability import CropSuitabilityModel

# Dataset location (local, never committed)
DATASET_PATH = Path.home() / "Downloads" / "Crop_recommendation.csv"

# Artifacts directory (gitignored)
ARTIFACTS_DIR = Path("artifacts")
ARTIFACTS_DIR.mkdir(exist_ok=True)

MODEL_PATH = ARTIFACTS_DIR / "crop_suitability.pkl"


def main():
    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)
    print(f"Dataset loaded: {df.shape}")

    print("Training crop suitability model...")
    model = CropSuitabilityModel()
    model.train(df)

    print("Saving trained model...")
    joblib.dump(model, MODEL_PATH)

    print(f"✅ Model saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()