
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', views.UserViewSet.as_view({'post': 'register'}), name='register'),
    path('auth/me/', views.UserViewSet.as_view({'get': 'me'}), name='user_me'),
]
