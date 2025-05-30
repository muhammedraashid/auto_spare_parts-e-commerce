from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer
from .models import Banner, Promotion
from parler_rest.fields import TranslatedFieldsField

class BannerSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Banner)
    image = serializers.ImageField(use_url=True)
    image_thumbnail = serializers.ImageField(use_url=True, read_only=True)

    class Meta:
        model = Banner
        fields = ['id', 'translations', 'image', 'image_thumbnail', 'url', 'active', 'order', 'created_at']
        read_only_fields = ['id', 'created_at','is_active_now']

class PromotionSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Promotion)
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Promotion
        fields = ['id', 'translations', 'discount_type', 'discount_value',
                 'start_date', 'end_date', 'is_active', 'created_at', 'is_valid']
        read_only_fields = ['id', 'created_at', 'is_valid']
