import pandas as pd
import joblib
from pathlib import Path
from xgboost import XGBClassifier
from sklearn.model_selection import StratifiedKFold, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from sklearn.calibration import CalibratedClassifierCV

# ===== Config =====
DATASET_PATH = Path.home() / "Downloads" / "Crop_recommendation.csv"

ARTIFACTS_DIR = Path("artifacts")
ARTIFACTS_DIR.mkdir(exist_ok=True)

PIPELINE_PATH = ARTIFACTS_DIR / "crop_pipeline.pkl"

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
MODEL_VERSION = "4.0.0"  # Version bump (calibrated)


def main():
    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    X = df[FEATURES]
    y_raw = df["label"]

    encoder = LabelEncoder()
    y = encoder.fit_transform(y_raw)

    # Base XGBoost model
    xgb = XGBClassifier(
        objective="multi:softprob",
        eval_metric="mlogloss",
        random_state=42
    )

    # Hyperparameter search space
    param_dist = {
        "n_estimators": [200, 300, 400],
        "max_depth": [4, 5, 6],
        "learning_rate": [0.01, 0.03, 0.05],
        "subsample": [0.8, 0.9],
        "colsample_bytree": [0.7, 0.8]
    }

    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

    search = RandomizedSearchCV(
        estimator=xgb,
        param_distributions=param_dist,
        n_iter=8,
        scoring="accuracy",
        cv=cv,
        verbose=1,
        random_state=42,
        n_jobs=-1
    )

    print("Running hyperparameter search...")
    search.fit(X, y)

    base_model = search.best_estimator_

    print("\nBest Parameters:")
    print(search.best_params_)

    print("\nBest Cross-Validation Accuracy:")
    print(search.best_score_)

    # ---- Probability Calibration ----
    print("\nCalibrating probabilities...")
    calibrated_model = CalibratedClassifierCV(
        base_model,
        method="isotonic",
        cv=3
    )

    calibrated_model.fit(X, y)

    # Final training accuracy (on calibrated model)
    y_pred = calibrated_model.predict(X)
    final_accuracy = accuracy_score(y, y_pred)

    print("\nFinal Training Accuracy:")
    print(final_accuracy)

    # Save artifact
    artifact = {
        "pipeline": calibrated_model,
        "label_encoder": encoder,
        "model_version": MODEL_VERSION,
        "features": FEATURES,
        "cv_accuracy": float(search.best_score_),
        "train_accuracy": float(final_accuracy),
        "best_params": search.best_params_
    }

    joblib.dump(artifact, PIPELINE_PATH)

    print(f"\n✅ Calibrated XGBoost model saved to {PIPELINE_PATH}")
    print(f"Model version: {MODEL_VERSION}")


if __name__ == "__main__":
    main()