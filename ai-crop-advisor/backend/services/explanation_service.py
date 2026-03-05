import logging
from services.llm_service import LLMService
from services.explanation_template import ExplanationTemplate


logger = logging.getLogger(__name__)


class ExplanationService:

    def __init__(self):
        self.llm = LLMService()
        self.template = ExplanationTemplate()

    def polish(self, text: str, lang: str):

        prompt = f"""
You are a text rewriter.

Rewrite the text to improve fluency slightly.

STRICT RULES:
- Output ONLY the rewritten text.
- Do NOT add explanations.
- Do NOT add bullet points.
- Do NOT add headers.
- Do NOT mention what you changed.
- Keep the same number of sentences.
- Do not change numbers.
- Do not add information.
- Same language.

TEXT:
{text}

FINAL OUTPUT (only rewritten text):
""".strip()

        response = self.llm.reason_multilingual(prompt)
        cleaned = response.strip()

        # Safety filter: keep only numbered explanation lines
        lines = cleaned.splitlines()
        valid_lines = [
            line.strip()
            for line in lines
            if line.strip().startswith("1.") or line.strip().startswith("2.")
        ]

        if valid_lines:
            return " ".join(valid_lines)

        return cleaned

    def generate(self, crop, soil_ph, confidence=None, reason=None, last_crop=None, lang="en"):

        base_text = self.template.build(
            crop=crop,
            soil_ph=soil_ph,
            lang=lang
        )

        # Add context-aware message based on reason and confidence
        reason_messages = {
            "en": {
                "low_confidence_fallback": " The model confidence was low, so a rule-based fallback recommendation was applied.",
                "ml_error_fallback": " The ML system encountered an issue, so a fallback recommendation was provided.",
                "ml_prediction_high": " The model is highly confident in this recommendation.",
                "ml_prediction_moderate": " The model shows moderate confidence in this recommendation."
            },
            "hi": {
                "low_confidence_fallback": " मॉडल का आत्मविश्वास कम था, इसलिए एक नियम-आधारित फ़ॉलबैक सिफारिश लागू की गई।",
                "ml_error_fallback": " ML सिस्टम को एक समस्या का सामना करना पड़ा, इसलिए एक फ़ॉलबैक सिफारिश प्रदान की गई।",
                "ml_prediction_high": " मॉडल इस सिफारिश में अत्यधिक आत्मविश्वासी है।",
                "ml_prediction_moderate": " मॉडल इस सिफारिश में मध्यम आत्मविश्वास दिखाता है।"
            },
            "mr": {
                "low_confidence_fallback": " मॉडेलचा आत्मविश्वास कमी होता, म्हणून नियम-आधारित फॉलबॅक शिफारस लागू केली गेली।",
                "ml_error_fallback": " ML सिस्टमला समस्या आली, म्हणून फॉलबॅक शिफारस दिली गेली।",
                "ml_prediction_high": " मॉडेल या सुचनेसाठी अत्यंत आत्मविश्वासी आहे।",
                "ml_prediction_moderate": " मॉडेल या सुचनेसाठी मध्यम आत्मविश्वास दर्शविते।"
            },
            "gu": {
                "low_confidence_fallback": " મોડેલનો આત્મવિશ્વાસ ઓછો હતો, તેથી નિયમ-આધારિત ફૉલબેક ભલામણ લાગુ કરવામાં આવી।",
                "ml_error_fallback": " ML સિસ્ટમને સમસ્યાનો સામना કરવો પડ્યો, તેથી ફૉલબેક ભલામણ આપવામાં આવી।",
                "ml_prediction_high": " મોડેલ આ ભલામણમાં અત્યંત આત્મવિશ્વાસી છે।",
                "ml_prediction_moderate": " મોડેલ આ ભલામણમાં મધ્યમ આત્મવિશ્વાસ દર્શાવે છે।"
            }
        }

        messages = reason_messages.get(lang, reason_messages["en"])

        # Determine additional message based on reason and confidence
        additional_message = ""

        if reason == "low_confidence_fallback":
            additional_message = messages["low_confidence_fallback"]
        elif reason == "ml_error_fallback":
            additional_message = messages["ml_error_fallback"]
        elif reason == "ml_prediction":
            if confidence is not None and confidence > 0.8:
                additional_message = messages["ml_prediction_high"]
            elif confidence is not None and confidence >= 0.5:
                additional_message = messages["ml_prediction_moderate"]

        base_text = f"{base_text}{additional_message}"

        try:
            return self.polish(base_text, lang)
        except Exception as e:
            logger.error(f"LLM polish failed: {str(e)}")
            return base_text