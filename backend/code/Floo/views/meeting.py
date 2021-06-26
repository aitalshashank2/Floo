from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from Floo.models import Meeting
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
        return Meeting.objects.filter(attendees = self.request.user)

