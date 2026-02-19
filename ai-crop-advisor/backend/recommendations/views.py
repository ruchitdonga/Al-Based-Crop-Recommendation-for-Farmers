"""
API CONTRACT: Crop Recommendation & Chat Advisory
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from .serializers import RecommendRequestSerializer, ChatRequestSerializer
from services.decision_engine import decide_crop
from services.explanation_service import ExplanationService
from services.llm_service import LLMService
from services.ml_client import MLClient
from services.session_history import history_store


class RecommendView(APIView):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.explanation_service = ExplanationService()

    @extend_schema(
        request=RecommendRequestSerializer,
        responses={200: dict},
    )
    def post(self, request):

        # STEP 1 — Validate request
        serializer = RecommendRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # STEP 2 — Extract validated data
        data = serializer.validated_data

        soil = data["soil"]
        climate = data["climate"]
        last_crop = data.get("last_crop")
        lang = data.get("lang", "en")

        # STEP 3 — Decision Engine (FULL FEATURE INPUT)
        decision_input = {
            "soil": soil,
            "climate": climate,
            "last_crop": last_crop,
        }

        result = decide_crop(decision_input)

        crop = result.get("crop")
        confidence = result.get("confidence", 0.0)
        source = result.get("source")
        model_version = result.get("model_version")
        reason = result.get("reason", "unknown")

        # STEP 4 — Explanation with confidence and reason awareness
        explanation = self.explanation_service.generate(
            crop=crop,
            soil_ph=soil["ph"],
            confidence=confidence,
            reason=reason,
            last_crop=last_crop,
            lang=lang
        )

        # STEP 5 — Add recommendation to session history
        session_id = request.session.session_key or "anonymous"
        history_store.add(session_id, crop, confidence)
        history = history_store.get(session_id)

        # STEP 6 — Final Response
        return Response({
            "recommendation": {
                "crop": crop,
                "confidence": confidence,
            },
            "explanation": explanation,
            "source": source,
            "model_version": model_version,
            "reason": reason,
            "history": history,
        })


class ChatView(APIView):
    """
    Stateless AI advisory chatbot endpoint.
    Provides farming Q&A without ML pipeline interaction.
    """

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.llm_service = LLMService()

    @extend_schema(
        request=ChatRequestSerializer,
        responses={200: dict},
    )
    def post(self, request):

        # STEP 1 — Validate input
        serializer = ChatRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # STEP 2 — Extract message and language
        message = serializer.validated_data["message"]
        lang = serializer.validated_data.get("lang", "en")

        # Language name mapping
        lang_names = {
            "en": "English",
            "hi": "Hindi",
            "mr": "Marathi",
            "gu": "Gujarati"
        }
        lang_name = lang_names.get(lang, "English")

        # STEP 3 — Construct safe advisory prompt
        prompt = f"""You are an agricultural AI advisor.

Your role:
- Provide farming advice and general agricultural Q&A
- Answer questions about crops, soil, weather, and farming practices
- Keep responses concise and practical
- Focus on factual, well-established information
- Do NOT hallucinate data or make up scientific facts

If the user requests a formal crop prediction for specific soil and climate conditions, suggest they use the /api/recommend/ endpoint.

IMPORTANT: Respond in {lang_name}.

User question: {message}

Provide a helpful agricultural advisory response in {lang_name}:"""

        try:
            # STEP 4 — Get LLM response
            reply = self.llm_service.reason_multilingual(prompt)

            # STEP 5 — Return advisory response
            return Response({
                "reply": reply
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Advisory service unavailable: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class ModelInfoView(APIView):
    """
    Model metadata endpoint.
    Returns model version, accuracy, features, and confidence threshold.
    """

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.ml_client = MLClient()

    @extend_schema(
        responses={200: dict},
    )
    def get(self, request):
        """Get model metadata."""

        return Response({
            "model_version": self.ml_client.model_version,
            "accuracy": self.ml_client.accuracy,
            "features": self.ml_client.feature_order,
            "confidence_threshold": 0.5,
        }, status=status.HTTP_200_OK)
