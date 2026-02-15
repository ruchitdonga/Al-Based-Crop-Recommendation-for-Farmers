"""
ML CONTRACT

Defines communication format between
Backend and ML Engine.
"""

class MLContract:

    INPUT_SCHEMA = {
        "N": float,
        "P": float,
        "K": float,
        "temperature": float,
        "humidity": float,
        "ph": float,
        "rainfall": float,
    }

    OUTPUT_SCHEMA = {
        "crop": str

    }

    @classmethod
    def validate_input(cls, data: dict):
        for key, expected_type in cls.INPUT_SCHEMA.items():
            if key not in data:
                raise ValueError(f"Missing ML input key: {key}")
            if not isinstance(data[key], expected_type):
                raise TypeError(f"Invalid type for {key}")

    @classmethod
    def validate_output(cls, data: dict):
        for key, expected_type in cls.OUTPUT_SCHEMA.items():
            if key not in data:
                raise ValueError(f"Missing ML output key: {key}")
            if not isinstance(data[key], expected_type):
                raise TypeError(f"Invalid type for {key}")