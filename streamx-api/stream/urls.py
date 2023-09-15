from .views import StreamAuthView
from django.urls import path

urlpatterns = [
    path('auth/', StreamAuthView.as_view()),
]
