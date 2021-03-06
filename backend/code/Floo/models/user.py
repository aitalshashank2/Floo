import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    """
    A class representing a User instance

    Attributes
    ----------
    username : CharField
        A field which stores the username of the user instance
    full_name : CharField
        A field which stores the full name of the user instance
    profile_picture : CharField
        A field which stores the link to the profile picture of the user
    uuid : UUIDField
        A field storing a unique identifier corresponding to the user

    Methods
    -------
    get_uuid()
        Returns the string form of the uuid field of a user instance
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

    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    def __str__(self):
        return f"{self.full_name}"

    def get_uuid(self):
        return str(self.uuid)
