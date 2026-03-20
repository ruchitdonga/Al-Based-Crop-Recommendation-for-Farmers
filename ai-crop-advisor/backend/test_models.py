import joblib
import os

model_path = os.path.join("models", "yield_models.pkl")
data = joblib.load(model_path)

models = data.get("crop_models", {})
if "Wheat" in models:
    model = models["Wheat"]
    if hasattr(model, "feature_names_in_"):
        print("Features for Wheat:")
        print(model.feature_names_in_)
    else:
        print("Model doesn't have feature_names_in_")
else:
    print("Wheat not found in crop_models:", list(models.keys()))
