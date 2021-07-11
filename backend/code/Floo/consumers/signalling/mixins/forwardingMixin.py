import json

from Floo.serializers.user import UserGetSerializer


class ForwardingMixin:
    """
    This Mixin contains methods used for listening to websocket events 
    that are supposed to be forwarded to all clients

    Methods
    -------
    forward(event)
        Forward the payload received from `event` to all the users
    new_attendee(event)
        Notify all attendees of the arrival of a new attendee
    exit_attendee(event)
        Notify all attendees that an attendee has left the meeting
    """

    def forward(self, event):
        """Function that forwards a message from one participant to all the participants

        Parameters
        ----------
        event: dict
            The event that is used to retrieve the payload to be forwarded

        """

        payload = event['payload']
        self.send(text_data=json.dumps(payload))

    def new_attendee(self, event):
        """Function that notifies all attendees of the arrival of a new attendee

        Parameters
        ----------
        event : dict
            The event that is used to retrieve the information of the attendee who just joined

        """

        payload = {
            'type': 'NEW_ATTENDEE',
            'data': event['user']
        }
        self.send(text_data=json.dumps(payload))

    def exit_attendee(self, event):
        """Function that notifies all attendees that an attendee has left the meeting

        Paramters
        ---------
        event : dict
            The event that is used to retrieve the information of the attendee that left the meeting

        """

        payload = {
            'type': 'EXIT_ATTENDEE',
            'data': event['user']
        }
        self.send(text_data=json.dumps(payload))
