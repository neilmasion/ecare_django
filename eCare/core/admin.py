from django.contrib import admin
from .models import Service, ContactSubmission, AssistanceRequest, UserProfile

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display  = ['title', 'category', 'price', 'is_active', 'order']
    list_filter   = ['category', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['is_active', 'order']


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display   = ['first_name', 'last_name', 'email', 'created_at', 'is_resolved']
    list_filter    = ['is_resolved', 'created_at']
    search_fields  = ['first_name', 'last_name', 'email']
    readonly_fields = ['created_at']


@admin.register(AssistanceRequest)
class AssistanceRequestAdmin(admin.ModelAdmin):
    list_display   = ['reference_number', 'first_name', 'last_name', 'assistance_type', 'urgency', 'status', 'created_at']
    list_filter    = ['status', 'urgency', 'assistance_type', 'created_at']
    search_fields  = ['reference_number', 'first_name', 'last_name', 'email']
    readonly_fields = ['reference_number', 'created_at', 'updated_at']
    list_editable  = ['status']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display  = ['user', 'phone', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
    readonly_fields = ['created_at', 'updated_at']