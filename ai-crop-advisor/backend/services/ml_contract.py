"""
ML CONTRACT

Defines communication format between
Backend and ML Engine.

Derived from synthetic_agro_scenarios dataset.
"""

# Fields backend will send to ML model
ML_INPUT_SCHEMA = {
    "N": float,
    "P": float,
    "K": float,
    "temperature": float,
    "humidity": float,
    "ph": float,
    "rainfall": float,
}

# Expected ML response
ML_OUTPUT_SCHEMA = {
    "crop": str
}
