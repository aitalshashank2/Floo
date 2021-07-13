from rest_framework.serializers import ModelSerializer

from Floo.models.topic import Topic
from Floo.serializers.meeting import MeetingSerializer
from Floo.serializers.user import UserGetSerializer


class TopicSerializer(ModelSerializer):
    """Serializer class which serializes Topic instances

    This serializer cannot modify any of the attributes and should be used in methods which retrieve information only.

    Attributes
    ----------
    meeting : MeetingSerializer
        Serializes the meeting instances associated with the topic (a ForeignKey from Meeting Model to Topic Model)
    creator : UserGetSerializer
        Serializes the creator instance of the topic (ForeignKey to User Model)
    """
    meeting = MeetingSerializer(read_only=True, many=True)
    creator = UserGetSerializer(read_only=True)

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
        model = Topic
        fields = [
            'id',
            'title',
            'description',
            'creator',
            'meeting',
            'publish_time'
        ]
        read_only_fields = [
            'id',
            'title',
            'description',
            'creator',
            'meeting',
            'publish_time'
        ]


class TopicPostSerializer(ModelSerializer):
    """Serializer class which serializes Topic instances

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
        model = Topic
        fields = [
            'title',
            'description'
        ]
