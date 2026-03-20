import joblib
import os

yield_model_path = os.path.join("models", "yield_models.pkl")
data = joblib.load(yield_model_path)

valid_crops = data.get("valid_crops", [])
print("Valid Yield crops format example:", valid_crops[:5])
print("Is 'jute' in valid_crops?", 'jute' in valid_crops)
print("Is 'Jute' in valid_crops?", 'Jute' in valid_crops)
