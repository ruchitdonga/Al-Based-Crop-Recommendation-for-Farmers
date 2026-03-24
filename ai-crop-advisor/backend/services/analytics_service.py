import logging

logger = logging.getLogger(__name__)

# Basic Scale of Finance (SOF) per Hectare for KCC Loan Estimation (INR)
# Values represent average Indian benchmarks for 2024
SCALE_OF_FINANCE = {
    "Rice": 60000,
    "Wheat": 50000,
    "Cotton": 75000,
    "Sugarcane": 110000,
    "Millet": 35000,
    "Maize": 40000,
    "Jute": 45000,
    "Groundnut": 55000,
    "Mungbean": 35000,
    "Pigeonpeas": 45000,
    "Mango": 120000,
}

# Ideal NPK required per hectare (kg/ha)
IDEAL_NPK = {
    "Rice": {"N": 120, "P": 60, "K": 40},
    "Wheat": {"N": 120, "P": 60, "K": 40},
    "Cotton": {"N": 150, "P": 60, "K": 60},
    "Sugarcane": {"N": 250, "P": 115, "K": 115},
    "Millet": {"N": 60, "P": 30, "K": 30},
    "Maize": {"N": 120, "P": 60, "K": 40},
    "Mungbean": {"N": 20, "P": 40, "K": 20}, # Legumes need less N
    "Pigeonpeas": {"N": 20, "P": 50, "K": 20},
}

# Total water requirement in mm per crop cycle
WATER_REQ_MM = {
    "Rice": 1200,
    "Wheat": 650,
    "Cotton": 900,
    "Sugarcane": 2000,
    "Millet": 350,
    "Maize": 600,
    "Mungbean": 400,
    "Pigeonpeas": 600,
}

def generate_farm_analytics(crop: str, soil: dict, climate: dict, area: float) -> dict:
    crop_id = crop.capitalize()
    analytics = {}

    try:
        # 1. KCC Loan Capacity (Using official RBI formula)
        # Total Limit = (SOF x Area) + 10% Post-Harvest + 20% Maintenance
        sof = SCALE_OF_FINANCE.get(crop_id, 45000)
        crop_cost = sof * area
        post_harvest = crop_cost * 0.10
        maintenance = crop_cost * 0.20
        total_kcc_limit = crop_cost + post_harvest + maintenance
        
        analytics["kcc_loan"] = {
            "scale_of_finance_per_ha": sof,
            "components": {
                "crop_cost": round(crop_cost, 2),
                "post_harvest_allowance": round(post_harvest, 2),
                "maintenance_allowance": round(maintenance, 2),
            },
            "total_first_year_limit_inr": round(total_kcc_limit, 2)
        }

        # 2. Fertilizer Deficit & Cost Estimator
        ideal = IDEAL_NPK.get(crop_id, {"N": 100, "P": 50, "K": 50})
        
        # Calculate raw elemental deficiency (kg/ha) across total area
        n_deficit = max(0, ideal["N"] - soil.get("N", 0)) * area
        p_deficit = max(0, ideal["P"] - soil.get("P", 0)) * area
        k_deficit = max(0, ideal["K"] - soil.get("K", 0)) * area
        
        # Standard formulations:
        # Urea (46% N, 45kg bag @ ~₹266/bag) -> 20.7kg N per bag
        urea_bags = round((n_deficit / 20.7), 1) if n_deficit > 0 else 0
        # DAP (18% N, 46% P, 50kg bag @ ~₹1350/bag) -> 23kg P per bag
        dap_bags = round((p_deficit / 23.0), 1) if p_deficit > 0 else 0
        # MOP (60% K, 50kg bag @ ~₹1700/bag) -> 30kg K per bag
        mop_bags = round((k_deficit / 30.0), 1) if k_deficit > 0 else 0

        fertilizer_cost = (urea_bags * 266) + (dap_bags * 1350) + (mop_bags * 1700)

        analytics["fertilizer"] = {
            "deficit_kg": {
                "N": round(n_deficit, 2),
                "P": round(p_deficit, 2),
                "K": round(k_deficit, 2)
            },
            "bags_required": {
                "urea_45kg": urea_bags,
                "dap_50kg": dap_bags,
                "mop_50kg": mop_bags
            },
            "estimated_cost_inr": round(fertilizer_cost, 2)
        }

        # 3. Irrigation Estimator
        ideal_water = WATER_REQ_MM.get(crop_id, 800)
        rainfall = climate.get("rainfall", 0)
        
        # Assuming payload 'rainfall' is the seasonal/yearly average provided in the dataset
        deficit_mm = max(0, ideal_water - rainfall)
        
        # Hydrology formula: 1 mm of rain over 1 hectare = 10,000 liters
        extra_liters = deficit_mm * 10000 * area
        
        analytics["irrigation"] = {
            "ideal_water_mm": ideal_water,
            "rainfall_mm": round(rainfall, 2),
            "deficit_mm": round(deficit_mm, 2),
            "extra_liters_required": round(extra_liters, 2)
        }

        # 4. Pest & Disease Alert Heuristics
        temp = climate.get("temperature", 0)
        hum = climate.get("humidity", 0)
        alerts = []
        
        if hum > 80 and temp > 28:
            alerts.append("High risk of fungal infections and blight due to severe heat and humidity. Pre-emptive fungicide application highly recommended.")
        elif hum < 30 and temp > 35:
            alerts.append("Severe heat stress detected. High probability of aphid and whitefly infestations.")
        elif hum > 85 and rainfall > 200:
            alerts.append("Heavy moisture detected. Soil drainage is critical to prevent root rot.")
            
        analytics["pest_alerts"] = alerts

        return analytics

    except Exception as e:
        logger.error(f"Failed to generate farm analytics: {str(e)}")
        return {}
