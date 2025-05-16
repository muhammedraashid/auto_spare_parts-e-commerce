
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveBanners } from '@/services/bannerService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const BannerSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';
  
  const { data: banners, isLoading, error } = useQuery({
    queryKey: ['activeBanners'],
    queryFn: fetchActiveBanners,
    retry: 1,
  });
  
  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="w-full h-[300px] md:h-[400px] rounded-xl" />
        </div>
      </section>
    );
  }
  
  if (error) {
    console.error("Banner loading error:", error);
    return null; // Hide section completely on error to avoid disrupting the page flow
  }
  
  // Filter only active banners and check if there are any
  const activeBanners = banners?.filter(banner => banner.active) || [];
  
  if (activeBanners.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {activeBanners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div 
                  className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden"
                  style={{ 
                    backgroundImage: `url(${banner.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                    <div className={`text-white max-w-lg p-8 ${isRtl ? 'text-right mr-auto' : 'text-left ml-8'}`}>
                      <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        {isRtl ? banner.titleAr : banner.titleEn}
                      </h2>
                      <p className="text-lg mb-6 opacity-90">
                        {isRtl ? banner.descriptionAr : banner.descriptionEn}
                      </p>
                      <Button asChild size="lg" className="font-medium">
                        <Link to={banner.url}>
                          {isRtl ? banner.ctaAr : banner.ctaEn}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {activeBanners.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default BannerSection;
