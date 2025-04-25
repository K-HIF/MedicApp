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
from dotenv import load_dotenv
import os
from datetime import datetime, date
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from Backend.models import Patient
from django.shortcuts import get_object_or_404
from django.conf import settings
import random
import string

load_dotenv()

Admincreds = os.environ.get('AdminCreds') 

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data
        

        username = data['employee_id']
        email = data.get('email')
        password = data['password']
        
        if User.objects.filter(username=username).exists():
            return Response({"detail": "User already exists. Log in"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email = email,
            password=make_password(password),
        )
        user.save()
        return Response({"detail": "User created successfully!"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def registerdr(request):
    try:
        data = request.data
        fname = data['firstName']
        sname = data['lastName']
        username = data['employee_id']
        email = data.get('email')
        
        if User.objects.filter(username=username).exists():
            return Response({"detail": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a random password
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
        
        user = User.objects.create(
            username=username,
            first_name=fname,
            last_name=sname,
            email=email,
            password=make_password(password)
        )
        
        
        email_content = f"""
        Welcome to MedicApp!
        
        Your account has been created with the following credentials:
        Employee ID: {username}
        Password: {password}
        
        Please login using these credentials and change your password after first login.
        """

        send_mail(
            'MedicApp Account Created',
            email_content,
            'frandelwanjawa19@gmail.com',
            [email],
            fail_silently=False,
        )

        return Response({
            "detail": "User registered successfully! Check your email for login credentials."
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    try:
        data = request.data
        print(data)
        username = data.get('employee_id') 
        password = data.get('password')
        

        if not username or not password:
            return Response({"detail": "Both employee_id and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            if username == Admincreds:
                return Response({
                    'refresh': str(refresh),
                    'access': str(access),
                    'user': {
                        'status': 'system_admin',
                        'email': user.email,
                    }
                }, status=status.HTTP_200_OK)

            return Response({
                'refresh': str(refresh),
                'access': str(access),
                'user': {
                    'employee_id': user.username,
                    'email': user.email,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PatientRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            try:
                data = request.data
            except json.JSONDecodeError:
                return Response({"detail": "Invalid JSON format"}, status=400)
           
            FName = data.get('FName')
            MName = data.get('MName')
            SName = data.get('SName')
            pID = data.get('PatID')
            DOB = data.get('DOB')  
            city = data.get('city')
            Category = data.get('Category')

            if not all([FName, MName, SName, pID, DOB, city, Category]):
                return Response({
                    "detail": "Missing required fields"
                }, status=400)

            try:
                dob_date = datetime.strptime(DOB, '%Y-%m-%d').date()
            except ValueError:
                return Response({"detail": "Invalid date format. Use YYYY-MM-DD"}, status=400)

            today = date.today()
            age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))
            
            patient = Patient(
                FName=FName,
                MName=MName,
                SName=SName,
                PatID=pID,
                Age=age, 
                DOB=dob_date,
                city=city,
                Category=Category
            )
            patient.save()

            return Response({'detail': 'Patient registered successfully!', 'id': patient.id}, status=201)

        except Exception as e:
            return Response({'detail': str(e)}, status=400)

    def get(self, request, *args, **kwargs):
        try:
            patients = Patient.objects.all().values(
                'id', 'FName', 'MName', 'SName', 'Age', 'Category', 'city', 'created_at'
            )
            return Response({'patients': list(patients)}, status=200)

        except Exception as e:
            return Response({'detail': str(e)}, status=500)
        
@csrf_exempt
@permission_classes([AllowAny])
def update_patient_credentials(request, patient_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON format'}, status=400)

        new_fname = data.get('fname')
        new_mname = data.get('mname')
        new_sname = data.get('sname')
        new_dob = data.get('DOB')
        new_city = data.get('city')
        new_category = data.get('Category')
        
        try:
            dob_date = datetime.strptime(new_dob, '%Y-%m-%d').date()
            today = date.today()
            new_age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))
        except ValueError:
            return JsonResponse({'detail': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
            
        if not all([new_fname, new_mname, new_sname, new_dob, new_city, new_category]):
            return JsonResponse({'detail': 'All fields are required'}, status=400)
        
        try:
            patient = get_object_or_404(Patient, patient_number=patient_id)
            
            patient.FName = new_fname
            patient.MName = new_mname
            patient.SName = new_sname
            patient.Age = new_age
            patient.city = new_city
            patient.Category = new_category
            
            patient.save()

            return JsonResponse({'detail': 'Patient data updated successfully'})
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)

    return JsonResponse({'detail': 'Invalid request method'}, status=405)

def send_email(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            employee_id = body.get('employee_id')
            email = body.get('email')
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON format'}, status=400)

        if not employee_id or not email:
            return JsonResponse({'detail': 'Employee ID and email are required'}, status=400)

        try:
            user = get_object_or_404(User, username=employee_id)
            
            email_content = f"""
            Password Reset Request
            
            A password reset has been requested for your account.
            Please contact your administrator for assistance.
            """

            send_mail(
                'Password Reset Request',
                email_content,
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return JsonResponse({'detail': 'Email sent successfully!'}, status=200)
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)

    return JsonResponse({'detail': 'Invalid request method'}, status=405)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_admin(request):
    try:
        data = request.data
        

        employee_id = data.get('employee_id')
        email = data.get('email')
        admin_id = os.environ.get('AdminCreds')  

        if not employee_id or not email:
            return Response({
                "detail": "Employee ID and email are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        if employee_id != admin_id:
            return Response({
                "detail": "Invalid employee ID"
            }, status=status.HTTP_401_UNAUTHORIZED)

        if User.objects.filter(username=employee_id).exists():
            return Response({
                "detail": "Admin account already exists"
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "detail": "Verification successful"
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "detail": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)