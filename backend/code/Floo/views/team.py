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

    queryset = Team.objects.none()
    permission_classes = [
        IsAuthenticated
    ]
    serializer_class = TeamGetSerializer
    lookup_field = "code"

    def get_queryset(self):
        return Team.objects.filter(members=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return TeamPostSerializer
        else:
            return TeamGetSerializer
    
    def create(self, request):
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
            
            code = "".join(random.choice(string.ascii_lowercase) for _ in range(6))

            newTeam = Team(name=name, code=code)
            newTeam.save()
            newTeam.members.set(users)
            newTeam.save()
            return Response(TeamGetSerializer(newTeam).data, status=status.HTTP_201_CREATED)

        except KeyError:
            return Response({'error': "Name field is empty"}, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=['get'])
    def join(self, request):
        teamCode = request.query_params.get('team')
        try:
            t = Team.objects.get(code = teamCode)
            t.members.add(request.user)
            return Response(TeamGetSerializer(t).data, status=status.HTTP_200_OK)
        except Team.DoesNotExist:
            return Response({"error": "Team does not exist"}, status=status.HTTP_400_BAD_REQUEST)
