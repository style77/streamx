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

        print(data)

        if data.get("addr") == "127.0.0.1" and data.get("flashver") == "LNX.11,1,102,55":
            return Response(status=200)

        call = data.get("call", None)

        if not call or call != "publish":
            return Response({"message": "Stream authorization failed"}, status=403)

        stream_key = data.get("name")
        if not stream_key:
            return Response({"message": "Stream authorization failed"}, status=403)

        try:
            user = User.objects.get(stream_key=stream_key)
            if not user:
                return Response({"message": "Stream authorization failed"}, status=403)
        except User.DoesNotExist:
            return Response({"message": "Stream authorization failed"}, status=403)

        # Add rtmp to allowed schemes
        # https://stackoverflow.com/questions/34465617/disallowedredirect-unsafe-redirect-to-url-with-protocol-django
        HttpResponseRedirect.allowed_schemes.append("rtmp")

        # return HttpResponseRedirect(
        #     redirect_to=f"rtmp://127.0.0.1/live/{user.username}",
        #     status=302,
        # )

        return Response(
            status=302,
            headers={
                "Location": f"rtmp://127.0.0.1/live/{user.username}",
            },
        )
