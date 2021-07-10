import json
from asgiref.sync import async_to_sync

from channels.auth import get_user
from channels.generic.websocket import WebsocketConsumer

from Floo.models.topic import Topic
from Floo.models.message import Message
from Floo.serializers.message import MessageSerializer


class ChatConsumer(WebsocketConsumer):
    """
    This consumer handles real time chat
    """

    def connect(self):
        self.topicID = self.scope['url_route']['kwargs']['pk']
        self.group_name = f"topic_{self.topicID}"

        # Check user authenticity
        self.user = async_to_sync(get_user)(self.scope)
        if not self.user.is_authenticated:
            self.close()

        try:
            self.topic = Topic.objects.get(pk=self.topicID)

            async_to_sync(self.channel_layer.group_add)(
                self.group_name,
                self.channel_name
            )
            self.accept()

        except Topic.DoesNotExist:
            self.close()
    
    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )
    
    def receive(self, text_data):
        payload = json.loads(text_data)

        body = payload.get('body', None)

        if body is None:
            return
        
        m = Message(
            sender = self.user,
            topic = self.topic,
            body = body
        )
        m.save()

        payload = MessageSerializer(m).data
        
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'send_message',
                'payload': payload
            }
        )
    
    def send_message(self, event):
        payload = event['payload']
        self.send(text_data = json.dumps(payload))
