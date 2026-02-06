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

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def recommend(request):
    """
    Stub implementation.
    Returns hardcoded data matching the API contract.
    """
    return Response({
        "recommendation": {
            "crop": "Wheat",
            "yield": None,
            "profit": None
        },
        "explanation": None
    })
