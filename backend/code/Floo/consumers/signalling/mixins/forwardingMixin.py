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

        payload = event['payload']

        self.send(text_data=json.dumps(payload))


    def new_attendee(self, event):

        payload = {
            'type': 'NEW_ATTENDEE',
            'data': event['user']
        }
        self.send(text_data=json.dumps(payload))

    
    def exit_attendee(self, event):

        payload = {
            'type': 'EXIT_ATTENDEE',
            'data': event['user']
        }
        self.send(text_data=json.dumps(payload))
