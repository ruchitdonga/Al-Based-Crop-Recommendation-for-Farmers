from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime

from services.system_check import SystemCheck


class HealthCheckView(APIView):

    def get(self, request):

        checker = SystemCheck()
        services = checker.run_all()

        overall_status = "ok"
        if "error" in services.values():
            overall_status = "degraded"

        return Response({
            "status": overall_status,
            "timestamp": datetime.utcnow(),
            "services": services,
        })
