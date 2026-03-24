import logging
from services.ml_client import get_ml_client
from services.profit_service import calculate_profit
from services.analytics_service import generate_farm_analytics

CONFIDENCE_THRESHOLD = 0.4
BASELINE_YIELD_PER_HA = 3.0

logger = logging.getLogger(__name__)


def decide_crop(data: dict) -> dict:
    ml_client = get_ml_client()

    try:
        features = {
            **data.get("soil", {}),
            **data.get("climate", {}),
            "area": data.get("area", 1.0),
            "pesticide": data.get("pesticide", 0.0),
            "season": data.get("season", "Kharif"),
            "state": data.get("state", "Maharashtra"),
            "crop_year": data.get("crop_year", 2024),
        }

        candidates = ml_client.predict_top_k(features, k=5)
        best, highest_profit = None, -float("inf")

        for c in candidates:
            if c.get("estimated_yield") is None:
                c["estimated_yield"] = features["area"] * BASELINE_YIELD_PER_HA

            c["financials"] = calculate_profit(c["crop"], c["estimated_yield"], features["area"])
            c["profit"] = c["financials"]["net_profit_inr"] if c["financials"] else -float("inf")

            if c["profit"] > highest_profit:
                highest_profit = c["profit"]
                best = c

        if not best or best["profit"] == -float("inf"):
            best = candidates[0]

        crop = best["crop"]
        confidence = best["confidence"]

        if confidence < CONFIDENCE_THRESHOLD:
            fallback_crop = "Wheat" if data.get("soil", {}).get("ph", 0) >= 6 else "Millet"
            fallback_yield = data.get("area", 1.0) * BASELINE_YIELD_PER_HA
            return {
                "crop": fallback_crop,
                "confidence": 0.85,
                "estimated_yield": fallback_yield,
                "financials": calculate_profit(fallback_crop, fallback_yield, data.get("area", 1.0)),
                "analytics": generate_farm_analytics(fallback_crop, data.get("soil", {}), data.get("climate", {}), data.get("area", 1.0)),
                "source": "rule_fallback",
                "model_version": ml_client.model_version,
                "reason": "low_confidence_fallback",
            }

        analytics = generate_farm_analytics(crop, data.get("soil", {}), data.get("climate", {}), data.get("area", 1.0))
        logger.info(f"Selected: {crop} | Profit: {highest_profit}")

        return {
            "crop": crop,
            "confidence": confidence,
            "estimated_yield": best.get("estimated_yield"),
            "financials": best.get("financials"),
            "analytics": analytics,
            "source": "financial_optimization_engine",
            "model_version": ml_client.model_version,
            "reason": "ml_prediction",
        }

    except Exception as e:
        logger.error(f"Decision engine error: {e}")
        return {
            "crop": "Millet",
            "confidence": 0.80,
            "estimated_yield": None,
            "financials": None,
            "analytics": {},
            "source": "rule_fallback_error",
            "model_version": "unknown",
            "reason": "ml_error_fallback",
            "error": str(e),
        }
