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
You are an expert AI Crop Advisor for Indian farmers.
A farmer has requested a crop recommendation.
Our backend Machine Learning models have analyzed their soil and climate data.

DATA:
- Recommended Crop: {crop}
- Soil pH: {soil_ph}
- Previous Crop Grown: {last_crop if last_crop else 'None/Unknown'}
- Confidence Note: {confidence_context}

Tell the farmer in {language} why this crop is a fantastic choice for their soil. 
Provide 1 or 2 practical tips for land preparation considering the previous crop or soil pH.
Keep it extremely encouraging, highly respectful, and exactly 3 to 4 short sentences.
Do NOT use markdown headers, asterisks, or bullet points. Speak naturally in plain text.

CRITICAL INSTRUCTION: 
- If requested to speak Hindi, Marathi, or Gujarati, you MUST reply entirely in the native writing script for that language (e.g., Devanagari). 
- Use strictly formal, highly professional agricultural language (e.g., 'प्रमाण मराठी' for Marathi, 'शुद्ध हिंदी' for Hindi). 
- NEVER use casual greetings like 'अरे', 'भाई', or 'Hello'. NEVER transliterate English words (like writing 'व्हीट' instead of 'गहू').

REPLY DIRECTLY TO THE FARMER IN {language}:
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