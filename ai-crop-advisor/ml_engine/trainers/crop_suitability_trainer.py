import pandas as pd
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# ===== Config =====
DATASET_PATH = Path.home() / "Downloads" / "Crop_recommendation.csv"
ARTIFACTS_DIR = Path("artifacts")
ARTIFACTS_DIR.mkdir(exist_ok=True)

PIPELINE_PATH = ARTIFACTS_DIR / "crop_pipeline.pkl"
METADATA_PATH = ARTIFACTS_DIR / "crop_pipeline_metadata.json"

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
MODEL_VERSION = "1.0.0"


def main():
    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    X = df[FEATURES]
    y_raw = df["label"]

    # Encode labels
    encoder = LabelEncoder()
    y = encoder.fit_transform(y_raw)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Build pipeline
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            random_state=42
        ))
    ])

    print("Training pipeline...")
    pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Accuracy: {accuracy:.4f}")
    print(classification_report(y_test, y_pred))

    # Save full inference object
    artifact = {
        "pipeline": pipeline,
        "label_encoder": encoder,
        "model_version": MODEL_VERSION,
        "features": FEATURES,
        "accuracy": accuracy
    }

    joblib.dump(artifact, PIPELINE_PATH)

    print(f"✅ Pipeline saved to {PIPELINE_PATH}")
    print(f"Model version: {MODEL_VERSION}")


if __name__ == "__main__":
    main()