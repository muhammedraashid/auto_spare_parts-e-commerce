
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowUp, ArrowDown, Trash } from 'lucide-react';
import { Banner } from './BannerForm';
import { Skeleton } from '@/components/ui/skeleton';

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isLoading?: boolean; // Added isLoading prop
}

export function BannerList({ 
  banners, 
  onEdit, 
  onDelete, 
  onToggle, 
  onMove,
  isLoading = false // Default value to make it optional
}: BannerListProps) {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-40">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="flex-1 p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-24 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="text-center p-10 border rounded-lg">
        <p className="text-muted-foreground">
          {isRtl ? 'لا توجد بانرات بعد. أضف بانرًا جديدًا للبدء.' : 'No banners yet. Add a new banner to get started.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {banners.map((banner, index) => (
        <Card key={banner.id} className={banner.active ? '' : 'opacity-60'}>
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-64 h-40 bg-muted">
                <img
                  src={banner.image}
                  alt={banner.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="font-medium text-lg">
                      {isRtl ? banner.titleAr : banner.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isRtl ? banner.descriptionAr : banner.descriptionEn}
                    </p>
                    <div className="mt-2">
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {isRtl ? banner.ctaAr : banner.ctaEn}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      URL: {banner.url}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-sm">
                        {isRtl ? 'الحالة:' : 'Status:'}
                      </div>
                      <Switch 
                        checked={banner.active} 
                        onCheckedChange={() => onToggle(banner.id)}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        disabled={index === 0}
                        onClick={() => onMove(banner.id, 'up')}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        disabled={index === banners.length - 1}
                        onClick={() => onMove(banner.id, 'down')}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onEdit(banner)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                          <path d="m15 5 4 4"></path>
                        </svg>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(banner.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
