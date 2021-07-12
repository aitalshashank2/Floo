import random
import string

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from Floo.models import Meeting, Team, Topic
from Floo.serializers.meeting import MeetingSerializer
from Floo.permissions.meeting import ValidMethods


class MeetingViewSet(viewsets.ModelViewSet):
    """
    This viewset houses the views for Meeting Model

    Attributes
    ----------
    queryset : QuerySet
        Queryset containing all the meeting instances
    permission_classes : list
        Contains the following classes for permission rules
            IsAuthenticated : User is allowed only if they are logged in
            ValidMethods : Checks if the request method is valid
    serializer_class : MeetingSerializer
    lookup_field : string
        The unique field that the viewset uses for detailed view of an object instance

    Actions
    -------
    new()
        Creates a new meeting instance

    """

    queryset = Meeting.objects.all()
    permission_classes = [
        IsAuthenticated,
        ValidMethods
    ]
    serializer_class = MeetingSerializer
    lookup_field = "code"

    @action(detail=False, methods=['get'])
    def new(self, request):
        """Creates a meeting instance

        URL parameter `team` specifies the team that the meeting is created in
        If this parameter is not present in the URL, a custom meeting without a team is created

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance

        Returns
        -------
        Response
            - 201_CREATED : Meeting is created successfully. Sends details about the recently created meeting
            - 400_BAD_REQUEST : Team is specified but user is not part of that team
            - 400_BAD_REQUEST : Team specified in the URL does not exist
        """

        teamCode = request.query_params.get('team')
        t = None
        topic = None
        if teamCode is not None:
            try:
                t = Team.objects.get(code=teamCode)
                if request.user not in t.members.all():
                    return Response({"error": "User is not in team"}, status=status.HTTP_400_BAD_REQUEST)
                topic = Topic(
                    title="New meeting",
                    creator=request.user,
                    team=t
                )
                topic.save()
            except Team.DoesNotExist:
                return Response({"error": "Team Does not Exist"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a random 9 character code for the new meeting
        code = "".join(random.choice(string.ascii_lowercase) for _ in range(9))

        while True:
            try:
                clone = Meeting.objects.get(code=code)
                code = "".join(random.choice(string.ascii_lowercase)
                               for _ in range(9))
            except Meeting.DoesNotExist:
                break

        meeting = Meeting(
            code=code,
            topic=topic
        )
        meeting.save()

        return Response({"code": code}, status=status.HTTP_201_CREATED)
