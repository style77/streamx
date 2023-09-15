from django.urls import path, include

from .views import GenericUserAPIView, UserSearchView

urlpatterns = [
    path(r"<str:username>", GenericUserAPIView.as_view(), name="user-detail"),
    path(r"search/", UserSearchView.as_view(), name="user-search"),
    # path(r"", GenericUserAPIView.as_view(), name="user-list"),
    path(r"register/", include("dj_rest_auth.registration.urls")),
    path(r"", include("dj_rest_auth.urls")),
]
