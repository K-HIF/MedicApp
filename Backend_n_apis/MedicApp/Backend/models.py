from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    FName = models.CharField(max_length=100)
    PatID = models.IntegerField(unique=True)
    MName = models.CharField(max_length=100)
    SName = models.CharField(max_length=100)
    Age = models.FloatField()
    DOB = models.DateTimeField()
    city = models.CharField(max_length=100)
    Category = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"name: {self.FName} {self.MName} {self.SName}, age: {self.Age}, "
            f"city: {self.city}, Category: {self.Category}, PatID: {self.PatID}, created_at: {self.created_at}"
        )

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.employee_id})"

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


