from rest_framework.serializers import ModelSerializer

from Floo.models.team import Team
from Floo.serializers.user import UserGetSerializer

class TeamGetSerializer(ModelSerializer):

    members = UserGetSerializer(many = True, read_only = True)
    class Meta:
        model = Team
        fields = [
            'name',
            'members',
            'code'
        ]
        read_only_fields = [
            'name',
            'members',
            'code'
        ]
