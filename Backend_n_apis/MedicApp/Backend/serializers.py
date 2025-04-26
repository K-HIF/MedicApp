from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient, Doctor, Category

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    """Basic serializer for patient list views"""
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Patient
        fields = ('id', 'PatID', 'FName', 'MName', 'SName', 'Age', 'DOB', 'city', 'categories', 'category_ids', 'created_at')

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        patient = Patient.objects.create(**validated_data)
        patient.categories.set(Category.objects.filter(id__in=category_ids))
        return patient

    def update(self, instance, validated_data):
        category_ids = validated_data.pop('category_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if category_ids is not None:
            instance.categories.set(Category.objects.filter(id__in=category_ids))
        
        return instance

class DoctorSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='user.first_name', read_only=True)
    lastName = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Doctor
        fields = ('id', 'employee_id', 'firstName', 'lastName', 'email', 'specialization', 'is_active', 'created_at')