import requests
import json

url = "http://127.0.0.1:8000/api/recommend/"
payload = {
    "soil": {
        "N": 90,
        "P": 42,
        "K": 43,
        "ph": 6.5
    },
    "climate": {
        "temperature": 25.0,
        "humidity": 80.0,
        "rainfall": 200.0
    },
    "area": 2.5,
    "pesticide": 15.0,
    "state": "Maharashtra",
    "season": "Kharif"
}

try:
    response = requests.post(url, json=payload, timeout=10)
    print("Status:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Error:", e)
