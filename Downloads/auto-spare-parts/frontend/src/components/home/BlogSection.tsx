
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarIcon, Clock, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  titleAr?: string;
  excerpt: string;
  excerptAr?: string;
  image: string;
  date: string;
  readTime: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How to Extend Your Car Battery Life",
    titleAr: "كيفية إطالة عمر بطارية سيارتك",
    excerpt: "Learn essential tips to maximize your car battery's lifespan and avoid unexpected failures.",
    excerptAr: "تعلم النصائح الأساسية لزيادة عمر بطارية سيارتك وتجنب الأعطال غير المتوقعة.",
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2025-04-15",
    readTime: "5",
    slug: "extend-car-battery-life"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Car Maintenance",
    titleAr: "الدليل الشامل لصيانة السيارات",
    excerpt: "Regular maintenance is key to keeping your vehicle running smoothly. Follow our comprehensive guide.",
    excerptAr: "الصيانة المنتظمة هي المفتاح للحفاظ على سيارتك تعمل بسلاسة. اتبع دليلنا الشامل.",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2025-03-22",
    readTime: "8",
    slug: "ultimate-car-maintenance-guide"
  },
  {
    id: 3,
    title: "Choosing the Right Tires for Your Vehicle",
    titleAr: "اختيار الإطارات المناسبة لسيارتك",
    excerpt: "Selecting the correct tires can improve handling, fuel efficiency, and safety. Here's what to consider.",
    excerptAr: "اختيار الإطارات الصحيحة يمكن أن يحسن التحكم وكفاءة الوقود والسلامة. إليك ما يجب مراعاته.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2025-02-10",
    readTime: "6",
    slug: "choosing-right-tires"
  }
];

const BlogSection: React.FC = () => {
  const { language, t } = useLanguage();

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  return (
    <section className="py-16 bg-white dark:bg-auto-dark">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold">{t('home.blog.title')}</h2>
            <p className="text-muted-foreground mt-2">{t('home.blog.subtitle')}</p>
          </div>
          <Button asChild variant="outline" className="flex items-center gap-1">
            <Link to="/blog">
              {t('home.viewAll')} 
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-w-16 aspect-h-9 relative">
                <img 
                  src={post.image} 
                  alt={language === 'ar' && post.titleAr ? post.titleAr : post.title}
                  className="object-cover w-full h-48" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" /> 
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> 
                    {post.readTime} {t('home.blog.minRead')}
                  </span>
                </div>
                
                <h3 className="font-semibold text-xl mb-2 line-clamp-2">
                  {language === 'ar' && post.titleAr ? post.titleAr : post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {language === 'ar' && post.excerptAr ? post.excerptAr : post.excerpt}
                </p>
                
                <Button asChild variant="ghost" className="px-0 hover:bg-transparent hover:underline">
                  <Link to={`/blog/${post.slug}`}>
                    {t('home.blog.readMore')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
