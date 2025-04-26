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
from Backend.models import Patient, Doctor, Category
from Backend.serializers import PatientSerializer, DoctorSerializer, CategorySerializer
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
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        specialization = data.get('specialization', '')  # Optional specialization
        
        if not all([username, email, first_name, last_name]):
            return Response({
                "detail": "Employee ID, email, first name, and last name are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({"detail": "User already exists. Log in"}, status=status.HTTP_400_BAD_REQUEST)

        # Create user with inactive status (pending admin verification)
        user = User.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=make_password('temp_unused_password'),  # Temporary password - will be replaced upon verification
            is_active=False  # User cannot log in until verified by admin
        )
        
        # Create doctor profile for the user
        doctor = Doctor.objects.create(
            user=user,
            employee_id=username,
            specialization=specialization,
            is_active=False  # Doctor is inactive until verified
        )
        
        return Response({
            "detail": "Registration successful! Your account is pending admin verification."
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def registerdr(request):
    try:
        data = request.data
        # Extract data from request
        employee_id = data.get('employee_id')
        email = data.get('email')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        specialization = data.get('specialization')
        is_verified = data.get('is_verified', False)  

        if not all([employee_id, email, first_name, last_name]):
            return Response({
                "detail": "All fields are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create user account
        if User.objects.filter(username=employee_id).exists():
            return Response({
                "detail": "A doctor with this employee ID already exists"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Generate a random password if this is a verified registration
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=10)) if is_verified else None
        
        user = User.objects.create(
            username=employee_id,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=make_password(password) if is_verified else make_password('temp_unused_password'),
            is_active=is_verified  # Only activate user if verified
        )

        # Create doctor profile
        doctor = Doctor.objects.create(
            user=user,
            employee_id=employee_id,
            specialization=specialization,
            is_active=is_verified  # Only activate doctor if verified
        )

        # Send login credentials via email only if this is a verified registration
        if is_verified:
            try:
                send_mail(
                    'Your MedicApp Account Credentials',
                    f'Hello {first_name},\n\nYour MedicApp account has been created. Here are your login credentials:\n\nEmployee ID: {employee_id}\nPassword: {password}\n\nPlease log in and change your password.',
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending email: {str(e)}")

        return Response({
            "detail": "Doctor registered successfully!" if is_verified else "Doctor registered successfully! Waiting for verification."
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    try:
        data = request.data
        
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

@api_view(['GET'])
@permission_classes([AllowAny])
def patient_detail(request, patient_id):
    """
    Retrieve detailed information about a specific patient
    """
    try:
        patient = Patient.objects.prefetch_related('categories').get(PatID=patient_id)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)
    except Patient.DoesNotExist:
        return Response({"detail": "Patient not found"}, status=404)
    except Exception as e:
        return Response({"detail": str(e)}, status=500)

class PatientRegistrationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            patients = Patient.objects.all().prefetch_related('categories')
            serializer = PatientSerializer(patients, many=True)
            return Response({'patients': serializer.data}, status=200)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            
            # Field validation
            required_fields = ['FName', 'MName', 'SName', 'PatID', 'DOB', 'city']
            if not all(field in data and data[field] for field in required_fields):
                return Response({
                    "detail": "All fields are required"
                }, status=400)
            
            try:
                # Convert PatID to integer
                patient_id = int(data['PatID'])
                
                # Check if PatID already exists
                if Patient.objects.filter(PatID=patient_id).exists():
                    return Response({
                        "detail": "A patient with this ID already exists"
                    }, status=400)
                
                # Parse and validate date
                dob_date = datetime.strptime(data['DOB'], '%Y-%m-%d').date()
                today = date.today()
                age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))
                
                # Prepare data for serializer
                serializer_data = {
                    'FName': data['FName'],
                    'MName': data['MName'],
                    'SName': data['SName'],
                    'PatID': patient_id,
                    'Age': age,
                    'DOB': dob_date,
                    'city': data['city'],
                    'category_ids': data.get('category_ids', [])
                }
                
                serializer = PatientSerializer(data=serializer_data)
                if serializer.is_valid():
                    patient = serializer.save()
                    return Response({
                        'detail': 'Patient registered successfully!',
                        'id': patient.id
                    }, status=201)
                else:
                    return Response({
                        'detail': serializer.errors
                    }, status=400)
                
            except ValueError as e:
                if 'PatID' in str(e):
                    return Response({
                        "detail": "Patient ID must be a number"
                    }, status=400)
                else:
                    return Response({
                        "detail": "Invalid date format. Use YYYY-MM-DD"
                    }, status=400)
                
        except Exception as e:
            return Response({
                'detail': str(e)
            }, status=400)

@csrf_exempt
@permission_classes([AllowAny])
def update_patient_credentials(request, patient_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient = get_object_or_404(Patient, PatID=patient_id)
            
            
            if len(data) == 1 and 'category_ids' in data:
                patient.categories.set(data['category_ids'])
                return JsonResponse({'detail': 'Patient programs updated successfully'})
            
            # Otherwise, do a full update
            fields = ['FName', 'MName', 'SName', 'DOB', 'city']
            if not all(field in data for field in fields):
                return JsonResponse({'detail': 'All fields are required for full update'}, status=400)
            
            try:
                dob_date = datetime.strptime(data['DOB'], '%Y-%m-%d').date()
                today = date.today()
                new_age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))
            except ValueError:
                return JsonResponse({'detail': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
            
            patient.FName = data['FName']
            patient.MName = data['MName']
            patient.SName = data['SName']
            patient.Age = new_age
            patient.city = data['city']
            patient.categories.set(data.get('category_ids', []))
            patient.save()
            
            return JsonResponse({'detail': 'Patient data updated successfully'})
            
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON format'}, status=400)
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

class DoctorView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Check if the current user is an admin
        is_admin = request.user.username == os.environ.get('AdminCreds')
        
        # Retrieve all doctors with their related user info
        doctors = Doctor.objects.select_related('user').all()
        
       
        serializer = DoctorSerializer(doctors, many=True)
        data = serializer.data
        
        # Add a field to indicate if the doctor needs verification
        for doctor in data:
            doctor['needs_verification'] = not doctor['is_active']
            
        return Response(data)
    
    def post(self, request):
        try:
            doctor = Doctor.objects.get(employee_id=request.data.get('employee_id'))
            return Response({"detail": "Doctor with this ID already exists"}, status=400)
        except Doctor.DoesNotExist:
            serializer = DoctorSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
            
    def put(self, request):
        try:
            doctor = Doctor.objects.get(employee_id=request.data.get('employee_id'))
            user = doctor.user
            
            # Update user information
            user.first_name = request.data.get('firstName', user.first_name)
            user.last_name = request.data.get('lastName', user.last_name)
            user.email = request.data.get('email', user.email)
            user.save()
            
            # Update doctor information
            doctor.specialization = request.data.get('specialization', doctor.specialization)
            doctor.is_active = request.data.get('is_active', doctor.is_active)
            doctor.save()
            
            serializer = DoctorSerializer(doctor)
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response({"detail": "Doctor not found"}, status=404)

class CategoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_stats(request):
    total_doctors = Doctor.objects.count()
    active_doctors = Doctor.objects.filter(is_active=True).count()
    specializations = Doctor.objects.values('specialization').distinct().count()
    
    return Response({
        'total_doctors': total_doctors,
        'active_doctors': active_doctors,
        'specializations': specializations
    })

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def admin_details(request):
    try:
        # Check if the requesting user is admin
        admin_id = os.environ.get('AdminCreds')
        if request.user.username != admin_id:
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'PUT':
            email = request.data.get('email')
            if email:
                request.user.email = email
                request.user.save()
            
        return Response({
            'employee_id': request.user.username,
            'email': request.user.email,
        })
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_user(request, user_id):
    try:
        # Get the doctor's user account
        user = User.objects.get(username=user_id)
        
        # Check if the requesting user is admin
        admin_id = os.environ.get('AdminCreds')
        if request.user.username != admin_id:
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        # Generate a secure password
        temp_password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
        
        # Activate the user account
        user.is_active = True
        user.password = make_password(temp_password)
        user.save()
        
        
        try:
            doctor = Doctor.objects.get(employee_id=user_id)
            doctor.is_active = True
            doctor.save()
        except Doctor.DoesNotExist:
            
            pass
        
        # Send the credentials email
        email_content = f"""
        Welcome to MedicApp!
        
        Your account has been verified. You can now login with the following credentials:
        Employee ID: {user.username}
        Password: {temp_password}
        
        Please login using these credentials and change your password after first login.
        """

        send_mail(
            'MedicApp Account Verified',
            email_content,
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return Response({
            "detail": "Doctor verified successfully! Credentials have been sent."
        })
        
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=404)
    except Exception as e:
        return Response({"detail": str(e)}, status=500)