import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Service, ContactSubmission, AssistanceRequest, UserProfile

def index(request):
    services = Service.objects.filter(is_active=True)[:6]
    if request.user.is_authenticated:
        UserProfile.objects.get_or_create(user=request.user)
    return render(request, 'index.html', {'services': services})

def about(request):
    return render(request, 'about.html')

def services_page(request):
    category = request.GET.get('category', 'all')
    services = Service.objects.filter(is_active=True)
    if category != 'all':
        services = services.filter(category=category)
    return render(request, 'services.html', {
        'services': services,
        'active_category': category,
    })

def assistance(request):
    return render(request, 'assistance.html')

@ensure_csrf_cookie
def contact(request):
    return render(request, 'contact.html')

@ensure_csrf_cookie
def account(request):
    return render(request, 'account.html', {'user': request.user})

@require_POST
def login_view(request):
    try:
        data     = json.loads(request.body)
        email    = data.get('email', '').strip()
        password = data.get('password', '')

        try:
            db_user = User.objects.get(email=email)
            user    = authenticate(request, username=db_user.username, password=password)
        except User.DoesNotExist:
            user = None

        if user:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Signed in successfully!'})
        return JsonResponse({'success': False, 'message': 'Invalid email or password.'}, status=400)

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@require_POST
def signup_view(request):
    try:
        data       = json.loads(request.body)
        first_name = data.get('firstName', '').strip()
        last_name  = data.get('lastName',  '').strip()
        email      = data.get('email',     '').strip()
        password   = data.get('password',  '')

        if not all([first_name, last_name, email, password]):
            return JsonResponse({'success': False, 'message': 'All fields are required.'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'message': 'Email already registered.'}, status=400)

        base_username = email.split('@')[0]
        username      = base_username
        counter       = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        login(request, user)
        return JsonResponse({'success': True, 'message': 'Account created successfully!'})

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})

@require_POST
def submit_contact(request):
    try:
        data = json.loads(request.body)
        ContactSubmission.objects.create(
            first_name = data.get('firstName', ''),
            last_name  = data.get('lastName',  ''),
            email      = data.get('email',     ''),
            phone      = data.get('phone',     ''),
            message    = data.get('message',   ''),
        )
        return JsonResponse({'success': True, 'message': 'Message sent!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@require_POST
def submit_assistance(request):
    try:
        data       = json.loads(request.body)
        assistance = AssistanceRequest.objects.create(
            first_name      = data.get('firstName',     ''),
            last_name       = data.get('lastName',      ''),
            email           = data.get('email',         ''),
            phone           = data.get('phone',         ''),
            address         = data.get('address',       ''),
            assistance_type = data.get('assistanceType',''),
            urgency         = data.get('urgency',       'medium'),
            description     = data.get('description',  ''),
        )
        return JsonResponse({
            'success':          True,
            'reference_number': assistance.reference_number,
            'message':          'Request submitted!',
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

def services_api(request):
    services = Service.objects.filter(is_active=True).values(
        'id', 'title', 'description', 'category', 'price',
        'features', 'requirements',
        'stat_value1', 'stat_label1',
        'stat_value2', 'stat_label2',
        'stat_value3', 'stat_label3',
        'badge', 'badge_type', 'processing_time', 'rating',
    )
    return JsonResponse({'services': list(services)})

from django.contrib.auth.decorators import login_required

@login_required(login_url='/account/')
def profile(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    assistance_requests = AssistanceRequest.objects.filter(email=request.user.email).order_by('-created_at')
    contact_submissions = ContactSubmission.objects.filter(email=request.user.email).order_by('-created_at')
    return render(request, 'profile.html', {
        'profile':             profile,
        'assistance_requests': assistance_requests,
        'contact_submissions': contact_submissions,
    })

@login_required(login_url='/account/')
@require_POST
def update_profile(request):
    try:
        data       = json.loads(request.body)
        user       = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        user.first_name = data.get('firstName', user.first_name).strip()
        user.last_name  = data.get('lastName',  user.last_name).strip()
        user.email      = data.get('email',      user.email).strip()
        user.save()

        profile.phone = data.get('phone', profile.phone).strip()
        profile.bio   = data.get('bio',   profile.bio).strip()
        profile.save()

        return JsonResponse({'success': True, 'message': 'Profile updated!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@login_required(login_url='/account/')
@require_POST
def change_password(request):
    try:
        data         = json.loads(request.body)
        current_pwd  = data.get('currentPassword', '')
        new_pwd      = data.get('newPassword', '')
        confirm_pwd  = data.get('confirmPassword', '')

        if not request.user.check_password(current_pwd):
            return JsonResponse({'success': False, 'message': 'Current password is incorrect.'}, status=400)
        if new_pwd != confirm_pwd:
            return JsonResponse({'success': False, 'message': 'New passwords do not match.'}, status=400)
        if len(new_pwd) < 8:
            return JsonResponse({'success': False, 'message': 'Password must be at least 8 characters.'}, status=400)

        request.user.set_password(new_pwd)
        request.user.save()

        from django.contrib.auth import update_session_auth_hash
        update_session_auth_hash(request, request.user)

        return JsonResponse({'success': True, 'message': 'Password changed successfully!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@login_required(login_url='/account/')
@require_POST
def upload_avatar(request):
    try:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if 'avatar' in request.FILES:
            profile.avatar = request.FILES['avatar']
            profile.save()
            return JsonResponse({'success': True, 'avatar_url': profile.avatar.url})
        return JsonResponse({'success': False, 'message': 'No file uploaded.'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)