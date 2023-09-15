from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "date_joined",
            "is_mod",
            "last_login",
            "stream_key",
        ]
        read_only_fields = [
            "id",
            "date_joined",
            "is_mod",
            "last_login",
        ]
