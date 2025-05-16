from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Order, OrderItem, OrderHistory, Payment

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'variant', 'quantity', 'price', 'total')

class OrderHistoryInline(admin.TabularInline):
    model = OrderHistory
    extra = 0
    readonly_fields = ('status', 'notes', 'created_at')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ('amount', 'payment_method', 'transaction_id', 'status', 'payment_date')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'payment_status', 'total', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method')
    search_fields = ('order_number', 'user__email', 'user__name', 'email', 'phone')
    readonly_fields = ('order_number', 'user', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('order_number', 'user', 'status', 'payment_status', 'payment_method')
        }),
        (_('Customer Information'), {
            'fields': ('email', 'phone')
        }),
        (_('Shipping Address'), {
            'fields': ('shipping_address', 'shipping_city', 'shipping_country', 'shipping_postal_code')
        }),
        (_('Billing Address'), {
            'fields': ('billing_address', 'billing_city', 'billing_country', 'billing_postal_code')
        }),
        (_('Order Details'), {
            'fields': ('subtotal', 'shipping_cost', 'tax', 'discount', 'total', 'notes', 'tracking_number')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    inlines = [OrderItemInline, OrderHistoryInline, PaymentInline]
    
    def has_add_permission(self, request):
        return False

@admin.register(OrderHistory)
class OrderHistoryAdmin(admin.ModelAdmin):
    list_display = ('order', 'status', 'notes', 'created_at')
    list_filter = ('status',)
    search_fields = ('order__order_number', 'notes')
    readonly_fields = ('order', 'status', 'notes', 'created_at')
    ordering = ('-created_at',)
    
    def has_add_permission(self, request):
        return False

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'amount', 'payment_method', 'status', 'payment_date')
    list_filter = ('payment_method', 'status')
    search_fields = ('order__order_number', 'transaction_id')
    readonly_fields = ('order', 'amount', 'payment_method', 'transaction_id', 'status', 'payment_date')
    ordering = ('-payment_date',)
    
    def has_add_permission(self, request):
        return False 