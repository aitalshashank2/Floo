import base64
import json
import requests

from django.contrib.auth import login, logout

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from FlooBackend.settings import CONFIG_VARS

from Floo.models import User
from Floo.serializers.user import UserPostSerializer
from Floo.serializers.userVerbose import UserVerboseSerializer
from Floo.serializers.meeting import MeetingSerializer
from Floo.permissions import UserIsInSafeMethods


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset houses the views for the User Model

    Attributes
    ----------
    queryset : QuerySet
        Initialized to an empty queryset of Team Model. Populated by using the function `get_queryset()`
    permission_classes: list
        Contains the following classes for permission rules
            IsAuthenticated : User is allowed only if they are logged in
    serializer_class : UserPostSerializer, UserVerboseSerializer

    Methods
    -------
    get_queryset()
        Assigns `queryset` attribute with all the users with the email same as the current user
    get_serilaizer_class()
        Gets the required serializer class depending on the request method

    Actions
    -------
    login()
        Logs a user in by using Google OAuth
    logout()
        Logs a user out
    verify()
        Checks if a user is logged in
    present_meetings()
        Retrieves all the meetings that the user is currently attending
    """

    queryset = User.objects.none()
    permission_classes = [
        UserIsInSafeMethods
    ]

    def get_serializer_class(self):
        """Set the serializer class

        - If the request method is POST, we use `UserPostSerializer`
        - For any other method, we use `UserVerboseSerializer`
        """
        if self.action == "create":
            return UserPostSerializer
        else:
            return UserVerboseSerializer

    def get_queryset(self):
        """Assign `queryset` attribute to all the user objects that have same email as the current user
        """

        if(self.request.user.is_authenticated):
            return User.objects.filter(email=self.request.user.email)
        else:
            return User.objects.none()

    @action(detail=False, methods=['post'])
    def login(self, request):
        """View that enables users to log in

        The user is redirected here with the authorization code provided by Google and user information is retrieved from Google using that code

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance

        Returns
        -------
        Response
            - 200_OK : User logged in successfully. Sends user information.
            - 400_BAD_REQUEST : User is already logged in
            - 400_BAD_REQUEST : Token is invalid
            - 400_BAD_REQUEST : Token expired
            - 502_BAD_GATEWAY : Could not connect to Google Token Server
        """
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
        """View that enables users to log out

        If a user makes a GET request to this endpoint, they get logged out

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance

        Returns
        -------
        Response
            - 200_OK : User is logged out successfully
            - 400_BAD_REQUEST : User is not logged in
        """
        if request.user.is_authenticated:
            logout(request)
            return Response({'status': 'User Logged out successfully!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User is not logged in!'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def verify(self, request):
        """View that provides user details

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance

        Returns
        -------
        Response
            - 200_OK : User verified. Sends user information
            - 400_BAD_REQUEST : User is not logged in
        """
        if request.user.is_authenticated:
            serializer = UserVerboseSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User not logged in!'}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['get'])
    def present_meetings(self, request):
        """View that provides all the meetings that the user is a part of

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance

        Returns
        -------
        Response
            - 200_OK : Found user meetings. Sends user meetings.
            - 400_BAD_REQUEST : User is not logged in.
        """
        if request.user.is_authenticated:
            m = request.user.ongoing_meetings.all()
            data = MeetingSerializer(m, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User is not logged in!'}, status=status.HTTP_403_FORBIDDEN)
