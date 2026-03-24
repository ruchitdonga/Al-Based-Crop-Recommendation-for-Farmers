import os
import requests
import logging

logger = logging.getLogger(__name__)

class LLMService:

    def __init__(self):
        # Using Groq's shockingly fast and extremely reliable free Inference API
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        self.api_key = os.getenv("GROQ_API_KEY")
        # Switching to Google's Gemma 2 9B! It is explicitly heavily trained on Indian languages and natively supports formal Marathi/Hindi without hallucinating "Hey brother".
        self.model = "gemma2-9b-it"

    def reason_multilingual(self, prompt: str) -> str:
        try:
            if not self.api_key:
                return f"📝 (Warning: GROQ_API_KEY missing from Hugo Space settings) \n\nRaw Data:\n{prompt}"

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }

            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 512,
                "stream": False
            }

            response = requests.post(
                self.url,
                headers=headers,
                json=payload,
                timeout=15, 
            )

            if response.status_code != 200:
                print(f"Groq API error {response.status_code}: {response.text}")
                return f"📝 (Groq Error: {response.status_code} - {response.text}) \n\nRaw Data:\n{prompt}"

            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                return data["choices"][0]["message"]["content"].strip()
                
            return f"📝 (Unpolished Output)\n\n{prompt}"
            
        except requests.exceptions.RequestException as e:
            print(f"Groq LLM connection failed: {e}")
            return f"📝 (Unpolished Output - Cloud AI Offline)\n\n{prompt}"