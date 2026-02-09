import pandas as pd
from typing import List, Tuple
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder


class CropSuitabilityModel:
    def __init__(self):
        self.features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            random_state=42
        )
        self.encoder = LabelEncoder()
        self.trained = False

    def train(self, df: pd.DataFrame) -> None:
        X = df[self.features]
        y = self.encoder.fit_transform(df["label"])
        self.model.fit(X, y)
        self.trained = True

    def predict_top_k(self, input_data: dict, k: int = 3) -> List[Tuple[str, float]]:
        if not self.trained:
            raise RuntimeError("CropSuitabilityModel is not trained")

        X = pd.DataFrame([input_data])[self.features]
        probs = self.model.predict_proba(X)[0]

        crops = self.encoder.inverse_transform(range(len(probs)))
        ranked = sorted(
            zip(crops, probs),
            key=lambda x: x[1],
            reverse=True
        )
        return ranked[:k]