from rest_framework.serializers import ModelSerializer

from Floo.models.message import Message
from Floo.serializers.user import UserGetSerializer


class MessageSerializer(ModelSerializer):
    sender = UserGetSerializer(read_only = True)

    class Meta:
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
