import random
import string

from django.core.exceptions import ValidationError

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from Floo.models.user import User
from Floo.models.team import Team
from Floo.serializers.team import TeamGetSerializer, TeamPostSerializer


class TeamViewSet(viewsets.ModelViewSet):
    """
    This viewset houses the views for Team Model

    Attributes
    ----------
    queryset : QuerySet
        Initialized to an empty queryset of Team Model. Populated by using the function `get_queryset()`
    permission_classes: list
        Contains the following classes for permission rules
            IsAuthenticated : User is allowed only if they are logged in
    serializer_class : TeamGetSerializer, TeamPostSerializer
        Serializer class is initialized to `TeamGetSerializer`
    lookup_field : string
        The unique field that the viewset uses for detailed view of an object instance

    Methods
    -------
    get_queryset()
        Assigns `queryset` attribute with the teams that the user is a part of
    get_serializer_class()
        Gets the required serializer class depending on the request method
    create()
        Overrides the default `create()` method of `viewsets.ModelViewSet` for custom functionality

    Actions
    -------
    join()
        Adds a user to member list of a team
    leave()
        Removes a user from member list of a team

    """

    queryset = Team.objects.none()
    permission_classes = [
        IsAuthenticated
    ]
    serializer_class = TeamGetSerializer
    lookup_field = "code"

    def get_queryset(self):
        """Assign `queryset` attribute to all the teams that the user corresponding to the request is a part of
        """
        return Team.objects.filter(members=self.request.user)

    def get_serializer_class(self):
        """Set the serializer class

        - If the request method is POST, we use `TeamPostSerializer`
        - For any other method, we use `TeamGetSerializer`
        """
        if self.action == "create":
            return TeamPostSerializer
        else:
            return TeamGetSerializer

    def create(self, request):
        """Override the `create()` method of the super-class for custom functionality

        Gets `name` and `members` of the team from POST request data
        Checks if all the members are valid
        Generates a 6 digit unique random code for the team
        Saves the team

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance

        Returns
        -------
        Response
            - 201_CREATED: Team instance is created succesfully. Sends details about the recently created team 
            - 400_BAD_REQUEST : Any of the member uuids are invalid
            - 400_BAD_REQUEST : `name` field is empty in POST request data
        """
        try:
            name = request.data["name"]
            members = request.data["members"]
            users = []

            for uuid in members:
                try:
                    user = User.objects.get(uuid=uuid)
                    users.append(user)

                except ValidationError:
                    return Response({'error': "Invalid User"}, status=status.HTTP_400_BAD_REQUEST)

            # Generate a 6 character random code
            code = "".join(random.choice(string.ascii_lowercase)
                           for _ in range(6))

            newTeam = Team(name=name, code=code)
            newTeam.save()
            newTeam.members.set(users)
            newTeam.save()
            return Response(TeamGetSerializer(newTeam).data, status=status.HTTP_201_CREATED)

        except KeyError:
            return Response({'error': "Name field is empty"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def join(self, request, code):
        """Detail view that enables users to join a team

        If a user makes a GET request on this view, they are added to the corresponding team instance.

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance
        code : string
            Code of the team that the user has specified in the URL

        Returns
        -------
        Response
            - 200_OK : User is added to the team successfully. Sends the updated details of the team instance.
            - 400_BAD_REQUEST : Team corresponding to the team code does not exist
        """
        try:
            t = Team.objects.get(code=code)
            t.members.add(request.user)
            return Response(TeamGetSerializer(t).data, status=status.HTTP_200_OK)
        except Team.DoesNotExist:
            return Response({"error": "Team does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def leave(self, request, code):
        """Detail view that enables users to leave a team

        If a user makes a GET request on this view, they are removed to the corresponding team instance.

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance
        code : string
            Code of the team that the user has specified in the URL

        Returns
        -------
        Response
            - 200_OK : User is removed from the team successfully. Sends the updated details of the team instance.
            - 400_BAD_REQUEST : Team corresponding to the team code does not exist

        """
        try:
            t = Team.objects.get(code=code)
            t.members.remove(request.user)
            return Response({"status": "Left the team"}, status=status.HTTP_200_OK)
        except Team.DoesNotExist:
            return Response({"error": "Team Does not exist"}, status=status.HTTP_400_BAD_REQUEST)
