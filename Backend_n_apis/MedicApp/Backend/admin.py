from django.contrib import admin
from .models import Patient, Doctor, Category

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('PatID', 'FName', 'SName', 'Age', 'get_categories', 'city', 'created_at')
    search_fields = ('PatID', 'FName', 'SName', 'categories__name')
    list_filter = ('categories', 'city')

    def get_categories(self, obj):
        return ", ".join([category.name for category in obj.categories.all()])
    get_categories.short_description = 'Programs'

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'get_full_name', 'specialization', 'is_active', 'created_at')
    search_fields = ('employee_id', 'user__first_name', 'user__last_name', 'specialization')
    list_filter = ('is_active', 'specialization')

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_full_name.short_description = 'Name'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
