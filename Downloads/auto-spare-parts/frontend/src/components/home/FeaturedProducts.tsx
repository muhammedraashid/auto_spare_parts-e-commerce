
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import ProductGrid from '../products/ProductGrid';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedProducts } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const FeaturedProducts: React.FC = () => {
  const { t } = useLanguage();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts,
    retry: 1,
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t('home.featured')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-lg overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Featured products loading error:", error);
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t('home.featured')}
          </h2>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {t('error.loading')}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t('home.featured')}
        </h2>
        
        {products && products.length > 0 ? (
          <ProductGrid products={products} columns={3} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            {t('product.noProducts')}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
