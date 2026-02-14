from rest_framework import serializers


class SoilSerializer(serializers.Serializer):
    ph = serializers.FloatField(required=False)


class RecommendRequestSerializer(serializers.Serializer):
    location = serializers.CharField(required=False)
    lang = serializers.CharField(required=False)
    soil = SoilSerializer(required=False)
    last_crop = serializers.CharField(required=False, allow_null=True)
