from dataclasses import dataclass

@dataclass
class CropInput:
    nitrogen: float        # N (kg/ha)
    phosphorus: float      # P (kg/ha)
    potassium: float       # K (kg/ha)
    temperature: float     # Celsius
    humidity: float        # %
    ph: float              # soil pH
    rainfall: float        # mm

@dataclass
class CropRecommendationOutput:
 crop: str
 confidence: float