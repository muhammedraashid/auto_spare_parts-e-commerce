
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { Phone, Mail, ArrowRight } from 'lucide-react';

const CtaSection: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-auto-red/90 mix-blend-multiply" />
        <img 
          src={theme === 'dark' 
            ? "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80" 
            : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          } 
          alt="Car parts" 
          className="object-cover w-full h-full opacity-50"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-md">
            {t('home.cta.title')}
          </h2>
          
          <p className="text-lg mb-8 text-white/90">
            {t('home.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-auto-red hover:bg-white/90 hover:text-auto-red/90 gap-2"
            >
              <Link to="/products">
                {t('home.cta.shopNow')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-white text-white hover:bg-white/20"
            >
              <Link to="/contact">
                {t('home.cta.contactUs')}
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span className="font-medium">+966 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span className="font-medium">support@qitaf-auto.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
