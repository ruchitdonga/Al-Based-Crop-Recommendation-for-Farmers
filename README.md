<div align="center">

# 🌾 AI-Based Crop Recommendation for Farmers

**An intelligent, multilingual crop advisory platform powered by Machine Learning and LLM-based AI.**

[![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-REST_Framework-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-Yield_Prediction-FF6600?style=for-the-badge)](https://xgboost.readthedocs.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

*Empowering farmers with data-driven crop decisions — in their own language.*

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Deployment](#docker-deployment)
- [API Reference](#-api-reference)
- [ML Pipeline](#-ml-pipeline)
- [Multilingual Support](#-multilingual-support)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌱 About the Project

AI Crop Advisor is a full-stack intelligent agricultural platform designed to help farmers make the best possible crop choices based on their **soil conditions**, **climate data**, **region**, and **season**. 

The system combines a **scikit-learn classification pipeline** for crop recommendations with an **XGBoost yield prediction model**, a **Groq-powered LLM (Llama 3.3 70B)** for natural-language advisory, and a **React-based progressive web app** with voice interaction support — all served from a **Django REST API**.

> Built with Indian agriculture in mind, supporting farmers across Maharashtra, Gujarat, and other states.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Crop Recommendation** | ML model predicts the best crop(s) based on N, P, K, pH, temperature, humidity, and rainfall |
| 📈 **Yield Prediction** | XGBoost model estimates expected yield (tonnes/ha) per crop per region |
| 💰 **Financial Analytics** | Profit estimations and cost analysis for recommended crops |
| 🧠 **LLM Advisory Chat** | Groq-powered Llama 3.3 70B chatbot for natural-language farming advice |
| 🎙️ **Voice Interaction** | Voice input/output support for farmers with limited literacy |
| 🌐 **Multilingual UI** | Supports English, Hindi (हिंदी), Marathi (मराठी), and Gujarati (ગુજરાતી) |
| 📊 **Analytics Dashboard** | Visual insights including top-K crop rankings and confidence scores |
| 📡 **Offline Support** | Progressive Web App architecture with offline fallback |
| 🐳 **Dockerized** | Fully containerized for easy deployment (Hugging Face Spaces / cloud) |
| 🗺️ **Map Integration** | Leaflet-based interactive map for location-aware recommendations |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19)                  │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐  │
│  │ CropForm │  │ Dashboard  │  │VoiceChat │  │   i18n   │  │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (JSON)
┌─────────────────────────▼───────────────────────────────────┐
│                    BACKEND (Django REST)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ /recommend/  │  │   /chat/     │  │   /model-info/     │ │
│  └──────┬───────┘  └──────┬───────┘  └────────────────────┘ │
│         │                 │                                  │
│  ┌──────▼───────┐  ┌──────▼───────┐                         │
│  │ DecisionEng. │  │  LLM Service │                         │
│  │  ML Client   │  │ (Groq API)   │                         │
│  └──────┬───────┘  └──────────────┘                         │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│                      ML ARTIFACTS                           │
│   crop_pipeline.pkl (sklearn)  │  yield_models.pkl (XGBoost)│
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.10** | Core runtime |
| **Django + DRF** | REST API framework |
| **drf-spectacular** | Auto-generated OpenAPI docs |
| **scikit-learn** | Crop classification pipeline |
| **XGBoost** | Yield prediction model |
| **Groq API (Llama 3.3 70B)** | LLM-based advisory chatbot |
| **joblib** | Model serialization |
| **pandas / numpy** | Feature engineering |
| **Gunicorn + WhiteNoise** | Production serving |
| **SQLite / PostgreSQL** | Session & data storage |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **React Router v6** | Client-side routing |
| **Framer Motion** | Animations & page transitions |
| **Leaflet / react-leaflet** | Interactive maps |
| **lucide-react** | Icon library |
| **react-dropzone** | File upload (soil reports/PDFs) |
| **Web Speech API** | Voice input/output |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Hugging Face Spaces** | Hosting platform |
| **Vercel** | Frontend deployment option |

---

## 📁 Project Structure

```
Al-Based-Crop-Recommendation-for-Farmers/
├── Dockerfile                   # Root Docker config (Hugging Face Spaces)
├── .dockerignore
├── ai-crop-advisor/
│   ├── backend/                 # Django REST API
│   │   ├── config/              # Django settings & WSGI
│   │   ├── recommendations/     # Core app (views, serializers, URLs)
│   │   ├── services/            # Business logic layer
│   │   │   ├── ml_client.py         # sklearn + XGBoost inference
│   │   │   ├── decision_engine.py   # Crop decision orchestrator
│   │   │   ├── llm_service.py       # Groq LLM integration
│   │   │   ├── analytics_service.py # ML analytics & insights
│   │   │   ├── explanation_service.py # Human-readable explanations
│   │   │   ├── profit_service.py    # Financial projections
│   │   │   ├── translation_service.py # i18n support
│   │   │   └── session_history.py   # Recommendation history
│   │   ├── models/              # Trained ML artifacts (gitignored)
│   │   ├── data/                # Training datasets
│   │   └── requirements.txt
│   ├── frontend/
│   │   └── web/                 # React application
│   │       └── src/
│   │           ├── pages/       # CropForm, Home, Features, HowItWorks
│   │           ├── components/  # Navbar, Dashboard, VoiceChat, etc.
│   │           └── i18n/        # Multilingual context & translations
│   ├── ml_engine/               # Standalone ML module
│   │   ├── models/              # CropSuitabilityModel, YieldPredictor
│   │   ├── trainers/            # Model training scripts
│   │   ├── explainability/      # SHAP / feature importance
│   │   └── decision_engine.py   # Engine entry point
│   └── docs/                    # Architecture & design docs
```

---

## 🚀 Getting Started

### Prerequisites

- Python **3.10+**
- Node.js **18+** and npm
- Docker (optional, for containerized deployment)
- A **Groq API Key** for the LLM chatbot ([Get one free](https://console.groq.com/))

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/ruchitdonga/Al-Based-Crop-Recommendation-for-Farmers.git
cd Al-Based-Crop-Recommendation-for-Farmers/ai-crop-advisor/backend

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
# Create a .env file in the backend directory:
echo GROQ_API_KEY=your_groq_api_key_here > .env
echo SECRET_KEY=your_django_secret_key_here >> .env
echo DEBUG=True >> .env

# 5. Apply migrations
python manage.py migrate

# 6. Run the development server
python manage.py runserver
```

The backend will be available at **http://127.0.0.1:8000**

> **Note:** Place your trained model artifacts (`crop_pipeline.pkl`, `yield_models.pkl`) inside the `backend/models/` directory before starting the server.

---

### Frontend Setup

```bash
# From the repository root
cd ai-crop-advisor/frontend/web

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at **http://localhost:3000**

The React app is pre-configured with a proxy to `http://127.0.0.1:8000`, so API calls work seamlessly during development.

---

### Docker Deployment

The project includes a production-ready `Dockerfile` configured for **Hugging Face Spaces** (port 7860).

```bash
# Build the image
docker build -t ai-crop-advisor .

# Run locally
docker run -p 7860:7860 \
  -e GROQ_API_KEY=your_key_here \
  -e SECRET_KEY=your_secret_key \
  ai-crop-advisor
```

Access the app at **http://localhost:7860**

---

## 📡 API Reference

The API is self-documenting via **OpenAPI / Swagger** at `/api/schema/swagger-ui/`.

### `POST /api/recommend/`

Get AI crop recommendations based on soil and climate inputs.

**Request Body:**
```json
{
  "soil": {
    "N": 80,
    "P": 40,
    "K": 50,
    "ph": 6.8
  },
  "climate": {
    "temperature": 28.5,
    "humidity": 75.0,
    "rainfall": 200.0
  },
  "last_crop": "Wheat",
  "state": "Maharashtra",
  "season": "Kharif",
  "area": 2.5,
  "crop_year": 2024,
  "lang": "en"
}
```

**Response:**
```json
{
  "recommendation": {
    "crop": "Rice",
    "confidence": 0.92,
    "estimated_yield": 3.4,
    "financials": { ... }
  },
  "analytics": { "top_crops": [...] },
  "explanation": "Rice is highly suitable for your soil...",
  "source": "sklearn_pipeline",
  "model_version": "v1.0"
}
```

### `POST /api/chat/`

Ask the AI agricultural advisor a question.

**Request Body:**
```json
{
  "message": "What fertilizer should I use for wheat?",
  "lang": "hi"
}
```

**Response:**
```json
{
  "reply": "गेहूं के लिए DAP और यूरिया का उपयोग करें..."
}
```

### `GET /api/model-info/`

Get metadata about the currently loaded ML model.

```json
{
  "model_version": "v1.0",
  "accuracy": 0.98,
  "features": ["N", "P", "K", "temperature", "humidity", "ph", "rainfall", ...],
  "confidence_threshold": 0.5
}
```

---

## 🤖 ML Pipeline

### Crop Recommendation Model
- **Algorithm:** scikit-learn pipeline with feature engineering + classifier
- **Features Input:** N, P, K (soil nutrients), pH, temperature, humidity, rainfall + engineered features (NPK_ratio, temp_humidity, rainfall_humidity)
- **Output:** Predicted crop with probability scores for top-K alternatives

### Yield Prediction Model
- **Algorithm:** XGBoost (one model per crop)
- **Features:** Area, annual rainfall, fertilizer usage, pesticide amount, season, state
- **Output:** Estimated yield in tonnes/hectare

### Training
Training scripts are located in `ml_engine/trainers/`. See `ml_engine/models/crop_suitability.py` for model class definitions.

---

## 🌐 Multilingual Support

The platform supports **4 languages** for both the UI and AI responses:

| Code | Language |
|---|---|
| `en` | English |
| `hi` | Hindi (हिंदी) |
| `mr` | Marathi (मराठी) |
| `gu` | Gujarati (ગુજરાતી) |

Language selection is managed via React Context (`i18n/LanguageContext`), and the backend LLM service automatically responds in the requested language.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please ensure your code follows existing conventions and includes relevant tests.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for the farming community of India 🇮🇳

</div>