from django.db import models
from django.conf import settings

from Floo.models.topic import Topic


class Meeting(models.Model):
    """
    A class representing a Meeting instance

    ...

    Attributes
    ----------
    topic : ForeignKey
        A field to denote the topic instance associated with the meeting
    attendees : ManyToManyField
        A field representing the users who have attended the meeting
    current_attendees : ManyToManyField
        A field representing the users who are currently in the meeting
    code : CharField
        A field representing the code associated with the meeting instance
    start_time : DateTimeField
        A field representing the start time of the meeting
    end_time : DateTimeField
        A field representing the end tiem of the meeting
    """

    # The topic instance associated with the meeting
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
