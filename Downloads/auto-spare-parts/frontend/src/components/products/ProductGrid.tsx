
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../contexts/CartContext';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  wishlistItems?: Product[];
  onWishlistToggle?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  columns = 3,
  wishlistItems = [],
  onWishlistToggle
}) => {
  let gridClass = 'grid-cols-1 sm:grid-cols-2';
  
  if (columns === 3) {
    gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  } else if (columns === 4) {
    gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onWishlistToggle={onWishlistToggle}
          isInWishlist={wishlistItems.some(item => item.id === product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
