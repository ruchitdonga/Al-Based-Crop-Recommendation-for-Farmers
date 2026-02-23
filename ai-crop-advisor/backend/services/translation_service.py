"""
Translation Service using Llama (Ollama)

Uses same LLM server but strict translation prompt.
"""

from services.llm_service import LLMService


class TranslationService:

    LANGUAGE_NAMES = {
        "hi": "Hindi",
        "mr": "Marathi",
        "gu": "Gujarati",
    }

    def __init__(self):
        self.llm = LLMService()

    # ---------------------------------
    # Translation Prompt
    # ---------------------------------
    def build_translation_prompt(self, text, target_lang):

        lang_name = self.LANGUAGE_NAMES.get(target_lang)

        if not lang_name:
            return text

        return f"""
You are a professional translator.

Translate the text into {lang_name}.

STRICT RULES:
- Translate ONLY.
- Do NOT explain.
- Do NOT add information.
- Keep same number of sentences.
- Preserve meaning exactly.
- Simple farmer-friendly language.

TEXT:
{text}

OUTPUT ONLY TRANSLATED TEXT.
""".strip()

    # ---------------------------------
    # Translate
    # ---------------------------------
    def translate(self, text: str, target_lang: str):

        if target_lang == "en":
            return text

        prompt = self.build_translation_prompt(text, target_lang)

        translated = self.llm.reason(prompt)

        return translated.strip()