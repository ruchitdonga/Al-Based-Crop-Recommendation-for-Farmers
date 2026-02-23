from rest_framework import serializers


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True, max_length=1000)
    lang = serializers.ChoiceField(
        choices=["en", "mr", "hi", "gu"],
        default="en"
    )


class SoilSerializer(serializers.Serializer):
    N = serializers.FloatField(required=True, min_value=0, max_value=200)
    P = serializers.FloatField(required=True, min_value=0, max_value=200)
    K = serializers.FloatField(required=True, min_value=0, max_value=200)
    ph = serializers.FloatField(required=True, min_value=4.0, max_value=9.0)


class ClimateSerializer(serializers.Serializer):
    temperature = serializers.FloatField(required=True, min_value=-10, max_value=60)
    humidity = serializers.FloatField(required=True, min_value=0, max_value=100)
    rainfall = serializers.FloatField(required=True, min_value=0, max_value=500)


class RecommendRequestSerializer(serializers.Serializer):

    soil = SoilSerializer(required=True)
    climate = ClimateSerializer(required=True)

    last_crop = serializers.CharField(required=False, allow_blank=True)

    lang = serializers.ChoiceField(
        choices=["en", "mr", "hi", "gu"],
        default="en"
    )