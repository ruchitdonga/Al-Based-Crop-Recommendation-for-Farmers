import joblib
import numpy as np
import pandas as pd

YIELD_MODEL_PATH = "artifacts/yield_models.pkl"


class YieldDecisionEngine:

    def __init__(self):
        artifact = joblib.load(YIELD_MODEL_PATH)

        self.crop_models = artifact["crop_models"]
        self.crop_rmse = artifact["crop_rmse"]
        self.valid_crops = artifact["valid_crops"]
        self.model_version = artifact.get("model_version", "unknown")

    def predict_yield(self, input_data: dict):
        """
        input_data must include:
        Crop, Season, State, Crop_Year,
        Area, Annual_Rainfall, Fertilizer, Pesticide
        """

        crop = input_data["Crop"]

        if crop not in self.crop_models:
            return {
                "error": f"No trained yield model available for crop: {crop}"
            }

        model = self.crop_models[crop]

        input_df = pd.DataFrame([{
            "Season": input_data["Season"],
            "State": input_data["State"],
            "Crop_Year": input_data["Crop_Year"],
            "Area": input_data["Area"],
            "Annual_Rainfall": input_data["Annual_Rainfall"],
            "Fertilizer": input_data["Fertilizer"],
            "Pesticide": input_data["Pesticide"]
        }])

        predicted_log = model.predict(input_df)[0]
        predicted_yield = float(np.expm1(predicted_log))

        return {
            "crop": crop,
            "predicted_yield_per_unit": round(predicted_yield, 4),
            "historical_rmse": round(float(self.crop_rmse[crop]), 4),
            "model_version": self.model_version
        }


if __name__ == "__main__":

    engine = YieldDecisionEngine()

    sample_input = {
        "Crop": "Rice",
        "Season": "Kharif",
        "State": "Assam",
        "Crop_Year": 2014,
        "Area": 1000,
        "Annual_Rainfall": 2000,
        "Fertilizer": 500000,
        "Pesticide": 2000
    }

    result = engine.predict_yield(sample_input)
    print(result)