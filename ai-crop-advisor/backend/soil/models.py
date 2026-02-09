from django.db import models

# Create your models here.
class SoilProfile(models.Model):
    location = models.CharField(max_length=100)
    ph = models.FloatField(null=True)
