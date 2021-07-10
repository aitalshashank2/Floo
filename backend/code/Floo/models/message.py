from django.db import models
from django.conf import settings

from Floo.models.topic import Topic


class Message(models.Model):
    """
    Model representing a message
    """

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null = False,
        on_delete = models.CASCADE,
        related_name = "messages"
    )

    topic = models.ForeignKey(
        Topic,
        null = False,
        on_delete = models.CASCADE,
        related_name = "messages"
    )

    send_time = models.DateTimeField(
        auto_now_add = True
    )

    body = models.CharField(
        max_length = 1023,
        blank = False,
        null = False
    )

    class Meta:
        ordering = ['send_time']
    
    def __str__(self):
        return f"Topic: {self.topic.title}, Body: {self.body[:15]}..."
