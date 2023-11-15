import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import UserManager
from .validators import UsernameValidator


def generate_stream_key():
    return str(uuid.uuid4()).replace("-", "")[:16]


class User(AbstractUser):
    username_validator = UsernameValidator()
    username = models.CharField(
        _("username"),
        max_length=38,
        unique=True,
        help_text=_(
            "Required. 38 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={"unique": _("A user with that username already exists.")},
    )

    email = models.EmailField(_("email address"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(_("date joined"), auto_now_add=True)
    last_login = models.DateTimeField(_("last login"), null=True, blank=True)
    stream_key = models.CharField(
        _("Stream key"),
        max_length=16,
        null=False,
        blank=False,
        unique=True,
        default=generate_stream_key,
    )

    followers = models.ManyToManyField(
        "self", symmetrical=False, related_name="following"
    )

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = UserManager()

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return f"@{self.username}"

    def is_mod(self):
        return self.is_staff

    @property
    def followers_count(self):
        return self.followers.count()

    def follow(self, user):
        # In future we can add notification system here
        self.followers.add(user)
