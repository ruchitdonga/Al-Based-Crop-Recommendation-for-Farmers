import os
import joblib

crop_model_path = os.path.join("models", "crop_pipeline.pkl")
crop_model_data = joblib.load(crop_model_path)
with open("features.txt", "w") as f:
    f.write(", ".join(crop_model_data["features"]))
