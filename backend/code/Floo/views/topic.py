from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from Floo.models.team import Team
from Floo.models.topic import Topic
from Floo.serializers.message import MessageSerializer
from Floo.serializers.topic import TopicSerializer, TopicPostSerializer


class TopicViewSet(viewsets.ModelViewSet):

    queryset = Topic.objects.all()
    permission_classes = [
        IsAuthenticated
    ]
    serializer_class = TopicSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return TopicPostSerializer
        else:
            return TopicSerializer
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            team = Team.objects.get(code=self.request.data["team"])
            serializer.save(
                team = team,
                creator=self.request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except KeyError:
            return Response({'error': 'Team missing'}, status=status.HTTP_400_BAD_REQUEST)
        except Team.DoesNotExist:
            return Response({'error': 'Team does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=True, methods=['get'])
    def messages(self, request, pk):
        try:
            topic = Topic.objects.get(pk=pk)

            messages = topic.messages.all()
            payload = MessageSerializer(messages, many = True).data

            return Response(payload, status=status.HTTP_200_OK)


        except Topic.DoesNotExist:
            return Response({'error': 'Topic does not exist'}, status=status.HTTP_400_BAD_REQUEST)
