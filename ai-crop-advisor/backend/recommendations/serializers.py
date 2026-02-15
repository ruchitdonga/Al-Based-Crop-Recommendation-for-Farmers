from rest_framework import serializers


class SoilSerializer(serializers.Serializer):
    N = serializers.FloatField(required=True)
    P = serializers.FloatField(required=True)
    K = serializers.FloatField(required=True)
    ph = serializers.FloatField(required=True)


class ClimateSerializer(serializers.Serializer):
    temperature = serializers.FloatField(required=True)
    humidity = serializers.FloatField(required=True)
    rainfall = serializers.FloatField(required=True)


class RecommendRequestSerializer(serializers.Serializer):

    soil = SoilSerializer(required=True)
    climate = ClimateSerializer(required=True)

    last_crop = serializers.CharField(required=False, allow_blank=True)

    lang = serializers.ChoiceField(
        choices=["en", "mr", "hi", "gu"],
        default="en"
    )