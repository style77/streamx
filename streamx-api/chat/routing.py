from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path(r"ws/chat/<str:streamer_username>/", ChatConsumer.as_asgi()),
]
