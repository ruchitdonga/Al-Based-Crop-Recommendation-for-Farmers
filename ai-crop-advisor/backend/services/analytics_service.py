import logging

logger = logging.getLogger(__name__)

SCALE_OF_FINANCE = {
    "Rice": 60000, "Wheat": 50000, "Cotton": 75000, "Sugarcane": 110000,
    "Millet": 35000, "Maize": 40000, "Jute": 45000, "Groundnut": 55000,
    "Mungbean": 35000, "Pigeonpeas": 45000, "Coffee": 80000, "Lentil": 40000,
    "Blackgram": 35000, "Mothbeans": 30000, "Chickpea": 40000, "Kidneybeans": 40000,
    "Mango": 120000, "Banana": 100000, "Coconut": 90000, "Papaya": 80000,
    "Apple": 150000, "Orange": 100000, "Grapes": 200000, "Watermelon": 50000,
    "Muskmelon": 50000, "Pomegranate": 120000,
}

IDEAL_NPK = {
    "Rice": {"N": 120, "P": 60, "K": 40}, "Wheat": {"N": 120, "P": 60, "K": 40},
    "Cotton": {"N": 150, "P": 60, "K": 60}, "Sugarcane": {"N": 250, "P": 115, "K": 115},
    "Millet": {"N": 60, "P": 30, "K": 30}, "Maize": {"N": 120, "P": 60, "K": 40},
    "Mungbean": {"N": 20, "P": 40, "K": 20}, "Pigeonpeas": {"N": 20, "P": 50, "K": 20},
    "Coffee": {"N": 100, "P": 50, "K": 100}, "Lentil": {"N": 20, "P": 40, "K": 20},
    "Blackgram": {"N": 20, "P": 40, "K": 20}, "Mothbeans": {"N": 20, "P": 40, "K": 20},
    "Chickpea": {"N": 20, "P": 60, "K": 20}, "Kidneybeans": {"N": 20, "P": 60, "K": 20},
    "Groundnut": {"N": 25, "P": 50, "K": 40}, "Jute": {"N": 60, "P": 30, "K": 30},
    "Banana": {"N": 200, "P": 60, "K": 300}, "Coconut": {"N": 50, "P": 35, "K": 120},
    "Papaya": {"N": 200, "P": 200, "K": 200}, "Apple": {"N": 70, "P": 35, "K": 70},
    "Orange": {"N": 600, "P": 200, "K": 100}, "Grapes": {"N": 100, "P": 60, "K": 100},
    "Watermelon": {"N": 80, "P": 60, "K": 60}, "Muskmelon": {"N": 80, "P": 60, "K": 60},
    "Pomegranate": {"N": 60, "P": 30, "K": 60}, "Mango": {"N": 100, "P": 50, "K": 100},
}

WATER_REQ_MM = {
    "Rice": 1200, "Wheat": 450, "Cotton": 700, "Sugarcane": 2000,
    "Millet": 350, "Maize": 600, "Mungbean": 400, "Pigeonpeas": 600,
    "Coffee": 1500, "Lentil": 350, "Blackgram": 400, "Mothbeans": 300,
    "Chickpea": 350, "Kidneybeans": 400, "Groundnut": 500, "Jute": 800,
    "Banana": 1800, "Coconut": 1500, "Papaya": 1500, "Apple": 800,
    "Orange": 900, "Grapes": 600, "Watermelon": 500, "Muskmelon": 500,
    "Pomegranate": 600, "Mango": 800,
}

# Fertilizer bag specifications
UREA_N_PER_BAG = 20.7    # 45kg bag, 46% N
UREA_PRICE = 266
DAP_P_PER_BAG = 23.0     # 50kg bag, 46% P2O5
DAP_PRICE = 1350
MOP_K_PER_BAG = 30.0     # 50kg bag, 60% K2O
MOP_PRICE = 1700


def generate_farm_analytics(crop: str, soil: dict, climate: dict, area: float) -> dict:
    crop_id = crop.capitalize()

    try:
        # KCC Loan (RBI formula: Cost + 10% post-harvest + 20% maintenance)
        sof = SCALE_OF_FINANCE.get(crop_id, 45000)
        crop_cost = sof * area
        post_harvest = crop_cost * 0.10
        maintenance = crop_cost * 0.20

        kcc_loan = {
            "scale_of_finance_per_ha": sof,
            "components": {
                "crop_cost": round(crop_cost, 2),
                "post_harvest_allowance": round(post_harvest, 2),
                "maintenance_allowance": round(maintenance, 2),
            },
            "total_first_year_limit_inr": round(crop_cost + post_harvest + maintenance, 2),
        }

        # Fertilizer deficit
        ideal = IDEAL_NPK.get(crop_id, {"N": 100, "P": 50, "K": 50})
        n_deficit = max(0, ideal["N"] - soil.get("N", 0)) * area
        p_deficit = max(0, ideal["P"] - soil.get("P", 0)) * area
        k_deficit = max(0, ideal["K"] - soil.get("K", 0)) * area

        urea_bags = round(n_deficit / UREA_N_PER_BAG, 1) if n_deficit > 0 else 0
        dap_bags = round(p_deficit / DAP_P_PER_BAG, 1) if p_deficit > 0 else 0
        mop_bags = round(k_deficit / MOP_K_PER_BAG, 1) if k_deficit > 0 else 0
        fert_cost = round((urea_bags * UREA_PRICE) + (dap_bags * DAP_PRICE) + (mop_bags * MOP_PRICE), 2)

        fertilizer = {
            "deficit_kg": {"N": round(n_deficit, 2), "P": round(p_deficit, 2), "K": round(k_deficit, 2)},
            "bags_required": {"urea_45kg": urea_bags, "dap_50kg": dap_bags, "mop_50kg": mop_bags},
            "estimated_cost_inr": fert_cost,
        }

        # Irrigation (1 mm over 1 ha = 10,000 liters)
        ideal_water = WATER_REQ_MM.get(crop_id, 800)
        rainfall = climate.get("rainfall", 0)
        deficit_mm = max(0, ideal_water - rainfall)

        irrigation = {
            "ideal_water_mm": ideal_water,
            "rainfall_mm": round(rainfall, 2),
            "deficit_mm": round(deficit_mm, 2),
            "extra_liters_required": round(deficit_mm * 10000 * area, 2),
        }

        # Pest & disease alerts
        temp = climate.get("temperature", 0)
        hum = climate.get("humidity", 0)
        alerts = []
        if hum > 80 and temp > 28:
            alerts.append("High risk of fungal infections and blight. Pre-emptive fungicide recommended.")
        if hum < 30 and temp > 35:
            alerts.append("Severe heat stress. High probability of aphid and whitefly infestations.")
        if hum > 85 and rainfall > 200:
            alerts.append("Heavy moisture detected. Ensure soil drainage to prevent root rot.")

        return {
            "kcc_loan": kcc_loan,
            "fertilizer": fertilizer,
            "irrigation": irrigation,
            "pest_alerts": alerts,
        }

    except Exception as e:
        logger.error(f"Farm analytics failed: {e}")
        return {}
