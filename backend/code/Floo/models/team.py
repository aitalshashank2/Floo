from django.db import models
from django.conf import settings


class Team(models.Model):
    """
    A class representing a Team instance

    Attributes
    ----------
    name : CharField
        A field representing the name of the team
    members : ManyToManyField
        A field representing the members of the team
    code : CharField
        A field representing the code corresponding to the team
    """

    name = models.CharField(
        max_length=1023,
        blank=True,
        null=True
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="teams"
    )

    code = models.CharField(
        max_length=6,
        blank=False,
        null=False
    )

    def __str__(self):
        return f"{self.code}"
