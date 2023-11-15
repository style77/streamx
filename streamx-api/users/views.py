from rest_framework import permissions, generics, mixins

from .models import User
from .serializers import UserSerializer


class GenericUserAPIView(
    generics.GenericAPIView,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, username=None):
        if username:
            return self.retrieve(request, username)
        else:
            raise NotImplementedError("GET all users not implemented")

    def post(self, request):
        return self.create(request)

    def put(self, request, username=None):
        return self.update(request, username)

    def delete(self, request, username=None):
        return self.destroy(request, username)


class UserSearchView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if query := self.request.query_params.get('q', ''):
            return User.objects.filter(username__icontains=query)
        else:
            return User.objects.none()
