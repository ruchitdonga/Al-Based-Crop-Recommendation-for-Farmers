import requests


class LLMService:

    def __init__(self):
        self.url = "http://localhost:11434/api/generate"
        self.model = "llama3.1"

    def reason_multilingual(self, prompt: str) -> str:

        response = requests.post(
            self.url,
            headers={"Content-Type": "application/json"},
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False,
            },
            timeout=120,
        )

        if response.status_code != 200:
            raise Exception(
                f"Ollama error {response.status_code}: {response.text}"
            )

        return response.json()["response"].strip()