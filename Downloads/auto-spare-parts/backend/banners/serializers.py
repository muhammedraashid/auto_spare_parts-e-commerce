from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer
from .models import Banner, Promotion

class BannerSerializer(TranslatableModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'title', 'description', 'cta_text', 'cta_url', 
                 'image', 'image_thumbnail', 'is_active', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']

class PromotionSerializer(TranslatableModelSerializer):
    class Meta:
        model = Promotion
        fields = ['id', 'title', 'description', 'discount_type', 'discount_value',
                 'start_date', 'end_date', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
