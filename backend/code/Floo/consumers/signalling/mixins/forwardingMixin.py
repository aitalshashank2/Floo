import json

from Floo.serializers.user import UserGetSerializer

"""
This Mixin contains methods used for listening to webseocket events that are supposed to be forwarded to all clients
"""
class ForwardingMixin:
    """
    Forward the signal as is to all the attendees of a meeting
    Handle the event `forward`
    """

    def forward(self, event):
        """
        Function to forward a webRTC message
        """

        payload = event['payload']

        self.send(text_data=json.dumps(payload))


    def new_attendee(self, event):
        """
        Function that creates a new attendee
        """

        payload = {
            'type': 'NEW_ATTENDEE',
            'data': event['user']
        }
        self.send(text_data=json.dumps(payload))

    
    def exit_attendee(self, event):
        """
        Function that is implemented when an attendee exits a meeting
        """

        payload = {
            'type': 'EXIT_ATTENDEE',
            'data': event['user']
        }
        self.send(text_data=json.dumps(payload))
