from rest_framework.serializers import ModelSerializer

from Floo.models.user import User
from Floo.serializers.team import TeamGetSerializer


class UserVerboseSerializer(ModelSerializer):
    teams = TeamGetSerializer(many = True, read_only = True)
    class Meta:
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
