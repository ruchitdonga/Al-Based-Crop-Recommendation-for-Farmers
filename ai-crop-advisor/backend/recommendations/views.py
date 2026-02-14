"""
API CONTRACT: Crop Recommendation

Endpoint:
POST /api/recommend/

Request Body:
{
  "location": "Pune",
  "soil": {
    "ph": 6.5
  },
  "last_crop": "Rice",
  "lang": "hi"
}

Response Body:
{
  "recommendation": {
    "crop": "Wheat",
    "yield": null,
    "profit": null
  },
  "explanation": null
}

Notes:
- yield and profit will be added later via ML
- explanation will be generated later via LLM
- null values are expected in early versions
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .serializers import RecommendRequestSerializer
from services.decision_engine import decide_crop

class RecommendView(APIView):

    @extend_schema(
        request=RecommendRequestSerializer,
        responses={200: dict},
    )
    def post(self, request):
        """
        Recommendation endpoint using rule-based decision engine.
        """

        data = request.data

        # Extract inputs safely
        soil = data.get("soil", {})
        soil_ph = soil.get("ph")

        last_crop = data.get("last_crop")

        decision_input = {
            "soil_ph": soil_ph,
            "last_crop": last_crop,
        }

        result = decide_crop(decision_input)

        return Response({
            "recommendation": {
                "crop": result["crop"],
                "yield": result["ml"]["prediction"]["yield"],
                "profit": result["ml"]["prediction"]["profit"],
            },
            "explanation": result["explanation"],
            "source": result["source"]
        })

