from rest_framework import serializers

from Floo.models.team import Team

from Floo.serializers.meeting import MeetingSerializer
from Floo.serializers.user import UserGetSerializer
from Floo.serializers.topic import TopicSerializer


class TeamGetSerializer(serializers.ModelSerializer):
    """Serializer class which serializes Team instances

    This serializer cannot modify any of the attributes and should be used in methods which retrieve information only.

    Attributes
    ----------
    members : UserGetSerializer
        Serialize the members of the team (a Many-To-Many relation to the User model)
    meetings : MeetingSerializer
        Serialize the meetings associated with a team (a ForeignKey from Meeting Model to Team Model)
    topics : TopicSerializer
        Serialize the topics associated with a team (a ForeignKey from Topic Model to Team Model)
    """

    members = UserGetSerializer(many=True, read_only=True)
    meetings = MeetingSerializer(many=True, read_only=True)
    topics = TopicSerializer(many=True, read_only=True)

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

        model = Team
        fields = [
            'name',
            'members',
            'code',
            'meetings',
            'topics'
        ]
        read_only_fields = [
            'name',
            'members',
            'code',
            'meetings',
            'topics'
        ]


class TeamPostSerializer(serializers.ModelSerializer):
    """Serializer class which serializes Team instances

    The serializer that can modify some attributes of the model. This must be used in methods that need to modify data.

    """

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
        model = Team
        fields = [
            'name',
            'members',
            'code'
        ]
        read_only_fields = [
            'code'
        ]
