from django.urls import re_path

from Floo.consumers import *

websocket_urlpatterns = [
    re_path(r'ws/meeting/(?P<code>\w+)/signalling/$', SignallingConsumer.as_asgi())
]
