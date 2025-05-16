from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _
from .models import Order, OrderItem, OrderHistory, Payment
from .serializers import (
    OrderSerializer, OrderCreateSerializer, OrderUpdateSerializer,
    OrderItemSerializer, OrderHistorySerializer, PaymentSerializer
)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status']
    ordering_fields = ['created_at', 'total']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        return OrderSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status not in ['pending', 'processing']:
            return Response(
                {'detail': _('Cannot cancel order in current status.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        
        OrderHistory.objects.create(
            order=order,
            status='cancelled',
            notes=_('Order cancelled by user.')
        )
        
        return Response({'detail': _('Order cancelled successfully.')})
    
    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        order = self.get_object()
        if order.payment_status == 'paid':
            return Response(
                {'detail': _('Order is already paid.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        payment = serializer.save(
            order=order,
            amount=order.total
        )
        
        if payment.status == 'completed':
            order.payment_status = 'paid'
            order.save()
            
            OrderHistory.objects.create(
                order=order,
                status=order.status,
                notes=_('Payment completed successfully.')
            )
        
        return Response(serializer.data)

class OrderHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return OrderHistory.objects.all()
        return OrderHistory.objects.filter(order__user=user)
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order']

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order', 'status', 'payment_method']
    
    def get_queryset(self):
        # Admin users can see all payments, regular users can only see their own
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(order__user=user)
