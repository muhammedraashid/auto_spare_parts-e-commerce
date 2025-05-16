from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from parler.admin import TranslatableAdmin
from .models import Category, Brand, Product, ProductImage, Review, ProductVariant

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ('user', 'rating', 'title', 'comment', 'created_at')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Category)
class CategoryAdmin(TranslatableAdmin):
    list_display = ('get_name', 'parent', 'is_active', 'order')
    list_filter = ('is_active', 'parent')
    search_fields = ('translations__name', 'translations__description')
    ordering = ('order', 'translations__name')
    
    def get_name(self, obj):
        return obj.safe_translation_getter('name', any_language=True)
    get_name.short_description = _('Name')
    get_name.admin_order_field = 'translations__name'

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'parent', 'image', 'is_active', 'order')
        }),
    )

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    ordering = ('name',)
    
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'logo', 'is_active')
        }),
    )

@admin.register(Product)
class ProductAdmin(TranslatableAdmin):
    list_display = ('name', 'category', 'brand', 'price', 'stock', 'is_active', 'is_featured')
    list_filter = ('is_active', 'is_featured', 'category', 'brand')
    search_fields = ('translations__name', 'translations__description', 'sku')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'specs', 'category', 'brand')
        }),
        (_('Pricing & Stock'), {
            'fields': ('price', 'compare_at_price', 'stock', 'sku', 'barcode')
        }),
        (_('Status'), {
            'fields': ('is_active', 'is_featured')
        }),
    )
    
    inlines = [ProductImageInline, ProductVariantInline, ReviewInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'title', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'rating')
    search_fields = ('product__translations__name', 'user__email', 'title', 'comment')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('product', 'user', 'rating', 'title', 'comment')
        }),
        (_('Status'), {
            'fields': ('is_approved',)
        }),
    )
    
    def has_add_permission(self, request):
        return False 