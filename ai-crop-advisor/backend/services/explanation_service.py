"""
Explanation Service

Builds reasoning prompt and sends to LLM.
"""

from services.llm_service import LLMService


class ExplanationService:

    def __init__(self):
        self.llm = LLMService()

    def generate(self, crop: str, soil_ph: float, last_crop: str | None):
        """
        Create explanation prompt and send to LLM.
        """

        prompt = (
            f"A farmer has soil pH {soil_ph}. "
            f"The previous crop was {last_crop}. "
            f"Explain simply why {crop} is recommended."
        )

        explanation = self.llm.generate_explanation(prompt)

        return explanation
