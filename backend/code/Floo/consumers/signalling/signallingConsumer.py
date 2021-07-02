import json
from asgiref.sync import async_to_sync

from channels.auth import get_user
from channels.generic.websocket import WebsocketConsumer

from Floo.models import Meeting
from Floo.serializers.user import UserGetSerializer

from .mixins.forwardingMixin import ForwardingMixin


class SignallingConsumer(WebsocketConsumer, ForwardingMixin):
    """
    This consumer handles the signalling for video calling using WebRTC
    """

    def connect(self):
        
        self.meeting_code = self.scope['url_route']['kwargs']['code']
        self.signalling_group_name = f"signalling_{self.meeting_code}"

        # Check user authenticity
        self.user = async_to_sync(get_user)(self.scope)
        if not self.user.is_authenticated:
            self.close()

        # Retrieve meeting instance corresponding to the meeting code
        # Close connection if meeting does not exist
        try:

            self.meeting = Meeting.objects.get(code=self.meeting_code)
            self.meeting.attendees.add(self.user)
            async_to_sync(self.channel_layer.group_add)(
                self.signalling_group_name,
                self.channel_name
            )
            self.accept()

            # Send the information of all attendees to the new attendee
            attendees = UserGetSerializer(self.meeting.attendees.all(), many=True).data
            payload = {
                'type': 'ATTENDEES_LIST',
                'data': attendees
            }
            self.send(text_data=json.dumps(payload))

            # Send information of new attendee to all existing attendees
            async_to_sync(self.channel_layer.group_send)(
                self.signalling_group_name,
                {
                    'type': 'new_attendee',
                    'user': UserGetSerializer(self.user).data
                }
            )

        except Meeting.DoesNotExist:
            self.close()

    def disconnect(self, code):

        async_to_sync(self.channel_layer.group_discard)(
            self.signalling_group_name,
            self.channel_name
        )
        self.close()

    def receive(self, text_data):
        # Forward message from one client to all the clients
        payload = json.loads(text_data)


        signal_type = payload.get('type', None)
        signal_data = payload.get('data', None)

        if signal_type is None or signal_data is None:
            return

        # Send event to the Signalling Group
        async_to_sync(self.channel_layer.group_send)(
            self.signalling_group_name,
            {
                'type': 'forward',
                'payload': payload
            }
        )

