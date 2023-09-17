from .views import StreamAuthView, StreamDoneView
from django.urls import path

urlpatterns = [
    path('auth/', StreamAuthView.as_view()),
    path('done/', StreamDoneView.as_view()),
]
