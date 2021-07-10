import base64
import json
import requests

from django.contrib.auth import login, logout

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from FlooBackend.settings import CONFIG_VARS

from Floo.models import User
from Floo.serializers.user import UserGetSerializer, UserPostSerializer
from Floo.serializers.userVerbose import UserVerboseSerializer
from Floo.permissions import UserIsInSafeMethods


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.none()
    permission_classes = [
        UserIsInSafeMethods
    ]

    def get_serializer_class(self):
        if self.action == "create":
            return UserPostSerializer
        else:
            return UserVerboseSerializer

    def get_queryset(self):

        if(self.request.user.is_authenticated):
            return User.objects.filter(email = self.request.user.email)
        else:
            return User.objects.none()


    @action(detail=False, methods=['post'])
    def login(self, request):
        if request.user.is_authenticated:
            return Response({'error': 'A user is already logged in! Please log in again!'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        code = data['code']

        data = {
            'code': code,
            'client_id': CONFIG_VARS['GOOGLE_OAUTH']['CLIENT_ID'],
            'client_secret': CONFIG_VARS['GOOGLE_OAUTH']['CLIENT_SECRET'],
            'redirect_uri': CONFIG_VARS['FRONTEND']['REDIRECT_URI'],
            'grant_type': 'authorization_code'
        }

        try:
            token = requests.post(
                url=CONFIG_VARS['GOOGLE_OAUTH']['TOKEN_ENDPOINT'],
                data=data
            ).json()
        except requests.exceptions.ConnectionError:
            return Response({'error': 'Bad Gateway'}, status=status.HTTP_502_BAD_GATEWAY)

        if token == None:
            return Response({'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            id_token_jwt = token['id_token']

            content = id_token_jwt.split('.')[1]
            padding = len(str(content)) % 4
            content = content + padding*"="

            content_bytes = base64.b64decode(content)
            content_ascii = content_bytes.decode('ascii')
            user_data = json.loads(content_ascii)

            try:
                user = User.objects.get(email=user_data['email'])
                login(request, user)

                user_serializer = UserVerboseSerializer(user)
                user_data = user_serializer.data
                return Response(user_data, status=status.HTTP_200_OK)

            except User.DoesNotExist:
                email = user_data['email']
                full_name = user_data['name']
                username = user_data['given_name']
                profile_picture = user_data['picture']

                new_user = User(
                    email=email,
                    full_name=full_name,
                    username=username,
                    profile_picture=profile_picture
                )

                new_user.save()
                login(request, new_user)

                serializer = UserVerboseSerializer(new_user)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except KeyError:
            return Response({'error': 'Token expired!'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def logout(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response({'status': 'User Logged out successfully!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User is not logged in!'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def verify(self, request):
        if request.user.is_authenticated:
            serializer = UserVerboseSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User not logged in!'}, status=status.HTTP_403_FORBIDDEN)
