from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from django.contrib.auth import get_user_model

user = get_user_model()

TEST_USERNAME = "testuser"
TEST_MAIL = "test@mail.com"
TEST_PASSWORD = "TestPassword123"


class UserTests(APITestCase):
    def test_create_user(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(user.objects.count(), 1)
        self.assertEqual(user.objects.get().username, TEST_USERNAME)
        self.assertEqual(user.objects.get().email, TEST_MAIL)

    def test_create_user_with_invalid_email(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": "mail",
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_invalid_password(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": "password",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_invalid_username(self):
        url = reverse("rest_register")
        data = {
            "username": "user name",
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_existing_username(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_existing_email(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")
        data["username"] = "testuser2"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_missing_username(self):
        url = reverse("rest_register")
        data = {
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_missing_email(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_missing_password(self):
        url = reverse("rest_register")
        data = {"username": TEST_USERNAME, "email": TEST_MAIL}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_missing_password2(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")

        url = reverse("rest_login")
        data = {"email": TEST_MAIL, "password": TEST_PASSWORD}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("access" in response.json())

    def test_login_user_with_invalid_username(self):
        url = reverse("rest_login")
        data = {"username": "testuser2", "password": TEST_PASSWORD}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_invalid_password(self):
        url = reverse("rest_login")
        data = {"username": TEST_USERNAME, "password": "password"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_missing_username(self):
        url = reverse("rest_login")
        data = {"password": TEST_PASSWORD}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_missing_password(self):
        url = reverse("rest_login")
        data = {"username": TEST_USERNAME}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_user(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")

        url = reverse("rest_login")
        data = {"username": TEST_USERNAME, "password": TEST_PASSWORD}
        response = self.client.post(url, data, format="json")

        url = reverse("rest_logout")
        response = self.client.post(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_user_without_login(self):
        # dj-rest-auth behaves like this,
        # if you are not logged in, you can still log out
        url = reverse("rest_logout")
        response = self.client.post(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Test JWT

    def test_verify_jwt(self):
        url = reverse("rest_register")
        data = {
            "username": TEST_USERNAME,
            "email": TEST_MAIL,
            "password1": TEST_PASSWORD,
            "password2": TEST_PASSWORD,
        }
        response = self.client.post(url, data, format="json")

        url = reverse("rest_login")
        data = {"username": TEST_USERNAME, "password": TEST_PASSWORD}
        response = self.client.post(url, data, format="json")

        url = reverse("token_verify")
        data = {"token": response.json()["access"]}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
