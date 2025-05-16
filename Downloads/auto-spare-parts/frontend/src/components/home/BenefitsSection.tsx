
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Truck, 
  Shield, 
  Award, 
  Headphones, 
  RefreshCcw, 
  CreditCard 
} from 'lucide-react';

interface Benefit {
  id: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  icon: React.ReactNode;
}

const BenefitsSection: React.FC = () => {
  const { language, t } = useLanguage();
  
  const benefits: Benefit[] = [
    {
      id: 1,
      title: "Free Shipping",
      titleAr: "شحن مجاني",
      description: "Free shipping on all orders over 500 SAR",
      descriptionAr: "شحن مجاني على جميع الطلبات التي تزيد عن 500 ريال",
      icon: <Truck className="h-8 w-8" />,
    },
    {
      id: 2,
      title: "Quality Guarantee",
      titleAr: "ضمان الجودة",
      description: "All parts are original or OEM quality",
      descriptionAr: "جميع القطع أصلية أو بجودة الشركة المصنعة",
      icon: <Shield className="h-8 w-8" />,
    },
    {
      id: 3,
      title: "Expert Support",
      titleAr: "دعم خبير",
      description: "Technical support from automotive experts",
      descriptionAr: "دعم فني من خبراء السيارات",
      icon: <Headphones className="h-8 w-8" />,
    },
    {
      id: 4,
      title: "Easy Returns",
      titleAr: "إرجاع سهل",
      description: "30-day hassle-free return policy",
      descriptionAr: "سياسة إرجاع سهلة خلال 30 يوم",
      icon: <RefreshCcw className="h-8 w-8" />,
    },
    {
      id: 5,
      title: "Secure Payment",
      titleAr: "دفع آمن",
      description: "Multiple secure payment methods",
      descriptionAr: "طرق دفع آمنة متعددة",
      icon: <CreditCard className="h-8 w-8" />,
    },
    {
      id: 6,
      title: "Trusted Brand",
      titleAr: "علامة تجارية موثوقة",
      description: "Serving customers for over 10 years",
      descriptionAr: "نخدم العملاء لأكثر من 10 سنوات",
      icon: <Award className="h-8 w-8" />,
    }
  ];

  return (
    <section className="py-16 bg-auto-gray/50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('home.benefits.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('home.benefits.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.id} className="border-none shadow hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-auto-red/10 dark:bg-auto-red/20 flex items-center justify-center mb-4 text-auto-red">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">
                  {language === 'ar' && benefit.titleAr ? benefit.titleAr : benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'ar' && benefit.descriptionAr ? benefit.descriptionAr : benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
