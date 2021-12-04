from django import http
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, CreateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from accounts.serializers import UserSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer
from accounts.models import User

# Create your views here.
class Register(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.errors, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUserProfile(RetrieveAPIView):
    permissions_classes = [IsAuthenticated]

    queryset = User.objects.all()
    serializer_class = UserSerializer

class SetUserProfile(CreateAPIView):
    permissions_classes = [IsAuthenticated]

    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

class UpdateUserProfile(UpdateAPIView):
    permissions_classes = [IsAuthenticated]

    queryset = User.objects.all()
    serializer_class = UserSerializer 
    http_method_names  = ['patch']

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        tokens = OutstandingToken.objects.filter(user_id=request.user.id)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)

        return Response(status=status.HTTP_205_RESET_CONTENT)

class CustomTokenObtainPairView(TokenObtainPairView):
    # Replace the serializer with your custom
    serializer_class = CustomTokenObtainPairSerializer
