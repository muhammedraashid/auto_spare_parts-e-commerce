from celery import shared_task
from django.utils import timezone
from .models import Banner, Promotion

@shared_task
def cleanup_expired_banners():
    """Clean up expired banners."""
    # Find banners that are no longer active
    expired_banners = Banner.objects.filter(
        is_active=True,
        end_date__lt=timezone.now()
    )
    
    # Update their status
    expired_banners.update(is_active=False)

@shared_task
def cleanup_expired_promotions():
    """Clean up expired promotions."""
    # Find promotions that have ended
    expired_promotions = Promotion.objects.filter(
        is_active=True,
        end_date__lt=timezone.now()
    )
    
    # Update their status
    expired_promotions.update(is_active=False)

@shared_task
def activate_scheduled_banners():
    """Activate banners that are scheduled to start."""
    # Find banners that should be active but aren't
    now = timezone.now()
    scheduled_banners = Banner.objects.filter(
        is_active=False,
        start_date__lte=now,
        end_date__gt=now
    )
    
    # Activate them
    scheduled_banners.update(is_active=True)

@shared_task
def activate_scheduled_promotions():
    """Activate promotions that are scheduled to start."""
    # Find promotions that should be active but aren't
    now = timezone.now()
    scheduled_promotions = Promotion.objects.filter(
        is_active=False,
        start_date__lte=now,
        end_date__gt=now
    )
    
    # Activate them
    scheduled_promotions.update(is_active=True) 