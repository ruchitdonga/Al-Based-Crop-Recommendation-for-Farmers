"""API views for Crop Recommendation, Chat Advisory, and Model Info."""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from .serializers import RecommendRequestSerializer, ChatRequestSerializer
from services.decision_engine import decide_crop
from services.explanation_service import ExplanationService
from services.llm_service import LLMService
from services.ml_client import get_ml_client
from services.session_history import history_store


class RecommendView(APIView):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.explanation_service = ExplanationService()

    @extend_schema(request=RecommendRequestSerializer, responses={200: dict})
    def post(self, request):
        serializer = RecommendRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        soil = data["soil"]
        climate = data["climate"]
        last_crop = data.get("last_crop")
        lang = data.get("lang", "en")

        result = decide_crop({
            "soil": soil,
            "climate": climate,
            "last_crop": last_crop,
            "state": data.get("state", "Maharashtra"),
            "season": data.get("season", "Kharif"),
            "area": data.get("area", 1.0),
            "pesticide": data.get("pesticide", 0.0),
            "crop_year": data.get("crop_year", 2024),
        })

        crop = result.get("crop")
        confidence = result.get("confidence", 0.0)

        explanation = self.explanation_service.generate(
            crop=crop, soil_ph=soil["ph"], confidence=confidence,
            reason=result.get("reason"), last_crop=last_crop, lang=lang,
        )

        session_id = request.session.session_key or "anonymous"
        history_store.add(session_id, crop, confidence)

        return Response({
            "recommendation": {
                "crop": crop,
                "confidence": confidence,
                "estimated_yield": result.get("estimated_yield"),
                "financials": result.get("financials"),
            },
            "analytics": result.get("analytics"),
            "explanation": explanation,
            "source": result.get("source"),
            "model_version": result.get("model_version"),
            "reason": result.get("reason", "unknown"),
            "history": history_store.get(session_id),
        })


class ChatView(APIView):
    """Stateless AI advisory chatbot endpoint."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.llm_service = LLMService()

    @extend_schema(request=ChatRequestSerializer, responses={200: dict})
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        message = serializer.validated_data["message"]
        lang = serializer.validated_data.get("lang", "en")
        lang_name = {"en": "English", "hi": "Hindi", "mr": "Marathi", "gu": "Gujarati"}.get(lang, "English")

        prompt = f"""You are an agricultural AI advisor.
Your role: Provide concise, practical farming advice. Do NOT hallucinate data.
Respond in {lang_name}.

User question: {message}

Provide a helpful agricultural advisory response in {lang_name}:"""

        try:
            return Response({"reply": self.llm_service.reason_multilingual(prompt)})
        except Exception as e:
            return Response(
                {"error": f"Advisory service unavailable: {e}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class ModelInfoView(APIView):
    """Model metadata endpoint."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.ml_client = get_ml_client()

    @extend_schema(responses={200: dict})
    def get(self, request):
        return Response({
            "model_version": self.ml_client.model_version,
            "accuracy": self.ml_client.accuracy,
            "features": self.ml_client.feature_order,
            "confidence_threshold": 0.5,
        })
