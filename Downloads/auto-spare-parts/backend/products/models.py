from django.db import models
from django.utils.translation import gettext_lazy as _
from parler.models import TranslatableModel, TranslatedFields
from mptt.models import MPTTModel, TreeForeignKey
from taggit.managers import TaggableManager
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings

class Category(MPTTModel, TranslatableModel):
    """Category model with multilingual fields and tree structure."""
    translations = TranslatedFields(
        name=models.CharField(_('Name'), max_length=100),
        description=models.TextField(_('Description'), blank=True),
        meta_title=models.CharField(_('Meta Title'), max_length=100, blank=True),
        meta_description=models.TextField(_('Meta Description'), blank=True)
    )
    slug = models.SlugField(_('Slug'), max_length=100, unique=True)
    parent = TreeForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    image = models.ImageField(_('Image'), upload_to='categories/', blank=True, null=True)
    image_thumbnail = ImageSpecField(
        source='image',
        processors=[ResizeToFill(300, 300)],
        format='JPEG',
        options={'quality': 90}
    )
    is_active = models.BooleanField(_('Active'), default=True)
    order = models.PositiveIntegerField(_('Order'), default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['order', 'translations__name']
    
    class MPTTMeta:
        order_insertion_by = ['order', 'translations__name']
    
    def __str__(self):
        return self.safe_translation_getter('name', any_language=True) or self.slug

class Brand(models.Model):
    """Brand model for products."""
    name = models.CharField(_('Name'), max_length=100)
    slug = models.SlugField(_('Slug'), max_length=100, unique=True)
    logo = models.ImageField(_('Logo'), upload_to='brands/', blank=True, null=True)
    logo_thumbnail = ImageSpecField(
        source='logo',
        processors=[ResizeToFill(200, 200)],
        format='JPEG',
        options={'quality': 90}
    )
    description = models.TextField(_('Description'), blank=True)
    is_active = models.BooleanField(_('Active'), default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Brand')
        verbose_name_plural = _('Brands')
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Product(TranslatableModel):
    """Product model with multilingual fields."""
    translations = TranslatedFields(
        name=models.CharField(_('Name'), max_length=200),
        description=models.TextField(_('Description'), blank=True),
        specs=models.JSONField(_('Specifications'), default=dict, blank=True),
        meta_title=models.CharField(_('Meta Title'), max_length=100, blank=True),
        meta_description=models.TextField(_('Meta Description'), blank=True)
    )
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(_('Compare at Price'), max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(_('Stock'), default=0)
    sku = models.CharField(_('SKU'), max_length=50, unique=True)
    barcode = models.CharField(_('Barcode'), max_length=50, blank=True)
    image = models.ImageField(_('Main Image'), upload_to='products/')
    image_thumbnail = ImageSpecField(
        source='image',
        processors=[ResizeToFill(300, 300)],
        format='JPEG',
        options={'quality': 90}
    )
    is_featured = models.BooleanField(_('Featured'), default=False)
    is_active = models.BooleanField(_('Active'), default=True)
    rating = models.DecimalField(_('Rating'), max_digits=3, decimal_places=2, default=0.0)
    review_count = models.PositiveIntegerField(_('Review Count'), default=0)
    tags = TaggableManager(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.safe_translation_getter('name', any_language=True) or self.sku
    
    @property
    def discount_percentage(self):
        if self.compare_at_price and self.compare_at_price > self.price:
            return int(((self.compare_at_price - self.price) / self.compare_at_price) * 100)
        return 0

class ProductImage(models.Model):
    """Model for additional product images."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(_('Image'), upload_to='products/')
    image_thumbnail = ImageSpecField(
        source='image',
        processors=[ResizeToFill(300, 300)],
        format='JPEG',
        options={'quality': 90}
    )
    alt_text = models.CharField(_('Alt text'), max_length=200, blank=True)
    order = models.PositiveSmallIntegerField(_('Order'), default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = _('Product Image')
        verbose_name_plural = _('Product Images')
    
    def __str__(self):
        return f"Image for {self.product}"

class Review(models.Model):
    """Model for product reviews."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        _('Rating'),
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(_('Title'), max_length=200)
    comment = models.TextField(_('Comment'))
    is_approved = models.BooleanField(_('Approved'), default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('product', 'user')
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review by {self.user} for {self.product}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update product rating
        reviews = self.product.reviews.filter(is_approved=True)
        if reviews.exists():
            avg_rating = reviews.aggregate(models.Avg('rating'))['rating__avg']
            self.product.rating = avg_rating
            self.product.review_count = reviews.count()
            self.product.save()

class ProductVariant(models.Model):
    """Model for product variants (e.g., size, color)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(_('Name'), max_length=100)
    sku = models.CharField(_('SKU'), max_length=50, unique=True)
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(_('Stock'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Product Variant')
        verbose_name_plural = _('Product Variants')
        ordering = ['name']
    
    def __str__(self):
        return f"{self.product} - {self.name}"
    
    @property
    def final_price(self):
        return self.price or self.product.price
