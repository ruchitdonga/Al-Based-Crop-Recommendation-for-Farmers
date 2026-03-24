import logging

logger = logging.getLogger(__name__)

MSP_PER_QUINTAL = {
    "Rice": 2300, "Wheat": 2275, "Cotton": 6620, "Millet": 3180,
    "Maize": 2090, "Sugarcane": 315, "Jute": 5050, "Groundnut": 6377,
    "Pigeonpeas": 7000, "Mothbeans": 7100, "Mungbean": 8558,
    "Blackgram": 6950, "Lentil": 6425, "Chickpea": 5440, "Kidneybeans": 6000,
    "Pomegranate": 12000, "Banana": 4000, "Mango": 8000, "Grapes": 15000,
    "Watermelon": 2000, "Muskmelon": 3000, "Apple": 10000, "Orange": 6000,
    "Papaya": 2500, "Coconut": 12000, "Coffee": 25000,
}

COST_PER_HECTARE = {
    "Rice": 45000, "Wheat": 35000, "Cotton": 60000, "Millet": 25000,
    "Maize": 30000, "Sugarcane": 120000, "Jute": 40000, "Groundnut": 50000,
    "Pigeonpeas": 30000, "Mothbeans": 25000, "Mungbean": 28000,
    "Blackgram": 28000, "Lentil": 30000, "Chickpea": 28000, "Kidneybeans": 30000,
    "Pomegranate": 200000, "Banana": 150000, "Mango": 100000, "Grapes": 300000,
    "Watermelon": 60000, "Muskmelon": 65000, "Apple": 250000, "Orange": 120000,
    "Papaya": 100000, "Coconut": 80000, "Coffee": 150000,
}


def calculate_profit(crop: str, yield_tonnes: float, area_hectares: float) -> dict:
    msp = MSP_PER_QUINTAL.get(crop.capitalize(), 3000)
    cost_ha = COST_PER_HECTARE.get(crop.capitalize(), 40000)

    try:
        if (yield_tonnes / max(area_hectares, 0.01)) < 3.5:
            yield_tonnes = area_hectares * 3.5

        yield_quintals = yield_tonnes * 10
        gross_revenue = round(float(yield_quintals * msp), 2)
        total_cost = round(float(cost_ha * area_hectares), 2)
        net_profit = round(float(gross_revenue - total_cost), 2)

        return {
            "gross_revenue_inr": gross_revenue,
            "estimated_cost_inr": total_cost,
            "net_profit_inr": net_profit,
            "msp_per_quintal_used": msp,
        }
    except Exception as e:
        logger.error(f"Profit calculation failed for {crop}: {e}")
        return None
