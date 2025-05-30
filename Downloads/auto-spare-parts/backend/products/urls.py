
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet)
router.register('products', views.ProductViewSet)
router.register('product-images', views.ProductImageViewSet)
router.register('reviews', views.ReviewViewSet)
router.register('brands', views.BrandViewSet) 


urlpatterns = [
    path('', include(router.urls)),
]
