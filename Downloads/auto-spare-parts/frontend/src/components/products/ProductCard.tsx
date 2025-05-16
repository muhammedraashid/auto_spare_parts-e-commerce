
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../../contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (product: Product) => void;
  isInWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onWishlistToggle, 
  isInWishlist = false 
}) => {
  const { t, language } = useLanguage();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(t('cart.itemAdded'));
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(product);
    }
    toast.success(isInWishlist ? t('wishlist.itemRemoved') : t('wishlist.itemAdded'));
  };

  const displayName = language === 'ar' && product.nameAr ? product.nameAr : product.name;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border border-gray-100">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative pb-[75%]">
          <img 
            src={product.image} 
            alt={displayName} 
            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="px-3 py-1 text-sm font-medium">
                {t('product.outOfStock')}
              </Badge>
            </div>
          )}
          
          {/* Wishlist button */}
          <div className="absolute top-2 right-2">
            <Button
              onClick={handleWishlistClick}
              size="icon"
              variant="secondary"
              className={`h-8 w-8 rounded-full bg-white shadow-sm ${isInWishlist ? 'text-auto-red' : 'text-gray-700 hover:text-auto-red'}`}
            >
              <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Category badge */}
          <div className="mb-2">
            <Badge variant="outline" className="text-xs capitalize bg-gray-50">
              {product.category}
            </Badge>
          </div>
          
          <h3 className="font-medium text-lg mb-1 line-clamp-2 group-hover:text-auto-red transition-colors">
            {displayName}
          </h3>
          
          {/* Rating stars placeholder */}
          <div className="flex items-center mb-2">
            <div className="flex items-center text-amber-400">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} className="text-gray-300" />
            </div>
            <span className="text-xs text-gray-500 ml-1">(12)</span>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="text-auto-red font-bold text-lg">${product.price.toFixed(2)}</div>
            {product.stock > 0 ? (
              <Button 
                onClick={handleAddToCart} 
                size="sm" 
                className="bg-auto-dark hover:bg-auto-red transition-colors"
              >
                <ShoppingCart size={16} className="mr-1 rtl:ml-1 rtl:mr-0" />
                {t('product.addToCart')}
              </Button>
            ) : (
              <Button disabled size="sm" variant="outline">
                {t('product.outOfStock')}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
