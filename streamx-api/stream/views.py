from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect

User = get_user_model()


class StreamAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        addr = data.get("addr")
        flashver = data.get("flashver")
        call = data.get("call")
        stream_key = data.get("name")

        if addr == "127.0.0.1" and flashver == "LNX.11,1,102,55":
            return Response(status=status.HTTP_200_OK)

        if not call or call != "publish" or not stream_key:
            return Response(
                {"message": "Stream authorization failed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            user = User.objects.get(stream_key=stream_key)
            if not user:
                return Response(
                    {"message": "Stream authorization failed"},
                    status=status.HTTP_403_FORBIDDEN,
                )
        except User.DoesNotExist:
            return Response(
                {"message": "Stream authorization failed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        HttpResponseRedirect.allowed_schemes.append("rtmp")
        return HttpResponseRedirect(
            redirect_to=f"rtmp://127.0.0.1/live/{user.username}",
            status=status.HTTP_302_FOUND,
        )


class StreamDoneView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data

        print(data)
