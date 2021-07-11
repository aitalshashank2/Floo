from rest_framework.serializers import ModelSerializer

from Floo.models.message import Message
from Floo.serializers.user import UserGetSerializer


class MessageSerializer(ModelSerializer):
    """
    Serializer class which serializes message instances

    Attributes
    ----------
    sender : UserGetSerializer
        Serialize the sender (a ForeignKey to User model)

    """

    sender = UserGetSerializer(read_only=True)

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

        model = Message
        fields = [
            'id',
            'sender',
            'topic',
            'send_time',
            'body'
        ]
        read_only_fields = [
            'id',
            'sender',
            'topic',
            'send_time',
            'body'
        ]
