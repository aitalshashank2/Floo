from django.db import models
from django.conf import settings

from Floo.models.team import Team

class Meeting(models.Model):
    """
    Model representing meetings
    """

    title = models.CharField(
        max_length=1023,
        blank=True,
        null=True,
        default="Custom Meeting"
    )

    team = models.ForeignKey(
        Team,
        null = True,
        on_delete = models.CASCADE,
        related_name = "meetings"
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
        return f"{self.title}"
