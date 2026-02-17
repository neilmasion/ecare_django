import random
from datetime import datetime
from django.db import models

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('documents',    'Documents'),
        ('appointments', 'Appointments'),
        ('emergency',    'Emergency'),
        ('community',    'Community'),
        ('volunteer',    'Volunteer'),
        ('health',       'Health'),
    ]
    BADGE_TYPE_CHOICES = [
        ('prime',  'Prime'),
        ('urgent', 'Urgent'),
        ('',       'None'),
    ]

    title          = models.CharField(max_length=200)
    description    = models.TextField()
    category       = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price          = models.CharField(max_length=50, default='Free')   # e.g. "₱50" or "Free"
    badge          = models.CharField(max_length=50, blank=True)       # e.g. "Most Popular"
    badge_type     = models.CharField(max_length=20, blank=True, choices=BADGE_TYPE_CHOICES)
    image          = models.ImageField(upload_to='services/', blank=True, null=True)
    processing_time = models.CharField(max_length=100, blank=True)     # e.g. "24hrs"
    rating         = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)

    features       = models.JSONField(default=list)
    requirements   = models.JSONField(default=list)

    stat_value1    = models.CharField(max_length=50, blank=True)
    stat_label1    = models.CharField(max_length=100, blank=True)
    stat_value2    = models.CharField(max_length=50, blank=True)
    stat_label2    = models.CharField(max_length=100, blank=True)
    stat_value3    = models.CharField(max_length=50, blank=True)
    stat_label3    = models.CharField(max_length=100, blank=True)

    is_active      = models.BooleanField(default=True)
    order          = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title

class ContactSubmission(models.Model):
    first_name  = models.CharField(max_length=100)
    last_name   = models.CharField(max_length=100)
    email       = models.EmailField()
    phone       = models.CharField(max_length=30, blank=True)
    message     = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.created_at.date()}"

class AssistanceRequest(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('in_review', 'In Review'),
        ('approved',  'Approved'),
        ('resolved',  'Resolved'),
        ('rejected',  'Rejected'),
    ]
    URGENCY_CHOICES = [
        ('low',       'Low'),
        ('medium',    'Medium'),
        ('high',      'High'),
        ('emergency', 'Emergency'),
    ]

    first_name      = models.CharField(max_length=100)
    last_name       = models.CharField(max_length=100)
    email           = models.EmailField()
    phone           = models.CharField(max_length=30)
    address         = models.TextField(blank=True)

    assistance_type = models.CharField(max_length=100)
    urgency         = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='medium')
    description     = models.TextField()

    reference_number = models.CharField(max_length=20, unique=True, blank=True)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.reference_number:
            year = datetime.now().year
            num  = random.randint(1, 9999)
            ref  = f"CC-{year}-{num:04d}"

            while AssistanceRequest.objects.filter(reference_number=ref).exists():
                num = random.randint(1, 9999)
                ref = f"CC-{year}-{num:04d}"
            self.reference_number = ref
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference_number} — {self.first_name} {self.last_name}"

class UserProfile(models.Model):
    user       = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')
    phone      = models.CharField(max_length=30, blank=True)
    avatar     = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio        = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} — Profile"

    def get_avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return None