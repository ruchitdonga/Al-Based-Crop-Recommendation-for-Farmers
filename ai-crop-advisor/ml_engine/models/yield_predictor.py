import pandas as pd
from sklearn.ensemble import RandomForestRegressor


class YieldPredictor:
    def __init__(self):
        self.features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        self.model = RandomForestRegressor(
            n_estimators=150,
            max_depth=8,
            random_state=42
        )
        self.trained = False

    def train(self, df: pd.DataFrame):
        X = df[self.features]

        # Synthetic yield target for now (real dataset later)
        y = (
            0.3 * df["rainfall"] +
            0.2 * df["humidity"] +
            0.4 * df["N"] -
            0.1 * abs(df["ph"] - 6.5)
        )

        self.model.fit(X, y)
        self.trained = True

    def predict(self, input_data: dict):
        if not self.trained:
            raise RuntimeError("Yield model not trained")

        df = pd.DataFrame([input_data])[self.features]
        return float(self.model.predict(df)[0])