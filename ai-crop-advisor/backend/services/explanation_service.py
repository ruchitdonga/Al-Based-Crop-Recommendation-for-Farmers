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

    def generate(self, crop, soil_ph, last_crop=None, lang="en"):

        base_text = self.template.build(
            crop=crop,
            soil_ph=soil_ph,
            lang=lang
        )

        try:
            return self.polish(base_text, lang)
        except Exception as e:
            logger.error(f"LLM polish failed: {str(e)}")
            return base_text