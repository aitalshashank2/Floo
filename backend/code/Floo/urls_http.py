from django.urls import path
from rest_framework import routers

from Floo.views import *

router = routers.SimpleRouter()

urlpatterns = [
    path('', test_view, name='test_view'),
]

urlpatterns += router.urls
