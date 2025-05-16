from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from users.views import UserViewSet, UserAddressViewSet
from products.views import (
    CategoryViewSet, BrandViewSet, ProductViewSet,
    ReviewViewSet
)
from banners.views import BannerViewSet, PromotionViewSet
from orders.views import OrderViewSet, OrderHistoryViewSet

# Create a router and register our viewsets with it
router = DefaultRouter()

# User routes
router.register(r'users', UserViewSet)
router.register(r'addresses', UserAddressViewSet, basename='address')

# Product routes
router.register(r'categories', CategoryViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)

# Banner routes
router.register(r'banners', BannerViewSet)
router.register(r'promotions', PromotionViewSet)

# Order routes
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'order-history', OrderHistoryViewSet, basename='order-history')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 