from rest_framework.serializers import ModelSerializer

from Floo.models.user import User
from Floo.serializers.team import TeamGetSerializer


class UserVerboseSerializer(ModelSerializer):
    """Serializer class which serializes User instances

    This serializer serializes user model to a greater depth. This must be used where a detailed information of the user is required.
    All the fields are read_only and cannot be modified

    Attributes
    ----------
    team : TeamGetSerializer
        Serializes the teams that the user is a part of (Many-To-Many field from Team model to User model)
    """

    teams = TeamGetSerializer(many=True, read_only=True)

    class Meta:
        """
        Class specifying configuration variables for the model serializer

        Attributes
        ----------
        model : django.db.models.Model
            The model that the serializer serializes
        fields : list
            The attributes of the model that are supposed to be serialized
        read_only_fields : list
            The attributes specified in the attribute `fields` that should not be modified
        """
        model = User
        fields = [
            'full_name',
            'profile_picture',
            'email',
            'uuid',
            'teams'
        ]

        read_only_fields = [
            'full_name',
            'profile_picture',
            'email',
            'uuid',
            'teams'
        ]
