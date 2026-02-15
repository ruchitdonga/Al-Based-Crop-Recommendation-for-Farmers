"""
API CONTRACT: Crop Recommendation
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from .serializers import RecommendRequestSerializer
from services.decision_engine import decide_crop
from services.explanation_service import ExplanationService


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
        source = result.get("source")

        # STEP 4 — Explanation (No yield/profit anymore)
        explanation = self.explanation_service.generate(
            crop=crop,
            soil_ph=soil["ph"],  # explanation still references pH
            last_crop=last_crop,
            lang=lang
        )

        # STEP 5 — Final Response
        return Response({
            "recommendation": {
                "crop": crop,
            },
            "explanation": explanation,
            "source": source,
        })
