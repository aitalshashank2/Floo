from django.db import models
from django.conf import settings

from Floo.models.topic import Topic

class Meeting(models.Model):
    """
    Model representing meetings
    """

    topic = models.ForeignKey(
        Topic,
        null = True,
        on_delete = models.CASCADE,
        related_name = "meeting"
    )

    attendees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name = "meetings",
        blank = True
    )

    current_attendees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name = "ongoing_meetings",
        blank = True
    )

    code = models.CharField(
        max_length = 9,
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
        return f"{self.topic}"
