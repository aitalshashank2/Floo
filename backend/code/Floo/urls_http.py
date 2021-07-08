from django.urls import path
from rest_framework import routers

from Floo.views import *

urlpatterns = [
    path('', landing_view, name='landing_view'),
]

router = routers.SimpleRouter()

router.register(r'user', UserViewSet)
router.register(r'meeting', MeetingViewSet)
router.register(r'teams', TeamViewSet)

urlpatterns += router.urls
