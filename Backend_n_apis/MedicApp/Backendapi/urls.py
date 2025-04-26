from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Authentication URLs
    path('login/', views.user_login, name='login'),
    path('register/', views.register, name='register'),
    path('register-doc/', views.registerdr, name='register-doc'),
    path('verify-admin/', views.verify_admin, name='verify-admin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Patient URLs
    path('patient/', views.PatientRegistrationView.as_view(), name='patient'),
    path('patient/<str:patient_id>/', views.patient_detail, name='patient-detail'),
    path('patient/<str:patient_id>/credentials/', views.update_patient_credentials, name='update-patient-credentials'),
    
    # Doctor URLs
    path('doctors/', views.DoctorView.as_view(), name='doctors'),
    path('doctors/<str:user_id>/verify/', views.verify_user, name='verify-doctor'),  
    path('doctors/stats/', views.doctor_stats, name='doctor-stats'),
    
    # Category URLs
    path('categories/', views.CategoryView.as_view(), name='categories'),
    path('categories/<int:pk>/', views.category_detail, name='category-detail'),
    
    # Email URLs
    path('send-email/', views.send_email, name='send-email'),
    
    # Admin URLs
    path('admin-details/', views.admin_details, name='admin-details'),
]