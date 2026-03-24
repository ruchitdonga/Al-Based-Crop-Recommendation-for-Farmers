import logging
from datetime import datetime
from services.ml_client import get_ml_client
from services.profit_service import calculate_profit

CONFIDENCE_THRESHOLD = 0.4

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
            "crop_year": data.get("crop_year", 2024)
        }

        # Log input features
        logger.info(f"Decision engine input - Soil: {data.get('soil')}, Climate: {data.get('climate')}")

        # Fetch the TOP 5 most biologically suitable crops for this soil chemistry
        top_candidates = ml_client.predict_top_k(features, k=5)
        
        best_candidate = None
        highest_profit = -float('inf')

        # Simulate the Economic Returns for all 5 crops concurrently
        for candidate in top_candidates:
            crop_name = candidate["crop"]
            yield_tonnes = candidate["estimated_yield"]
            
            financials = None
            profit = -float('inf')
            
            if yield_tonnes is not None:
                financials = calculate_profit(crop_name, yield_tonnes, features["area"])
                if financials:
                    profit = financials["net_profit_inr"]
            
            candidate["financials"] = financials
            candidate["profit"] = profit
            
            # The Economic Optimizer forces the final recommendation to be the one that maximizes financial returns
            if profit > highest_profit:
                highest_profit = profit
                best_candidate = candidate

        # If strict fallback needed (e.g., no financially viable options were modeled or the financial API fails)
        if not best_candidate or best_candidate["profit"] == -float('inf'):
            best_candidate = top_candidates[0] # Default natively back to the highest biological match

        crop = best_candidate["crop"]
        confidence = best_candidate["confidence"]
        financials = best_candidate.get("financials")

        # Confidence fallback logic
        if confidence < CONFIDENCE_THRESHOLD:
            soil_ph = data.get("soil", {}).get("ph")
            crop = "Wheat" if soil_ph and soil_ph >= 6 else "Millet"

            return {
                "crop": crop,
                "confidence": confidence,
                "source": "rule_fallback_low_confidence",
                "model_version": ml_client.model_version,
                "reason": "low_confidence_fallback"
            }

        logger.info(
            f"Financial Optimizer Selected: "
            f"Crop: {crop}, "
            f"Confidence: {confidence}, "
            f"Maximum Simulated Profit: {highest_profit}"
        )

        return {
            "crop": crop,
            "confidence": confidence,
            "estimated_yield": best_candidate.get("estimated_yield"),
            "financials": financials,
            "source": "financial_optimization_engine",
            "model_version": ml_client.model_version,
            "reason": "ml_prediction"
        }

    except Exception as e:
        logger.error(f"ML error fallback triggered - Error: {str(e)}")
        return {
            "crop": "Millet",
            "confidence": 0.0,
            "source": "rule_fallback_error",
            "model_version": "unknown",
            "reason": "ml_error_fallback",
            "error": str(e)
        }
