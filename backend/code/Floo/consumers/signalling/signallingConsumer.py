import json
from datetime import datetime
from asgiref.sync import async_to_sync

from channels.auth import get_user
from channels.generic.websocket import WebsocketConsumer

from Floo.models import Meeting
from Floo.serializers.user import UserGetSerializer

from .mixins.forwardingMixin import ForwardingMixin


class SignallingConsumer(WebsocketConsumer, ForwardingMixin):
    """
    This consumer handles the signalling for video calling using WebRTC

    Methods
    -------
    connect()
        Handles the logic when an attendee joins the meeting
    disconnect()
        Handles the logic when an attendee exits a meeting
    receive()
        Handles the logic when there is a new message sent across the websocket
    """

    def connect(self):
        """ Handleslogic when an attendee joins the meeting

        This function retrieves the meeting instance that corresponds to the url and 
        adds the user to the list of attendees of that meeting. It adds the user to the 
        group containing all the attendees of the meeting
        """

        self.meeting_code = self.scope['url_route']['kwargs']['code']
        self.signalling_group_name = f"signalling_{self.meeting_code}"

        # Check if meeting code has in valid format
        if len(self.meeting_code) != 9:
            self.close()

        # Check user authenticity
        self.user = async_to_sync(get_user)(self.scope)
        if not self.user.is_authenticated:
            self.close()

        # Retrieve meeting instance corresponding to the meeting code
        # Close connection if meeting does not exist
        try:

            # Find meeting corresponding to the consumer
            self.meeting = Meeting.objects.get(code=self.meeting_code)
            self.meeting.attendees.add(self.user)
            self.meeting.current_attendees.add(self.user)
            async_to_sync(self.channel_layer.group_add)(
                self.signalling_group_name,
                self.channel_name
            )
            self.accept()

            # Send the information of all attendees to the new attendee
            attendees = UserGetSerializer(
                self.meeting.current_attendees.all(), many=True).data
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
        """Handles logic when an attendee leaves the meeting

        - Removes the attendee from the list of current participants of a meeting and the corresponding group
        - Resets the meeting code if no one is present in the meeting
        """

        # Remove the user from meeting
        self.meeting.current_attendees.remove(self.user)

        if not self.meeting.current_attendees.all():
            self.meeting.code = "expired"
            self.meeting.end_time = datetime.now()
            self.meeting.save()

        async_to_sync(self.channel_layer.group_send)(
            self.signalling_group_name,
            {
                'type': 'exit_attendee',
                'user': UserGetSerializer(self.user).data
            }
        )

        async_to_sync(self.channel_layer.group_discard)(
            self.signalling_group_name,
            self.channel_name
        )
        self.close()

    def receive(self, text_data):
        """Forwards any message received from any of the attendees to all the attendees
        """

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
