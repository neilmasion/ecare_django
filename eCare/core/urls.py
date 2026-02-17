from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('services/', views.services_page, name='services'),
    path('assistance/', views.assistance, name='assistance'),
    path('contact/', views.contact, name='contact'),
    path('account/', views.account, name='account'),
    path('account/login/', views.login_view, name='login'),
    path('account/signup/', views.signup_view, name='signup'),
    path('account/logout/', views.logout_view, name='logout'),
    path('contact/submit/', views.submit_contact, name='submit_contact'),
    path('assistance/submit/', views.submit_assistance, name='submit_assistance'),
    path('api/services/', views.services_api, name='services_api'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/change-password/', views.change_password, name='change_password'),
    path('profile/upload-avatar/', views.upload_avatar, name='upload_avatar'),
]