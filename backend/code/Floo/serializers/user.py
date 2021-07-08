from rest_framework.serializers import ModelSerializer
from Floo.models.user import User


class UserPostSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'full_name',
            'profile_picture',
            'email'
        ]
        read_only_fields = [
            'id'
        ]

class UserGetSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'full_name',
            'profile_picture',
            'email',
            'uuid'
        ]

        read_only_fields = [
            'full_name',
            'profile_picture',
            'email',
            'uuid'
        ]
