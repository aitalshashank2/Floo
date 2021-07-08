import random
import string

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from Floo.models import Meeting, Team
from Floo.serializers.meeting import MeetingSerializer
from Floo.permissions.meeting import ValidMethods


class MeetingViewSet(viewsets.ModelViewSet):

    queryset = Meeting.objects.none()
    permission_classes = [
        IsAuthenticated,
        ValidMethods
    ]
    serializer_class = MeetingSerializer
    lookup_field = "code"

    def get_queryset(self):
        return Meeting.objects.filter(attendees=self.request.user)

    @action(detail=False, methods=['get'])
    def new(self, request):
        teamCode = request.query_params.get('team')
        t = None
        if teamCode is not None:
            try:
                t = Team.objects.get(code = teamCode)
                if request.user not in t.members.all():
                    return Response({"error": "User is not in team"}, status=status.HTTP_400_BAD_REQUEST)
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
            team = t
        )
        meeting.save()

        return Response({"code": code}, status=status.HTTP_201_CREATED)
