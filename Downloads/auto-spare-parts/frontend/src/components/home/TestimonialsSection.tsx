
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  id: number;
  name: string;
  nameAr?: string;
  role: string;
  roleAr?: string;
  content: string;
  contentAr?: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Hassan",
    nameAr: "أحمد حسن",
    role: "Car Owner",
    roleAr: "مالك سيارة",
    content: "The parts I ordered arrived quickly and were exactly what I needed. The quality exceeded my expectations and the price was very reasonable.",
    contentAr: "وصلت القطع التي طلبتها بسرعة وكانت بالضبط ما احتاجه. الجودة تجاوزت توقعاتي والسعر كان معقولاً جداً.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Johnson",
    nameAr: "سارة جونسون",
    role: "Mechanic",
    roleAr: "ميكانيكي",
    content: "As a professional mechanic, I rely on quality parts. This store has never let me down with their genuine OEM parts and fast delivery.",
    contentAr: "كميكانيكي محترف، أعتمد على قطع الغيار ذات الجودة العالية. هذا المتجر لم يخذلني أبداً بقطعه الأصلية وتوصيله السريع.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 4
  },
  {
    id: 3,
    name: "Mohammed Al-Shammari",
    nameAr: "محمد الشمري",
    role: "Garage Owner",
    roleAr: "صاحب كراج",
    content: "Running a busy garage means I need reliable suppliers. They have the widest selection of parts and their customer service is outstanding.",
    contentAr: "إدارة كراج مزدحم تعني أنني بحاجة إلى موردين موثوقين. لديهم أوسع تشكيلة من قطع الغيار وخدمة العملاء لديهم متميزة.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Helper to handle prev/next testimonial navigation
  const handleNextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const handlePrevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-auto-gray to-white dark:from-slate-900 dark:to-auto-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('home.testimonials.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('home.testimonials.subtitle')}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 border-4 border-white dark:border-slate-700 shadow-md">
                    <AvatarImage src={testimonials[activeIndex].avatar} alt={language === 'ar' && testimonials[activeIndex].nameAr ? testimonials[activeIndex].nameAr : testimonials[activeIndex].name} />
                    <AvatarFallback>{testimonials[activeIndex].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="ml-4 rtl:mr-4 rtl:ml-0">
                    <h3 className="font-semibold text-xl">
                      {language === 'ar' && testimonials[activeIndex].nameAr ? testimonials[activeIndex].nameAr : testimonials[activeIndex].name}
                    </h3>
                    <Badge variant="outline" className="mt-1">
                      {language === 'ar' && testimonials[activeIndex].roleAr ? testimonials[activeIndex].roleAr : testimonials[activeIndex].role}
                    </Badge>
                  </div>
                </div>
                
                <div className="hidden md:flex">
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
              </div>
              
              <div className="relative">
                <Quote className="absolute top-0 left-0 h-8 w-8 text-auto-red/20 -translate-y-4 -translate-x-2" />
                <p className="text-lg mb-6 pt-4 px-6 font-light">
                  {language === 'ar' && testimonials[activeIndex].contentAr ? testimonials[activeIndex].contentAr : testimonials[activeIndex].content}
                </p>
              </div>
              
              <div className="flex md:hidden justify-center mt-4 mb-2">
                {renderStars(testimonials[activeIndex].rating)}
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="flex space-x-1 rtl:space-x-reverse">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === activeIndex ? 'w-8 bg-auto-red' : 'w-2 bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevTestimonial}
                    className="rounded-full h-10 w-10 border border-gray-300 dark:border-gray-600"
                  >
                    <span className="sr-only">Previous testimonial</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextTestimonial}
                    className="rounded-full h-10 w-10 border border-gray-300 dark:border-gray-600"
                  >
                    <span className="sr-only">Next testimonial</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
