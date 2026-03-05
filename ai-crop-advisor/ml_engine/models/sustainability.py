class SustainabilityModel:

    @staticmethod
    def compute(input_data: dict) -> float:
        score = 1.0

        # Penalize excessive nitrogen
        if input_data["N"] > 100:
            score -= 0.2

        # Penalize extreme pH
        if input_data["ph"] < 5.5 or input_data["ph"] > 7.5:
            score -= 0.2

        # Reward moderate rainfall
        if 100 <= input_data["rainfall"] <= 300:
            score += 0.1

        return round(max(min(score, 1.0), 0.0), 3)