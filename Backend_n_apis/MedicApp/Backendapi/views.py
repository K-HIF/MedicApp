from django.shortcuts import render, redirect
from django.http import HttpResponse,JsonResponse
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
import json
from django.shortcuts import render

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    
    
    data = request.data
    employee_id = data['employee_id']
    email = data['email']
    password = data['password']
    print(data)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    
    
    data = request.data
    username = data['username']
    email = data['email']
    password = data['password']
    print(data)