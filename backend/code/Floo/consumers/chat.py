import json
from asgiref.sync import async_to_sync
from datetime import datetime

from channels.auth import get_user
from channels.generic.websocket import WebsocketConsumer

from Floo.models.meeting import Meeting
from Floo.models.topic import Topic
from Floo.models.message import Message
from Floo.serializers.message import MessageSerializer
from Floo.serializers.user import UserGetSerializer


class ChatConsumer(WebsocketConsumer):
    """
    This consumer handles real time chat for meetings which are a part of a team

    Methods
    -------
    connect()
        Handles the logic when a user joins the chat
    disconnect()
        Handles the logix when a user exits the chat
    receive()
        Handles the logic when a user sends a message over the websocket
    """

    def connect(self):
        """Handles logic when a user joins the chat

        - Validate the topic instance
        - Enroll the user into the group corresponding to the associated topic
        """

        # Retrieve the id of the topic associated with the comment
        self.topicID = self.scope['url_route']['kwargs']['pk']
        self.group_name = f"topic_{self.topicID}"

        # Check user authenticity
        self.user = async_to_sync(get_user)(self.scope)
        if not self.user.is_authenticated:
            self.close()

        try:
            # Retrieve the topic associated with the given ID
            self.topic = Topic.objects.get(pk=self.topicID)

            async_to_sync(self.channel_layer.group_add)(
                self.group_name,
                self.channel_name
            )
            self.accept()

        except Topic.DoesNotExist:
            self.close()

    def disconnect(self, code):
        """Handles logic when a user leaves the chat

        Remove the user from the group corresponding to the associated topic 
        """

        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data):
        """Handles logic when a message is sent over the websocket

        - Retrieves the body from the message received and creates a message instance
        - Triggers the event `send_message` with payload containing the body of the received message

        """

        payload = json.loads(text_data)

        # Retrieve the message body
        body = payload.get('body', None)

        if body is None:
            return

        # Create a new message instance
        m = Message(
            sender=self.user,
            topic=self.topic,
            body=body
        )
        m.save()

        payload = MessageSerializer(m).data

        # Send payload to every single participant
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'send_message',
                'payload': payload
            }
        )

    def send_message(self, event):
        """Forwards a message from one participant to all the participants

        Parameters
        ----------
        event : dict
            The event that contains the message to be forwarded
        """
        payload = event['payload']
        self.send(text_data=json.dumps(payload))


class ForwardingChatConsumer(WebsocketConsumer):
    """
    This consumer handles real time chat for custom meetings that are not part of any team

    Methods
    -------
    connect()
        Handles the logic when a user joins the chat
    disconnect()
        Handles the logix when a user exits the chat
    receive()
        Handles the logic when a user sends a message over the websocket
    """

    def connect(self):
        """Handles logic when a user joins the chat

        Enroll the user into the group corresponding to the associated meeting if meeting code is valid
        """

        # Retrieve meeting code
        self.meeting_code = self.scope['url_route']['kwargs']['code']
        self.group_name = f"meeting_{self.meeting_code}"

        # Check user authenticity
        self.user = async_to_sync(get_user)(self.scope)
        if not self.user.is_authenticated:
            self.close()

        try:
            # Retrieve the meeting associated with the chat
            self.meeting = Meeting.objects.get(code=self.meeting_code)

            async_to_sync(self.channel_layer.group_add)(
                self.group_name,
                self.channel_name
            )
            self.accept()

        except Meeting.DoesNotExist:
            self.close()

    def disconnect(self, code):
        """Handles logic when a user leaves the chat

        Remove the user from the group corresponding to the associated meeting
        """

        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data):
        """Handles logic when a message is sent over the websocket

        - Retrieves the body from the message received
        - Triggers the event `send_message` with payload containing the body of the received message

        """
        payload = json.loads(text_data)

        body = payload.get('body', None)
        if body is None:
            return

        payload = {
            "id": f"message_{str(datetime.now())}",
            "sender": UserGetSerializer(self.user).data,
            "send_time": str(datetime.now()),
            "body": body
        }

        # Send payload to all the participants in the meeting
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'send_message',
                'payload': payload
            }
        )

    def send_message(self, event):
        """Forwards a message from one participant to all the participants

        Parameters
        ----------
        event : dict
            The event that contains the message to be forwarded
        """
        payload = event['payload']
        self.send(text_data=json.dumps(payload))
