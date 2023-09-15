from django.db import models
from django.contrib.auth import get_user_model

user_model = get_user_model()


class ChatMessage(models.Model):
    author = models.ForeignKey(
        user_model, related_name="message_author", on_delete=models.CASCADE
    )
    channel = models.ForeignKey(
        user_model, related_name="message_channel", on_delete=models.CASCADE
    )
    content = models.TextField(max_length=1024, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content
