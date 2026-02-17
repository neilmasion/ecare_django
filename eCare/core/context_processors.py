from .models import UserProfile

def user_profile(request):
    """Makes user.profile available in every template automatically."""
    if request.user.is_authenticated:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return {'user_profile': profile}
    return {'user_profile': None}