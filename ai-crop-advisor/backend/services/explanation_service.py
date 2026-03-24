import logging
from services.llm_service import LLMService

logger = logging.getLogger(__name__)

class ExplanationService:

    def __init__(self):
        self.llm = LLMService()

    def generate(self, crop, soil_ph, confidence=None, reason=None, last_crop=None, lang="en"):
        lang_names = {
            "en": "English",
            "hi": "Hindi (in native Devanagari script, NOT English letters)",
            "mr": "Marathi (in native Devanagari script, NOT English letters)",
            "gu": "Gujarati (in native Gujarati script, NOT English letters)"
        }
        language = lang_names.get(lang, "English")

        confidence_context = ""
        if confidence:
            if confidence > 0.8:
                confidence_context = "The AI model is highly confident in this recommendation based on local data."
            elif confidence < 0.5:
                confidence_context = "The soil data was unusual, so this is a highly safe, rule-based fallback recommendation."
            else:
                confidence_context = "The model is moderately confident in this crop."

        prompt = f"""
You are an AI agricultural assistant. Output exactly 3 sentences in {language}. 
No greetings, no pleasantries, no conversational filler. Do not use words like 'अरे', 'नमस्कार', or 'मित्रा'.
Start immediately with the recommendation.

FACTS TO INCLUDE:
1. Recommend {crop} as an excellent choice for their field.
2. Explain briefly that a soil pH of {soil_ph} is ideal for {crop}.
3. Provide one technical land preparation tip considering they previously grew {last_crop if last_crop else 'nothing'}.

RULES:
- Use formal, standard agricultural vocabulary (e.g., 'प्रमाण मराठी', 'शुद्ध हिंदी').
- Use the native script (Devanagari, Gujarati script). Do not use English characters.
- Translate crop names properly (e.g., 'गहू' for Wheat, 'भात' or 'तांदूळ' for Rice).

OUTPUT (3 SENTENCES IN {language}):
""".strip()

        try:
            raw_reply = self.llm.reason_multilingual(prompt)
            # Clean up the output to ensure plain text
            cleaned = raw_reply.replace("*", "").replace("#", "").strip()
            
            # If the LLM connection fails, llm_service prepends "📝"
            if "📝" in cleaned and "(API Error" in cleaned:
                raise Exception("LLM offline")
                
            return cleaned
        except Exception as e:
            logger.error(f"LLM explanation generation failed: {str(e)}")
            
        # Extremely reliable static fallback if the cloud AI goes offline
        return f"Based on your farm's soil pH of {soil_ph}, planting {crop} is highly recommended right now to maximize your yield!"