from rest_framework.serializers import ModelSerializer
from Floo.models.user import User


class UserPostSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
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
            'id',
            'full_name',
            'profile_picture',
            'email'
        ]

        read_only_fields = [
            'id',
            'full_name',
            'profile_picture',
            'email'
        ]
