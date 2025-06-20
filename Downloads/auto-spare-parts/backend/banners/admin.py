from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Banner, Promotion
from parler.admin import TranslatableAdmin

@admin.register(Banner)
class BannerAdmin(TranslatableAdmin):
    list_display = ('title', 'get_is_active', 'start_date', 'end_date', 'order')
    list_filter = ('active', 'start_date', 'end_date')
    search_fields = ('translations__title', 'translations__description')
    ordering = ('order', '-start_date')
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'image', 'cta_text', 'url')
        }),
        (_('Schedule'), {
            'fields': ('start_date', 'end_date')
        }),
        (_('Status'), {
            'fields': ('active', 'order')
        }),
    )
    
    def get_is_active(self, obj):
        return obj.active
    get_is_active.short_description = _('Active')
    get_is_active.boolean = True

@admin.register(Promotion)
class PromotionAdmin(TranslatableAdmin):
    list_display = ('title', 'get_is_active', 'start_date', 'end_date', 'discount_value')
    list_filter = ('is_active', 'start_date', 'end_date')
    search_fields = ('translations__title', 'translations__description')
    ordering = ('-start_date',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description')
        }),
        (_('Discount'), {
            'fields': ('discount_type', 'discount_value')
        }),
        (_('Schedule'), {
            'fields': ('start_date', 'end_date')
        }),
        (_('Status'), {
            'fields': ('is_active',)
        }),
    )
    
    def get_is_active(self, obj):
        return obj.is_active
    get_is_active.short_description = _('Active')
    get_is_active.boolean = True 