from celery.schedules import crontab

# Celery Beat Schedule
CELERY_BEAT_SCHEDULE = {
    # Clean up expired banners and promotions every day at midnight
    'cleanup-expired-banners': {
        'task': 'banners.tasks.cleanup_expired_banners',
        'schedule': crontab(hour=0, minute=0),
    },
    'cleanup-expired-promotions': {
        'task': 'banners.tasks.cleanup_expired_promotions',
        'schedule': crontab(hour=0, minute=0),
    },
    
    # Activate scheduled banners and promotions every hour
    'activate-scheduled-banners': {
        'task': 'banners.tasks.activate_scheduled_banners',
        'schedule': crontab(minute=0),
    },
    'activate-scheduled-promotions': {
        'task': 'banners.tasks.activate_scheduled_promotions',
        'schedule': crontab(minute=0),
    },
    
    # Clean up abandoned carts every day at 3 AM
    'cleanup-abandoned-carts': {
        'task': 'orders.tasks.cleanup_abandoned_carts',
        'schedule': crontab(hour=3, minute=0),
    },
    
    # Clean up unused product images every week on Sunday at 2 AM
    'cleanup-unused-product-images': {
        'task': 'products.tasks.cleanup_unused_product_images',
        'schedule': crontab(hour=2, minute=0, day_of_week=0),
    },
} 