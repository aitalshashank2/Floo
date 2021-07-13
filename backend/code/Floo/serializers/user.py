from rest_framework.serializers import ModelSerializer

from Floo.models.user import User


class UserPostSerializer(ModelSerializer):
    """Serializer class which serializes User instances

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
    """Serializer class which serializes User instances

    This serializer cannot modify any of the attributes and should be used in methods which retrieve information only.
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
