from django.db import models
from django.conf import settings


class Meeting(models.Model):
    """
    Model representing meetings
    """

    attendees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name = "meetings",
        blank = False
    )

    code = models.CharField(
        max_length = 15,
        blank = False,
        null = False
    )

    start_time = models.DateTimeField(
        auto_now_add = True
    )

    end_time = models.DateTimeField(
        null = True,
        blank = True
    )

    def __str__(self):
        return f"Meeting: {self.code}"
