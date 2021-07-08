from rest_framework.serializers import ModelSerializer

from Floo.models.meeting import Meeting
from Floo.serializers.user import UserGetSerializer


class MeetingSerializer(ModelSerializer):

    attendees = UserGetSerializer(many = True, read_only = True)
    class Meta:
        model = Meeting
        fields = [
            'attendees',
            'code',
            'start_time',
            'end_time'
        ]
        read_only_fields = [
            'attendees',
            'code',
            'start_time',
            'end_time'
        ]
