from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now

@api_view(['GET'])
def health_check(request):
    return Response({
        "status": "ok",
        "timestamp": now()
    })
