
import React, { useCallback, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Star, StarHalf, Award, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTopRatedProducts } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Helper component for rendering star ratings
const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
  }
  
  if (halfStar) {
    stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
  }

  return <div className="flex">{stars}</div>;
};

const TopRatedProducts: React.FC = () => {
  const { t, language } = useLanguage();
  const carouselRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { data: topRatedProducts, isLoading, error } = useQuery({
    queryKey: ['topRatedProducts'],
    queryFn: fetchTopRatedProducts,
    retry: 1,
  });

  // Helper function to update navigation button states
  const updateNavState = useCallback(() => {
    if (carouselRef.current?.api) {
      setIsBeginning(carouselRef.current.api.canScrollPrev() === false);
      setIsEnd(carouselRef.current.api.canScrollNext() === false);
    }
  }, []);

  // Handle API initialization and scroll events
  const handleCarouselApi = useCallback((api: any) => {
    if (!api) return;
    
    api.on('select', updateNavState);
    api.on('reInit', updateNavState);
    
    // Initial state
    updateNavState();
    
    // Clean up event handlers
    return () => {
      api.off('select', updateNavState);
      api.off('reInit', updateNavState);
    };
  }, [updateNavState]);

  // Custom navigation handlers with smoother transitions
  const handlePrev = useCallback(() => {
    if (carouselRef.current?.api) {
      carouselRef.current.api.scrollPrev({
        duration: 500,
        easing: (t: number) => 1 - Math.pow(1 - t, 3) // Cubic ease-out for smoother transition
      });
      updateNavState();
    }
  }, [updateNavState]);

  const handleNext = useCallback(() => {
    if (carouselRef.current?.api) {
      carouselRef.current.api.scrollNext({
        duration: 500,
        easing: (t: number) => 1 - Math.pow(1 - t, 3) // Cubic ease-out for smoother transition
      });
      updateNavState();
    }
  }, [updateNavState]);

  if (isLoading) {
    return (
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">{t('home.topRated.title')}</h2>
              <Skeleton className="h-5 w-48 mt-2" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-md">
                <Skeleton className="h-48 rounded-t-lg" />
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-6 w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Top rated products loading error:", error);
    return (
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">{t('home.topRated.title')}</h2>
              <p className="text-muted-foreground mt-2">{t('home.topRated.subtitle')}</p>
            </div>
          </div>
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

  if (!topRatedProducts || topRatedProducts.length === 0) {
    return (
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">{t('home.topRated.title')}</h2>
              <p className="text-muted-foreground mt-2">{t('home.topRated.subtitle')}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">{t('home.viewAll')}</Link>
            </Button>
          </div>
          <div className="text-center py-12 text-gray-500">
            {t('product.noProducts')}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">{t('home.topRated.title')}</h2>
            <p className="text-muted-foreground mt-2">{t('home.topRated.subtitle')}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/products">{t('home.viewAll')}</Link>
          </Button>
        </div>

        <Carousel 
          ref={carouselRef}
          className="w-full"
          opts={{
            align: 'start',
            loop: false,
            containScroll: 'trimSnaps',
            dragFree: true, // Makes dragging feel more responsive
          }}
          setApi={handleCarouselApi}
        >
          <CarouselContent className="-ml-4">
            {topRatedProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={language === 'ar' && product.nameAr ? product.nameAr : product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Award className="w-3.5 h-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                          {language === 'ar' && product.badgeAr ? product.badgeAr : product.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {language === 'ar' && product.nameAr ? product.nameAr : product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <RatingStars rating={product.rating} />
                      <span className="text-sm text-muted-foreground">
                        ({product.rating}) · {product.reviewCount} {t('product.reviews')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-lg">{product.price}</span>
                      <Button size="sm" asChild>
                        <Link to={`/products/${product.id}`}>{t('product.viewDetails')}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Custom navigation buttons with improved styling and transitions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            onClick={handlePrev}
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full transition-all duration-300 ${
              isBeginning 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-primary hover:text-primary-foreground hover:scale-105'
            }`}
            disabled={isBeginning}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button 
            onClick={handleNext}
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full transition-all duration-300 ${
              isEnd 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-primary hover:text-primary-foreground hover:scale-105'
            }`}
            disabled={isEnd}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopRatedProducts;
