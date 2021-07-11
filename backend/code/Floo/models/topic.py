from django.db import models
from django.conf import settings

from Floo.models.team import Team


class Topic(models.Model):
    """
    A class representing a Topic Instance

    ...

    Attributes
    ----------
    title : CharField
        A field storing the title of the topic instance
    description : CharField
        A field storing the description of the topic instance
    creator : ForeignKey
        A field which maps the topic to the user who has created the topic
    team : ForeignKey
        A field which maps the topic to the team in which it was published
    publish_time : DateTimeField
        A field which stores the time at which the topic was published
    """

    title = models.CharField(
        max_length = 1023,
        blank = False,
        null = False
    )

    description = models.CharField(
        max_length = 2055,
        blank = True,
        null = True
    )

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null = False,
        on_delete = models.CASCADE,
        related_name = "topics"
    )

    team = models.ForeignKey(
        Team,
        null = False,
        on_delete = models.CASCADE,
        related_name = "topics"
    )

    publish_time = models.DateTimeField(
        auto_now_add = True
    )

    def __str__(self):
        return f"Team: {self.team.name}, Title: {self.title}"
