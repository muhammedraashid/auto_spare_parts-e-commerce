
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  nameAr?: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Engine Components',
    nameAr: 'مكونات المحرك',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    slug: 'engine'
  },
  {
    id: 2,
    name: 'Brakes & Suspension',
    nameAr: 'الفرامل والتعليق',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    slug: 'brakes'
  },
  {
    id: 3,
    name: 'Electrical Systems',
    nameAr: 'الأنظمة الكهربائية',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    slug: 'electrical'
  },
  {
    id: 4,
    name: 'Body Parts',
    nameAr: 'قطع غيار الهيكل',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    slug: 'body'
  },
  {
    id: 5,
    name: 'Interior Accessories',
    nameAr: 'اكسسوارات داخلية',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    slug: 'interior'
  },
  {
    id: 6,
    name: 'Filters & Fluids',
    nameAr: 'المرشحات والسوائل',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    slug: 'filters'
  }
];

const CategorySection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-12 bg-auto-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t('home.categories')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(category => {
            const displayName = language === 'ar' && category.nameAr ? category.nameAr : category.name;
            
            return (
              <Link 
                key={category.id} 
                to={`/categories/${category.slug}`}
                className="group relative rounded-lg overflow-hidden shadow-lg h-48"
              >
                <div className="absolute inset-0">
                  <img 
                    src={category.image} 
                    alt={displayName} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold">{displayName}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
