
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react';

const heroImages = [
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
  'https://images.unsplash.com/photo-1583267746897-2cf415887172',
];

const HeroSection: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const ArrowIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className="relative bg-auto-dark text-white min-h-[500px] md:min-h-[600px] flex items-center">
      <div 
        className="absolute inset-0 transition-opacity duration-1000 bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImages[activeIndex]}')` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-auto-dark/90 via-auto-dark/70 to-auto-dark/10 dark:from-black/90 dark:via-black/70 dark:to-black/30 ${dir === 'rtl' ? 'rotate-180' : ''}`}></div>
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className={`max-w-2xl ${dir === 'rtl' ? 'mr-auto text-right' : 'ml-auto text-left'} transition-transform duration-500 transform translate-y-0`}>
          <span className="inline-block px-4 py-2 rounded-full bg-auto-red/90 text-white text-sm font-medium mb-6 animate-pulse">
            {t('home.hero.new')}
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
          
          <p className="text-xl mb-8 text-gray-200 max-w-xl">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-auto-red hover:bg-auto-red/90 text-white gap-2"
            >
              <Link to="/products">
                <ShoppingCart className="h-5 w-5" />
                {t('home.hero.button')}
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-white text-white hover:bg-white/20 gap-1"
            >
              <Link to="/categories">
                {t('home.hero.explore')}
                <ArrowIcon className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`h-2 transition-all ${
              index === activeIndex ? 'w-8 bg-auto-red' : 'w-2 bg-white/40'
            } rounded-full`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
