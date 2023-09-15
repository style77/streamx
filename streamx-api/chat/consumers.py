import json
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import ChatMessage
from collections import defaultdict

user_model = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    connected_clients = defaultdict(set)

    async def connect(self):
        self.group_name = self.scope["url_route"]["kwargs"]["streamer_username"]
        self.user = self.scope["user"]

        await self.channel_layer.group_add(self.group_name, str(self.channel_name))
        await self.accept()

        ChatConsumer.connected_clients[self.group_name].add(self.user.username)
        await self.send_connected_clients()
        await self.send_group_connected_clients()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

        ChatConsumer.connected_clients[self.group_name].remove(self.user.username)
        await self.send_group_connected_clients()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        message_obj = await self.create_message(self.user, self.group_name, message)
        if not message_obj:
            return

        # Prevent anonymous users from sending messages
        if self.user.is_anonymous:
            return

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "send_message",
                "message": message,
                "user": {
                    "username": self.user.username,
                    "id": self.user.id,
                },
            },
        )

    @sync_to_async
    def create_message(self, author, channel, content):
        channel_user = user_model.objects.get(username=channel)
        if channel_user is None:
            return None

        return ChatMessage.objects.create(
            author=author, channel=channel_user, content=content
        )

    async def send_message(self, event):
        await self.send(
            text_data=json.dumps(
                {"message": event["message"], "username": event["user"]["username"]}
            )
        )

    async def send_connected_clients(self):
        await self.send(
            text_data=json.dumps(
                {
                    "connected_clients": list(
                        ChatConsumer.connected_clients[self.group_name]
                    ),
                }
            )
        )

    async def send_group_connected_clients(self):
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "group_connected_clients",
            },
        )

    async def group_connected_clients(self, event):
        await self.send_connected_clients()
