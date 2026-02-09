from django.db import models

# Create your models here.
class WeatherSnapshot(models.Model):
    location = models.CharField(max_length=100)
    temperature = models.FloatField(null=True)
    rainfall = models.FloatField(null=True)
