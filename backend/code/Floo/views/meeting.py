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

    queryset = Meeting.objects.all()
    permission_classes = [
        IsAuthenticated,
        ValidMethods
    ]
    serializer_class = MeetingSerializer
    lookup_field = "code"

    @action(detail=False, methods=['get'])
    def new(self, request):
        teamCode = request.query_params.get('team')
        t = None
        topic = None
        if teamCode is not None:
            try:
                t = Team.objects.get(code = teamCode)
                if request.user not in t.members.all():
                    return Response({"error": "User is not in team"}, status=status.HTTP_400_BAD_REQUEST)
                topic = Topic(
                    title = "New meeting",
                    creator = request.user,
                    team = t
                )
                topic.save()
            except Team.DoesNotExist:
                return Response({"error": "Team Does not Exist"}, status=status.HTTP_400_BAD_REQUEST)

        code = "".join(random.choice(string.ascii_lowercase) for _ in range(9))

        while True:
            try:
                clone = Meeting.objects.get(code=code)
                code = "".join(random.choice(string.ascii_lowercase) for _ in range(9))
            except Meeting.DoesNotExist:
                break

        meeting = Meeting(
            code = code,
            topic = topic
        )
        meeting.save()

        return Response({"code": code}, status=status.HTTP_201_CREATED)
