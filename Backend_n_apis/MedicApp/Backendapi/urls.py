from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', views.register, name="register"),
    path('login/', views.user_login),
    path('verify-admin/', views.verify_admin, name="verify-admin"),
    path('patient/', views.PatientRegistrationView.as_view(), name="patient"),
    path('patient/<str:patient_id>/credentials/', views.update_patient_credentials, name='update_patient_credentials'),
]