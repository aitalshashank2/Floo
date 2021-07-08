from rest_framework import serializers

from Floo.models.team import Team

from Floo.serializers.meeting import MeetingSerializer
from Floo.serializers.user import UserGetSerializer

class TeamGetSerializer(serializers.ModelSerializer):

    members = UserGetSerializer(many = True, read_only = True)
    meetings = MeetingSerializer(many = True, read_only = True)
    class Meta:
        model = Team
        fields = [
            'name',
            'members',
            'code',
            'meetings'
        ]
        read_only_fields = [
            'name',
            'members',
            'code',
            'meetings'
        ]


class TeamPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = [
            'name',
            'members',
            'code'
        ]
        read_only_fields = [
            'code'
        ]
