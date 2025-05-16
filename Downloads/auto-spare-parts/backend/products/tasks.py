from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from .models import Product, Review

@shared_task
def send_product_notification(product_id, notification_type):
    """Send notifications about product updates."""
    try:
        product = Product.objects.get(id=product_id)
        subject = _('Product Update Notification')
        
        if notification_type == 'price_change':
            message = _('The price of {product_name} has been updated.').format(
                product_name=product.name
            )
        elif notification_type == 'stock_update':
            message = _('The stock of {product_name} has been updated.').format(
                product_name=product.name
            )
        else:
            message = _('{product_name} has been updated.').format(
                product_name=product.name
            )
        
        # Get users who have this product in their wishlist or cart
        users = product.wishlist_users.all() | product.cart_users.all()
        
        for user in users:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
    except Product.DoesNotExist:
        pass

@shared_task
def process_product_review(review_id):
    """Process a new product review."""
    try:
        review = Review.objects.get(id=review_id)
        
        # Update product rating
        product = review.product
        product.update_rating()
        
        # Notify admin about new review
        subject = _('New Product Review')
        message = _('A new review has been submitted for {product_name}.').format(
            product_name=product.name
        )
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.ADMIN_EMAIL],
            fail_silently=False,
        )
    except Review.DoesNotExist:
        pass

@shared_task
def cleanup_unused_product_images():
    """Clean up unused product images."""
    from django.db.models import Q
    from .models import ProductImage
    
    # Find images that are not associated with any product
    unused_images = ProductImage.objects.filter(
        Q(product__isnull=True) | Q(product__is_active=False)
    )
    
    # Delete the unused images
    for image in unused_images:
        image.delete() 