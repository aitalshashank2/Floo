from django.db import models
from django.conf import settings


class Team(models.Model):
    """
    Model representing teams
    """

    name = models.CharField(
        max_length = 1023,
        blank = True,
        null = True
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name = "teams"
    )

    code = models.CharField(
        max_length = 6,
        blank = False,
        null = False
    )

    def __str__(self):
        return f"{self.code}"
