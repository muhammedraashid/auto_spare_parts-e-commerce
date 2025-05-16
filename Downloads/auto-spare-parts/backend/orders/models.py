from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.core.validators import MinValueValidator
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField
from products.models import Product, ProductVariant

class Order(models.Model):
    """Model for customer orders."""
    STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('processing', _('Processing')),
        ('shipped', _('Shipped')),
        ('delivered', _('Delivered')),
        ('cancelled', _('Cancelled')),
        ('refunded', _('Refunded')),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('paid', _('Paid')),
        ('failed', _('Failed')),
        ('refunded', _('Refunded')),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('credit_card', _('Credit Card')),
        ('debit_card', _('Debit Card')),
        ('bank_transfer', _('Bank Transfer')),
        ('cash_on_delivery', _('Cash on Delivery')),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='orders')
    order_number = models.CharField(_('Order Number'), max_length=50, unique=True)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(_('Payment Status'), max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(_('Payment Method'), max_length=20, choices=PAYMENT_METHOD_CHOICES)
    
    # Customer Information
    email = models.EmailField(_('Email'))
    phone = PhoneNumberField(_('Phone Number'))
    shipping_name = models.CharField(_('Shipping Name'), max_length=200)
    shipping_address = models.TextField(_('Shipping Address'))
    shipping_city = models.CharField(_('Shipping City'), max_length=100)
    shipping_country = CountryField(_('Shipping Country'))
    shipping_postal_code = models.CharField(_('Shipping Postal Code'), max_length=20)
    
    # Order Details
    subtotal = models.DecimalField(_('Subtotal'), max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(_('Shipping Cost'), max_digits=10, decimal_places=2)
    tax = models.DecimalField(_('Tax'), max_digits=10, decimal_places=2)
    discount = models.DecimalField(_('Discount'), max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(_('Total'), max_digits=10, decimal_places=2)
    
    # Additional Information
    notes = models.TextField(_('Order Notes'), blank=True)
    tracking_number = models.CharField(_('Tracking Number'), max_length=100, blank=True)
    estimated_delivery = models.DateField(_('Estimated Delivery'), null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Order')
        verbose_name_plural = _('Orders')
    
    def __str__(self):
        return self.order_number
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate unique order number
            from django.utils import timezone
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
            self.order_number = f"ORD-{timestamp}"
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    """Model for individual items in an order."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, null=True, blank=True)
    quantity = models.PositiveIntegerField(_('Quantity'), validators=[MinValueValidator(1)])
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    total = models.DecimalField(_('Total'), max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = _('Order Item')
        verbose_name_plural = _('Order Items')
    
    def __str__(self):
        return f"{self.product} x {self.quantity}"
    
    def save(self, *args, **kwargs):
        self.total = self.price * self.quantity
        super().save(*args, **kwargs)

class OrderHistory(models.Model):
    """Model for tracking order status changes."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='history')
    status = models.CharField(_('Status'), max_length=20, choices=Order.STATUS_CHOICES)
    notes = models.TextField(_('Notes'), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Order History')
        verbose_name_plural = _('Order Histories')
    
    def __str__(self):
        return f"{self.order} - {self.status}"

class Payment(models.Model):
    """Model for order payments."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(_('Amount'), max_digits=10, decimal_places=2)
    payment_method = models.CharField(_('Payment Method'), max_length=20, choices=Order.PAYMENT_METHOD_CHOICES)
    transaction_id = models.CharField(_('Transaction ID'), max_length=100, blank=True)
    status = models.CharField(_('Status'), max_length=20, choices=Order.PAYMENT_STATUS_CHOICES)
    payment_date = models.DateTimeField(_('Payment Date'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')
    
    def __str__(self):
        return f"Payment for {self.order}"
