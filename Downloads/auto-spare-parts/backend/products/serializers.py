from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer
from .models import Category, Brand, Product, ProductImage, Review, ProductVariant

from parler_rest.serializers import TranslatedFieldsField

class CategorySerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField()
    image = serializers.ImageField(required=False, allow_null=True)
    image_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'translations', 'slug', 'parent', 'image', 'image_thumbnail',
                  'is_active', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']

    # def get_image(self, obj):
    #     if obj.image and hasattr(obj.image, 'url'):
    #         return obj.image.url
    #     return None

    def get_image_thumbnail(self, obj):
        if obj.image_thumbnail and hasattr(obj.image_thumbnail, 'url'):
            return obj.image_thumbnail.url
        return None  



class BrandSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(use_url=True, required=False, allow_null=True)
    logo_thumbnail = serializers.ImageField(source='get_logo_thumbnail_url', read_only=True)

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'logo_thumbnail', 'description', 
                  'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    image_thumbnail = serializers.ImageField(use_url=True, required=False)
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_thumbnail', 'alt_text', 'order']
        read_only_fields = ['id']

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'sku', 'price', 'stock', 'is_active']
        read_only_fields = ['id']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'user_name', 'rating', 'title', 
                 'comment', 'is_approved', 'created_at']
        read_only_fields = ['id', 'user', 'is_approved', 'created_at']

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['product', 'rating', 'title', 'comment']



class ProductListSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    image = serializers.ImageField(use_url=True)
    image_thumbnail = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model = Product
        fields = ['id', 'translations', 'category', 'category_name',
                 'brand', 'brand_name', 'price', 'compare_at_price',
                 'discount_percentage', 'stock', 'image', 'image_thumbnail',
                 'is_featured', 'rating', 'review_count', 'created_at']


class ProductDetailSerializer(TranslatableModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'specs', 'category', 'brand', 
                 'price', 'compare_at_price', 'discount_percentage', 'stock', 
                 'sku', 'barcode', 'image', 'image_thumbnail', 'images', 
                 'variants', 'is_featured', 'is_active', 'rating', 'review_count', 
                 'reviews', 'created_at', 'updated_at']
        read_only_fields = ['id', 'rating', 'review_count', 'created_at', 'updated_at']

class ProductCreateUpdateSerializer(TranslatableModelSerializer):
    images = ProductImageSerializer(many=True, required=False)
    variants = ProductVariantSerializer(many=True, required=False)
    translations = TranslatedFieldsField()
    image = serializers.ImageField(required=False)
    image_thumbnail = serializers.ImageField(use_url=True, required=False)
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all(), required=False, allow_null=True)


    class Meta:
        model = Product
        fields = [
            'translations', 'category', 'brand',
            'price', 'compare_at_price', 'stock', 'sku', 'barcode', 'image',
            'image_thumbnail', 'is_featured', 'is_active', 'images', 'variants'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])

        product = Product.objects.create(**validated_data)

        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)

        for variant_data in variants_data:
            ProductVariant.objects.create(product=product, **variant_data)

        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if images_data:
            instance.images.all().delete()
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)

        if variants_data:
            instance.variants.all().delete()
            for variant_data in variants_data:
                ProductVariant.objects.create(product=instance, **variant_data)

        return instance
