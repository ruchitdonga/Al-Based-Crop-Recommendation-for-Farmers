"""
Decision Engine (Rule-Based v1)

Rules decide crop first.
ML client is called for future enhancement.
"""

from services.ml_client import MLClient


def decide_crop(data: dict) -> dict:

    soil_ph = data.get("soil_ph")
    last_crop = data.get("last_crop")

    # RULE 1 — soil pH suitability
    if soil_ph is not None and soil_ph >= 6.0:
        crop = "Wheat"
    else:
        crop = "Millet"

    # RULE 2 — avoid repeating same crop
    if last_crop and last_crop.lower() == crop.lower():
        crop = "Pulses"

    # ML client (stub for now)
    ml_client = MLClient()
    ml_result = ml_client.predict({
    "soil": {"ph": soil_ph},
    "last_crop": last_crop,
    })


    return {
        "crop": crop,
        "source": "rules",
        "ml": ml_result,
    }
