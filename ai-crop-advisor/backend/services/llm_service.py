import os
import requests
import logging

logger = logging.getLogger(__name__)


class LLMService:

    def __init__(self):
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = "llama-3.3-70b-versatile"

    def reason_multilingual(self, prompt: str) -> str:
        if not self.api_key:
            return f"📝 (GROQ_API_KEY missing) \n\nRaw Data:\n{prompt}"

        try:
            response = requests.post(
                self.url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}",
                },
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 512,
                    "stream": False,
                },
                timeout=15,
            )

            if response.status_code != 200:
                logger.error(f"Groq API error {response.status_code}: {response.text}")
                return f"📝 (Groq Error: {response.status_code}) \n\nRaw Data:\n{prompt}"

            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                return data["choices"][0]["message"]["content"].strip()

            return f"📝 (Empty response)\n\n{prompt}"

        except requests.exceptions.RequestException as e:
            logger.error(f"Groq connection failed: {e}")
            return f"📝 (Cloud AI Offline)\n\n{prompt}"