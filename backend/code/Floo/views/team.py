from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from Floo.models.team import Team
from Floo.serializers.team import TeamGetSerializer

class TeamViewSet(viewsets.ModelViewSet):

    queryset = Team.objects.none()
    permission_classes = [
        IsAuthenticated
    ]
    serializer_class = TeamGetSerializer
    lookup_field = "code"

    def get_queryset(self):
        return Team.objects.filter(members=self.request.user)
