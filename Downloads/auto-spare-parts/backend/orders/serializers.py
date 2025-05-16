from rest_framework import serializers
from products.serializers import ProductListSerializer
from .models import Order, OrderItem, OrderHistory, Payment

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    variant_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'variant_id', 'quantity', 
                 'price', 'total']
        read_only_fields = ['id', 'price', 'total']

class OrderHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderHistory
        fields = ['id', 'status', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'payment_method', 'transaction_id', 
                 'status', 'payment_date']
        read_only_fields = ['id', 'payment_date']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    history = OrderHistorySerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'status', 'payment_status',
                 'payment_method', 'email', 'phone', 'shipping_address',
                 'shipping_city', 'shipping_country', 'shipping_postal_code',
                 'billing_address', 'billing_city', 'billing_country',
                 'billing_postal_code', 'subtotal', 'shipping_cost', 'tax',
                 'discount', 'total', 'notes', 'tracking_number', 'items',
                 'history', 'payment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'order_number', 'user', 'status', 
                           'payment_status', 'created_at', 'updated_at']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = ['email', 'phone', 'shipping_address', 'shipping_city',
                 'shipping_country', 'shipping_postal_code', 'billing_address',
                 'billing_city', 'billing_country', 'billing_postal_code',
                 'payment_method', 'notes', 'items']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        # Create order
        order = Order.objects.create(
            user=user,
            **validated_data
        )
        
        # Create order items
        for item_data in items_data:
            product_id = item_data.pop('product_id')
            variant_id = item_data.pop('variant_id', None)
            
            OrderItem.objects.create(
                order=order,
                product_id=product_id,
                variant_id=variant_id,
                **item_data
            )
        
        # Create initial order history
        OrderHistory.objects.create(
            order=order,
            status=order.status,
            notes='Order created'
        )
        
        return order

class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'payment_status', 'tracking_number', 'notes']
    
    def update(self, instance, validated_data):
        # Create order history entry if status changed
        if 'status' in validated_data and validated_data['status'] != instance.status:
            OrderHistory.objects.create(
                order=instance,
                status=validated_data['status'],
                notes=validated_data.get('notes', '')
            )
        
        return super().update(instance, validated_data)
