from rest_framework.serializers import ModelSerializer

from Floo.models.meeting import Meeting
from Floo.serializers.user import UserGetSerializer


class MeetingSerializer(ModelSerializer):
    """
    Serializer class which serializes meeting instances

    Attributes
    ----------
    attendees : UserGetSerializer
        Serialize the attendees (a Many-To-Many relation to the User model)

    """

    attendees = UserGetSerializer(many=True, read_only=True)

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

        model = Meeting
        fields = [
            'attendees',
            'code',
            'start_time',
            'end_time',
            'topic'
        ]
        read_only_fields = [
            'attendees',
            'code',
            'start_time',
            'end_time',
            'topic'
        ]
