"""
ML CLIENT LAYER

Purpose:
- Acts as interface between backend and ML engine
- Backend NEVER talks directly to ML code
- ML can change without breaking API
"""


class MLClient:
    """
    Handles communication with ML recommendation model.
    """

    def __init__(self):
        # future: load model or API connection
        pass

    def predict(self, input_data: dict) -> dict:
        """
        Expected ML input:
        {
            "soil_ph": float,
            "last_crop": str
        }

        Expected ML output:
        {
            "crop": str,
            "yield": float,
            "profit": float,
            "confidence": float
        }
        """

        # TEMPORARY PLACEHOLDER
        # ML integration will happen later

        return {
            "crop": None,
            "yield": None,
            "profit": None,
            "confidence": None,
            "source": "ml_stub"
        }
