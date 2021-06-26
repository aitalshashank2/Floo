from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    """
    Default user for Floo
    """

    username = models.CharField(
        max_length=63,
        blank=True,
        null=True,
        default=None,
        unique=True
    )

    full_name = models.CharField(
        max_length=255,
        blank=False,
        null=False
    )

    profile_picture = models.TextField(
        blank=False,
        null=False,
        default=settings.CONFIG_VARS['DEFAULT_PROFILE_PICTURE']
    )

    def __str__(self):
        return f"User: {self.full_name}"
