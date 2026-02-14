"""
LLM Service

Handles interaction with local LLM models.
Currently uses a stub response.
Later connects to local model (Ollama / GGUF / llama.cpp).
"""


class LLMService:

    def generate_explanation(self, prompt: str) -> str:
        """
        Generate explanation using local LLM.

        Currently returns simulated response.
        """

        # TEMP STUB (replace with real LLM later)
        return f"[LLM Explanation] {prompt}"
