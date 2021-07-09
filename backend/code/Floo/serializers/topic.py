from rest_framework.serializers import ModelSerializer

from Floo.models.topic import Topic
from Floo.serializers.meeting import MeetingSerializer
from Floo.serializers.user import UserGetSerializer


class TopicSerializer(ModelSerializer):
    meeting = MeetingSerializer(read_only = True, many = True)
    creator = UserGetSerializer(read_only = True)

    class Meta:
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

    class Meta:
        model = Topic
        fields = [
            'title',
            'description'
        ]
