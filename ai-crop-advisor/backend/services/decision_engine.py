import logging
from datetime import datetime
from services.ml_client import MLClient

CONFIDENCE_THRESHOLD = 0.5

logger = logging.getLogger(__name__)


def decide_crop(data: dict) -> dict:

    ml_client = MLClient()

    try:
        features = {
            **data.get("soil"),
            **data.get("climate")
        }

        # Log input features
        logger.info(f"Decision engine input - Soil: {data.get('soil')}, Climate: {data.get('climate')}")

        ml_result = ml_client.predict(features)

        prediction = ml_result["prediction"]
        crop = prediction["crop"]
        confidence = prediction["confidence"]

        if confidence < CONFIDENCE_THRESHOLD:
            soil_ph = data.get("soil", {}).get("ph")
            crop = "Wheat" if soil_ph and soil_ph >= 6 else "Millet"

            # Log fallback trigger
            logger.warning(
                f"Low confidence fallback triggered - "
                f"Original confidence: {confidence}, "
                f"Threshold: {CONFIDENCE_THRESHOLD}, "
                f"Fallback crop: {crop}, "
                f"Timestamp: {datetime.now().isoformat()}"
            )

            return {
                "crop": crop,
                "confidence": confidence,
                "source": "rule_fallback_low_confidence",
                "model_version": ml_result["model_version"],
                "reason": "low_confidence_fallback"
            }

        # Log successful ML prediction
        logger.info(
            f"ML prediction successful - "
            f"Crop: {crop}, "
            f"Confidence: {confidence}, "
            f"Model: {ml_result['model_version']}, "
            f"Timestamp: {datetime.now().isoformat()}"
        )

        return {
            "crop": crop,
            "confidence": confidence,
            "source": ml_result["source"],
            "model_version": ml_result["model_version"],
            "reason": "ml_prediction"
        }

    except Exception as e:
        # Log ML error and fallback
        logger.error(
            f"ML error fallback triggered - "
            f"Error: {str(e)}, "
            f"Fallback crop: Millet, "
            f"Timestamp: {datetime.now().isoformat()}"
        )

        return {
            "crop": "Millet",
            "confidence": 0.0,
            "source": "rule_fallback_error",
            "model_version": "unknown",
            "reason": "ml_error_fallback",
            "error": str(e)
        }
