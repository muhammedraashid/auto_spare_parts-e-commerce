
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart, Product } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';

// Mock product data
const productData: Product = {
  id: 1,
  name: 'Premium Brake Pads',
  nameAr: 'وسادات فرامل متميزة',
  price: 49.99,
  image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  category: 'brakes',
  stock: 15
};

// Mock related products
const relatedProducts: Product[] = [
  {
    id: 3,
    name: 'High-Performance Spark Plugs',
    nameAr: 'شمعات إشعال عالية الأداء',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    category: 'electrical',
    stock: 8
  },
  {
    id: 4,
    name: 'LED Headlight Bulbs',
    nameAr: 'مصابيح أمامية LED',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    category: 'electrical',
    stock: 12
  },
  {
    id: 10,
    name: 'Shock Absorbers Set',
    nameAr: 'مجموعة ممتصات الصدمات',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    category: 'brakes',
    stock: 10
  }
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // In a real app, you would fetch the product data based on the ID
  const product = productData;
  
  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const displayName = language === 'ar' && product.nameAr ? product.nameAr : product.name;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product image */}
            <div>
              <div className="aspect-square bg-auto-gray rounded-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Product details */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{displayName}</h1>
              
              <div className="text-2xl text-auto-red font-bold mb-4">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="flex items-center mb-4">
                <span className="mr-2 rtl:ml-2 rtl:mr-0">{t('product.quantity')}:</span>
                <div className="flex border border-gray-300 rounded-md">
                  <button 
                    onClick={decrementQuantity} 
                    className="px-3 py-1 border-r rtl:border-l rtl:border-r-0 border-gray-300"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    onClick={incrementQuantity} 
                    className="px-3 py-1 border-l rtl:border-r rtl:border-l-0 border-gray-300"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="ml-4 rtl:mr-4 rtl:ml-0 text-gray-500">
                  {product.stock} {t('product.quantity')} {t('product.original')}
                </span>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                className="bg-auto-red hover:bg-opacity-90 transition-colors w-full mb-4"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 rtl:ml-2 rtl:mr-0" size={18} />
                {t('product.addToCart')}
              </Button>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-bold mb-2">{t('product.description')}</h3>
                <p className="text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus purus, nec consequat nisl luctus nec. Nulla facilisi. Sed convallis, nisl nec aliquam ultricies, nunc nisi ultricies nunc, nec ultricies nisl nisi nec nisl.
                </p>
              </div>
            </div>
          </div>
          
          {/* Product specifications */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">{t('product.specifications')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex">
                <span className="font-medium w-1/3">Brand:</span>
                <span>Premium Auto Parts</span>
              </div>
              <div className="flex">
                <span className="font-medium w-1/3">Material:</span>
                <span>Ceramic</span>
              </div>
              <div className="flex">
                <span className="font-medium w-1/3">Position:</span>
                <span>Front</span>
              </div>
              <div className="flex">
                <span className="font-medium w-1/3">Warranty:</span>
                <span>1 Year</span>
              </div>
              <div className="flex">
                <span className="font-medium w-1/3">Country of Origin:</span>
                <span>Germany</span>
              </div>
              <div className="flex">
                <span className="font-medium w-1/3">Item Weight:</span>
                <span>2.5 kg</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{t('product.related')}</h2>
          <ProductGrid products={relatedProducts} columns={3} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
