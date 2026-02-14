"""
LLM Service

Connects backend to local Ollama LLM.
"""

import requests


class LLMService:

    def __init__(self):
        self.url = "http://localhost:11434/api/generate"
        self.model = "phi3"

    def generate_explanation(self, prompt: str) -> str:
        """
        Send prompt to local LLM using Ollama.
        """

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }

        try:
            response = requests.post(self.url, json=payload, timeout=30)
            response.raise_for_status()

            data = response.json()
            return data.get("response", "").strip()

        except Exception:
            # fallback if LLM not running
            return "[LLM unavailable] Explanation service offline."
