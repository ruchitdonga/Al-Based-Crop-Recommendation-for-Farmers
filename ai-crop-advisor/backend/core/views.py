from datetime import datetime

from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from services.llm_service import LLMService
from services.system_check import SystemCheck


# -----------------------------
# Serializer for Swagger schema
# -----------------------------
class HealthCheckSerializer(serializers.Serializer):
    status = serializers.CharField()
    timestamp = serializers.DateTimeField()
    services = serializers.DictField()


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True, max_length=1000)


class HealthCheckView(APIView):

    @extend_schema(
        responses=HealthCheckSerializer,
        description="System health check endpoint"
    )
    def get(self, request):

        checker = SystemCheck()
        services = checker.run_all()

        overall_status = "ok"
        if "error" in services.values():
            overall_status = "degraded"

        return Response({
            "status": overall_status,
            "timestamp": datetime.utcnow().isoformat(),
            "services": services,
        })


class ChatView(APIView):

    @extend_schema(
        request=ChatRequestSerializer,
        responses={200: dict},
        description="AI Farming Chatbot"
    )
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data["message"]
        lang = request.data.get("lang", "en").strip().lower()

        language_hint = {
            "en": "English",
            "hi": "Hindi",
            "mr": "Marathi",
            "gu": "Gujarati",
        }.get(lang, "English")

        prompt = (
            "You are an AI Crop Advisor for Indian farmers. "
            "Answer clearly and practically. Keep it short unless the user asks for detail. "
            "If you need missing info (location, season, soil pH, N/P/K, rainfall), ask 1-2 questions. "
            f"Reply in {language_hint}.\n\n"
            f"User: {message}\n"
            "Assistant:"
        )

        try:
            llm = LLMService()
            reply = llm.reason_multilingual(prompt)
        except Exception as exc:
            return Response(
                {
                    "error": "AI service unavailable. Start Ollama and try again.",
                    "details": str(exc),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response({"reply": reply})
