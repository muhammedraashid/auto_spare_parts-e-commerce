
import React from 'react';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';

const CartPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 mb-4">
              <ShoppingCart size={64} className="mx-auto mb-4" />
              <p className="text-xl">{t('cart.empty')}</p>
            </div>
            <Button asChild className="bg-auto-red hover:bg-opacity-90">
              <Link to="/products">{t('cart.continue')}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-auto-gray border-b">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5 font-medium">{t('nav.products')}</div>
                    <div className="col-span-2 font-medium text-center">{t('product.price')}</div>
                    <div className="col-span-3 font-medium text-center">{t('product.quantity')}</div>
                    <div className="col-span-2 font-medium text-center">{t('cart.total')}</div>
                  </div>
                </div>

                {items.map((item) => {
                  const displayName = language === 'ar' && item.product.nameAr 
                    ? item.product.nameAr 
                    : item.product.name;
                  
                  return (
                    <div key={item.product.id} className="p-4 border-b">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Product */}
                        <div className="col-span-5">
                          <div className="flex items-center">
                            <div className="w-16 h-16 overflow-hidden rounded">
                              <img 
                                src={item.product.image} 
                                alt={displayName} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4 rtl:mr-4 rtl:ml-0">
                              <Link 
                                to={`/products/${item.product.id}`}
                                className="font-medium hover:text-auto-red transition-colors"
                              >
                                {displayName}
                              </Link>
                              <button 
                                onClick={() => handleRemoveItem(item.product.id)}
                                className="text-sm text-red-500 flex items-center mt-1"
                              >
                                <Trash2 size={14} className="mr-1 rtl:ml-1 rtl:mr-0" />
                                {t('cart.remove')}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          ${item.product.price.toFixed(2)}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-3">
                          <div className="flex justify-center">
                            <div className="flex border border-gray-300 rounded-md">
                              <button 
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)} 
                                className="px-3 py-1 border-r rtl:border-l rtl:border-r-0 border-gray-300"
                              >
                                -
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)} 
                                className="px-3 py-1 border-l rtl:border-r rtl:border-l-0 border-gray-300"
                                disabled={item.quantity >= item.product.stock}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="col-span-2 text-center font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Clear cart */}
                <div className="p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={clearCart} 
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    {t('cart.remove')}
                  </Button>
                  <Button asChild className="bg-auto-dark hover:bg-auto-red transition-colors">
                    <Link to="/products">{t('cart.continue')}</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">{t('cart.total')}</h2>

                <div className="space-y-4 border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.shipping')}</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.tax')}</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>{t('cart.total')}</span>
                  <span>${(totalPrice + (totalPrice * 0.1)).toFixed(2)}</span>
                </div>

                <Button className="w-full bg-auto-red hover:bg-opacity-90">
                  {t('cart.checkout')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
