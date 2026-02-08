import pandas as pd
import numpy as np
import random
from pathlib import Path

# ---- CONFIG ----


CROP_CLIMATE_DATA = Path("/Users/prashantbhandare/Downloads/Crop_recommendation.csv")
SOIL_DATA = Path("/Users/prashantbhandare/Downloads/dataset.csv.csv")
OUTPUT_PATH = Path("/Users/prashantbhandare/Downloads/synthetic_agro_scenarios_100k.csv")
N_SAMPLES = 100_000

FEATURES_CLIMATE = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
FEATURES_SOIL = ["N", "P", "K", "ph"]

# ---- LOAD REAL DATA ----
def load_real_stats():
    climate_df = pd.read_csv(CROP_CLIMATE_DATA)
    soil_df = pd.read_csv(SOIL_DATA)

    climate_stats = climate_df.groupby("label")[FEATURES_CLIMATE].agg(["mean", "std"])
    soil_stats = soil_df.groupby("label")[FEATURES_SOIL].agg(["mean", "std"])

    return climate_stats, soil_stats


# ---- CONSTRAINED SAMPLING ----
def sample_constrained(mean, std, low, high):
    for _ in range(10):  # retry to avoid invalid values
        value = np.random.normal(mean, std)
        if low <= value <= high:
            return value
    return np.clip(mean, low, high)


# ---- GENERATOR ----
def generate_synthetic_dataset(n=N_SAMPLES):
    climate_stats, soil_stats = load_real_stats()
    crops = list(climate_stats.index)

    rows = []

    for _ in range(n):
        crop = random.choice(crops)

        row = {"label": crop}

        # --- Climate + Soil features ---
        for feature in FEATURES_CLIMATE:
            mean = climate_stats.loc[crop][(feature, "mean")]
            std = climate_stats.loc[crop][(feature, "std")]

            # Hard biological constraints
            bounds = {
                "N": (0, 200),
                "P": (0, 150),
                "K": (0, 200),
                "temperature": (5, 45),
                "humidity": (20, 100),
                "ph": (4.5, 8.5),
                "rainfall": (0, 500)
            }

            low, high = bounds[feature]
            row[feature] = sample_constrained(mean, std, low, high)

        rows.append(row)

    return pd.DataFrame(rows)


# ---- MAIN ----
if __name__ == "__main__":
    df = generate_synthetic_dataset()
    Path("data").mkdir(exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)

    print("✅ Synthetic dataset generated")
    print("Shape:", df.shape)
    print(df.head())