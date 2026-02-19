from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from drf_spectacular.utils import extend_schema
from datetime import datetime

from services.system_check import SystemCheck


# -----------------------------
# Serializer for Swagger schema
# -----------------------------
class HealthCheckSerializer(serializers.Serializer):
    status = serializers.CharField()
    timestamp = serializers.DateTimeField()
    services = serializers.DictField()


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
