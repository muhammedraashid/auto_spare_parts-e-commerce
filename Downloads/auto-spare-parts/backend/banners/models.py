from django.db import models
from django.utils.translation import gettext_lazy as _
from parler.models import TranslatableModel, TranslatedFields
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

class Banner(TranslatableModel):
    """Banner model for homepage and promotional sections."""
    translations = TranslatedFields(
        title=models.CharField(_('Title'), max_length=200),
        description=models.TextField(_('Description'), blank=True),
        cta_text=models.CharField(_('Call to Action Text'), max_length=50, default='Shop Now'),
        meta_title=models.CharField(_('Meta Title'), max_length=100, blank=True),
        meta_description=models.TextField(_('Meta Description'), blank=True)
    )
    image = models.ImageField(_('Banner Image'), upload_to='banners/')
    image_thumbnail = ImageSpecField(
        source='image',
        processors=[ResizeToFill(800, 400)],
        format='JPEG',
        options={'quality': 90}
    )
    url = models.CharField(_('URL'), max_length=255, help_text=_('Target URL for the banner'))
    active = models.BooleanField(_('Active'), default=True)
    order = models.PositiveSmallIntegerField(_('Display Order'), default=0)
    start_date = models.DateTimeField(_('Start Date'), null=True, blank=True)
    end_date = models.DateTimeField(_('End Date'), null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = _('Banner')
        verbose_name_plural = _('Banners')
    
    def __str__(self):
        return self.safe_translation_getter('title', any_language=True)
    
    @property
    def is_active_now(self):
        """Check if the banner is currently active based on dates."""
        from django.utils import timezone
        now = timezone.now()
        if self.start_date and self.start_date > now:
            return False
        if self.end_date and self.end_date < now:
            return False
        return self.active

class Promotion(TranslatableModel):
    """Model for promotional offers and discounts."""
    translations = TranslatedFields(
        title=models.CharField(_('Title'), max_length=200),
        description=models.TextField(_('Description'), blank=True),
        terms=models.TextField(_('Terms and Conditions'), blank=True)
    )
    code = models.CharField(_('Promo Code'), max_length=50, unique=True)
    discount_type = models.CharField(_('Discount Type'), max_length=20, choices=[
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount')
    ])
    discount_value = models.DecimalField(_('Discount Value'), max_digits=10, decimal_places=2)
    min_purchase = models.DecimalField(_('Minimum Purchase'), max_digits=10, decimal_places=2, null=True, blank=True)
    max_discount = models.DecimalField(_('Maximum Discount'), max_digits=10, decimal_places=2, null=True, blank=True)
    start_date = models.DateTimeField(_('Start Date'))
    end_date = models.DateTimeField(_('End Date'))
    is_active = models.BooleanField(_('Active'), default=True)
    usage_limit = models.PositiveIntegerField(_('Usage Limit'), null=True, blank=True)
    usage_count = models.PositiveIntegerField(_('Usage Count'), default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Promotion')
        verbose_name_plural = _('Promotions')
    
    def __str__(self):
        return self.safe_translation_getter('title', any_language=True)
    
    @property
    def is_valid(self):
        """Check if the promotion is currently valid."""
        from django.utils import timezone
        now = timezone.now()
        if not self.is_active:
            return False
        if self.start_date > now:
            return False
        if self.end_date < now:
            return False
        if self.usage_limit and self.usage_count >= self.usage_limit:
            return False
        return True
