from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from .models import Order, OrderHistory

@shared_task
def send_order_confirmation(order_id):
    """Send order confirmation email to customer."""
    try:
        order = Order.objects.get(id=order_id)
        subject = _('Order Confirmation - {order_number}').format(
            order_number=order.order_number
        )
        
        message = _("""
        Dear {customer_name},
        
        Thank you for your order. Your order details are as follows:
        
        Order Number: {order_number}
        Total Amount: {total}
        
        We will process your order shortly.
        
        Best regards,
        {store_name}
        """).format(
            customer_name=order.user.name if order.user else order.email,
            order_number=order.order_number,
            total=order.total,
            store_name=settings.STORE_NAME
        )
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [order.email],
            fail_silently=False,
        )
    except Order.DoesNotExist:
        pass

@shared_task
def process_order_status_update(order_id, new_status, notes=''):
    """Process order status updates and send notifications."""
    try:
        order = Order.objects.get(id=order_id)
        old_status = order.status
        order.status = new_status
        order.save()
        
        # Create order history entry
        OrderHistory.objects.create(
            order=order,
            status=new_status,
            notes=notes
        )
        
        # Send notification email
        subject = _('Order Status Update - {order_number}').format(
            order_number=order.order_number
        )
        
        message = _("""
        Dear {customer_name},
        
        Your order status has been updated:
        
        Order Number: {order_number}
        Previous Status: {old_status}
        New Status: {new_status}
        
        {notes}
        
        Best regards,
        {store_name}
        """).format(
            customer_name=order.user.name if order.user else order.email,
            order_number=order.order_number,
            old_status=old_status,
            new_status=new_status,
            notes=notes,
            store_name=settings.STORE_NAME
        )
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [order.email],
            fail_silently=False,
        )
    except Order.DoesNotExist:
        pass

@shared_task
def cleanup_abandoned_carts():
    """Clean up abandoned carts older than 7 days."""
    from django.utils import timezone
    from datetime import timedelta
    
    # Find abandoned carts (orders with status 'pending' older than 7 days)
    cutoff_date = timezone.now() - timedelta(days=7)
    abandoned_orders = Order.objects.filter(
        status='pending',
        created_at__lt=cutoff_date
    )
    
    # Update status to 'cancelled'
    for order in abandoned_orders:
        process_order_status_update.delay(
            order.id,
            'cancelled',
            _('Order automatically cancelled due to inactivity.')
        ) 