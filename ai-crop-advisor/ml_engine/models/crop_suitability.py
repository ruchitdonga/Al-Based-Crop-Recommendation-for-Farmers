import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.calibration import CalibratedClassifierCV
from xgboost import XGBClassifier


ARTIFACT_PATH = "artifacts/crop_pipeline.pkl"


class CropSuitabilityTrainer:

    def __init__(self):
        self.features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

        # Only crops with yield models
        self.valid_crops = [
            'Rice', 'Maize', 'Moong(Green Gram)', 'Urad', 'Groundnut',
            'Sesamum', 'Potato', 'Sugarcane', 'Wheat', 'Rapeseed &Mustard',
            'Bajra', 'Jowar', 'Arhar/Tur', 'Ragi', 'Gram', 'Small millets',
            'Cotton(lint)', 'Onion', 'Sunflower', 'Dry chillies',
            'Other Kharif pulses', 'Peas & beans (Pulses)', 'Horse-gram',
            'Tobacco', 'Other  Rabi pulses', 'Soyabean', 'Turmeric',
            'Masoor', 'Ginger', 'Linseed', 'Castor seed', 'Barley',
            'Sweet potato', 'Garlic', 'Banana', 'Mesta', 'Tapioca'
        ]

    def train(self, df: pd.DataFrame):

        print("Filtering crops to match yield coverage...")
        df = df[df["label"].isin(self.valid_crops)]

        print("Dataset shape after filtering:", df.shape)

        X = df[self.features]
        y_raw = df["label"]

        encoder = LabelEncoder()
        y = encoder.fit_transform(y_raw)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=0.2,
            random_state=42,
            stratify=y
        )

        print("Training XGBoost model...")

        base_model = XGBClassifier(
            n_estimators=300,
            max_depth=5,
            learning_rate=0.05,
            subsample=0.9,
            colsample_bytree=0.7,
            eval_metric="mlogloss",
            use_label_encoder=False
        )

        base_model.fit(X_train, y_train)

        print("Calibrating probabilities...")

        calibrated_model = CalibratedClassifierCV(
            estimator=base_model,
            method="isotonic",
            cv=3
        )

        calibrated_model.fit(X_train, y_train)

        train_accuracy = calibrated_model.score(X_train, y_train)
        test_accuracy = calibrated_model.score(X_test, y_test)

        print("Train Accuracy:", train_accuracy)
        print("Test Accuracy:", test_accuracy)

        os.makedirs("artifacts", exist_ok=True)

        artifact = {
            "pipeline": calibrated_model,
            "label_encoder": encoder,
            "features": self.features,
            "model_version": "5.0.0",  # bumped version
            "train_accuracy": train_accuracy,
            "test_accuracy": test_accuracy,
        }

        joblib.dump(artifact, ARTIFACT_PATH)

        print("\n✅ Filtered & Calibrated model saved.")
        print("Model version: 5.0.0")


if __name__ == "__main__":

    print("Loading dataset...")
    df = pd.read_csv("data/crop_recommendation.csv")  # adjust path if needed

    trainer = CropSuitabilityTrainer()
    trainer.train(df)

