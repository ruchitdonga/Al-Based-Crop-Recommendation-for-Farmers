"""
Decision Engine

ML-first architecture.
Rules used only as fallback safety.
"""

from services.ml_client import MLClient


def decide_crop(data: dict) -> dict:

    soil_ph = data.get("soil_ph")
    last_crop = data.get("last_crop")

    ml_client = MLClient()

    try:
        ml_result = ml_client.predict({
            "soil": data.get("soil"),
            "climate": data.get("climate"),
            "last_crop": data.get("last_crop"),
        })

        predicted_crop = ml_result["prediction"]["crop"]

        if not predicted_crop:
            raise ValueError("ML returned empty crop")

        return {
            "crop": predicted_crop,
            "source": ml_result["source"],
            "ml": ml_result,
        }

    except Exception as e:
        # Fallback rule logic (safety only)
        if soil_ph is not None and soil_ph >= 6.0:
            fallback_crop = "Wheat"
        else:
            fallback_crop = "Millet"

        return {
            "crop": fallback_crop,
            "source": "rule_fallback",
            "ml": None,
            "error": str(e),
        }