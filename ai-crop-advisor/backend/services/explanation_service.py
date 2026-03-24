import logging
from services.llm_service import LLMService

logger = logging.getLogger(__name__)


class ExplanationService:

    def __init__(self):
        self.llm = LLMService()

    def generate(self, crop, soil_ph, confidence=None, reason=None, last_crop=None, lang="en"):
        lang_map = {
            "en": "English",
            "hi": "Hindi (in native Devanagari script, NOT English letters)",
            "mr": "Marathi (in native Devanagari script, NOT English letters)",
            "gu": "Gujarati (in native Gujarati script, NOT English letters)",
        }
        language = lang_map.get(lang, "English")

        note = ""
        if confidence and confidence > 0.8:
            note = "The AI model is highly confident in this recommendation."
        elif confidence and confidence < 0.5:
            note = "This is a safe fallback recommendation due to unusual soil data."

        script_rule = ""
        if lang != "en":
            script_rule = """
- Use native script (Devanagari, Gujarati). Do not use English characters.
- Translate crop names properly (e.g., 'गहू' for Wheat, 'तांदूळ' for Rice)."""

        prompt = f"""You are an AI agricultural assistant. Output exactly 3 sentences in {language}.
No greetings, no pleasantries, no filler. Do not use words like 'अरे', 'नमस्कार', or 'मित्रा'.
Start immediately with the recommendation.

FACTS TO INCLUDE:
1. Recommend {crop} as an excellent choice for their field. {note}
2. Explain briefly that a soil pH of {soil_ph} is ideal for {crop}.
3. Provide one technical land preparation tip considering they previously grew {last_crop or 'nothing'}.

RULES:
- Use formal, standard agricultural vocabulary.{script_rule}

OUTPUT (3 SENTENCES IN {language}):"""

        try:
            reply = self.llm.reason_multilingual(prompt)
            cleaned = reply.replace("*", "").replace("#", "").strip()
            if "📝" in cleaned:
                raise Exception("LLM unavailable")
            return cleaned
        except Exception as e:
            logger.error(f"Explanation generation failed: {e}")

        return f"Based on your soil pH of {soil_ph}, planting {crop} is highly recommended to maximize yield."