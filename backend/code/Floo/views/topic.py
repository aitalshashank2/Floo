from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from Floo.models.team import Team
from Floo.models.topic import Topic
from Floo.serializers.message import MessageSerializer
from Floo.serializers.topic import TopicSerializer, TopicPostSerializer


class TopicViewSet(viewsets.ModelViewSet):
    """
    This viewset houses the views for Topic Model

    Attributes
    ----------
    queryset : QuerySet
        Initialized to a queryset containing all objects of Topic model
    permission_classes: list
        Contains the following classes for permission rules
            IsAuthenticated : User is allowed only if they are logged in
    serializer_class : TopicSerializer, TopicPostSerializer
        Serializer class is initialized to  `TopicSerializer`

    Methods
    -------
    get_serializer_class()
        Gets the required serializer class depending on the request method
    create()
        Overrides the default `create()` method of `viewsets.ModelViewSet` for custom functionality

    Actions
    -------
    messages()
        Retrieves all the messages associated with a topic
    """

    queryset = Topic.objects.all()
    permission_classes = [
        IsAuthenticated
    ]
    serializer_class = TopicSerializer

    def get_serializer_class(self):
        """Set the serializer class

        - If the request method is POST, we use `TopicPostSerializer`
        - For any other method, we use `TopicSerializer`
        """
        if self.action == "create":
            return TopicPostSerializer
        else:
            return TopicSerializer

    def create(self, request):
        """Override the `create()` method of the super-class for custom functionality

        Gets required data from the POST requests and adds additional fields before saving the Topic instance

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance

        Returns
        -------
        Response
            - 201_CREATED : Topic instance is created successfully. Sends details about the recently created topic.
            - 400_BAD_REQUEST : Specified team code has no corresponding Team instance
            - 400_BAD_REQUEST : Team code is not provided
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            team = Team.objects.get(code=self.request.data["team"])
            serializer.save(
                team=team,
                creator=self.request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except KeyError:
            return Response({'error': 'Team missing'}, status=status.HTTP_400_BAD_REQUEST)
        except Team.DoesNotExist:
            return Response({'error': 'Team does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk):
        """Detail view that provides all the messages corresponding to the topic

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance
        pk : int
            Primary key of the topic specified in URL

        Returns
        -------
        Response
            - 200_OK : Topic found. Sends all the messages corresponding to the topic.
            - 400_BAD_REQUEST : No topic exists with the given primary key.
        """
        try:
            topic = Topic.objects.get(pk=pk)

            messages = topic.messages.all()
            payload = MessageSerializer(messages, many=True).data

            return Response(payload, status=status.HTTP_200_OK)

        except Topic.DoesNotExist:
            return Response({'error': 'Topic does not exist'}, status=status.HTTP_400_BAD_REQUEST)
