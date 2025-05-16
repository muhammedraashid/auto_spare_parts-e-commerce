# from celery import Celery
# app = Celery('qitaf_auto')
# app.config_from_object('django.conf:settings', namespace='CELERY')
# app.autodiscover_tasks()

from .celery import app as celery_app

__all__ = ('celery_app',) 