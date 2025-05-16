
import React from 'react';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  nameAr?: string;
  image: string;
  slug: string;
  description: string;
  descriptionAr?: string;
}

// Mock categories data
const categories: Category[] = [
  {
    id: 1,
    name: 'Engine Components',
    nameAr: 'مكونات المحرك',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    slug: 'engine',
    description: 'All parts related to the engine including pistons, crankshafts, and gaskets.',
    descriptionAr: 'جميع الأجزاء المتعلقة بالمحرك بما في ذلك المكابس وعمود المرفق والحشيات.'
  },
  {
    id: 2,
    name: 'Brakes & Suspension',
    nameAr: 'الفرامل والتعليق',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    slug: 'brakes',
    description: 'Brake pads, discs, calipers, shock absorbers, and suspension components.',
    descriptionAr: 'وسادات الفرامل والأقراص والملاقط وممتصات الصدمات ومكونات التعليق.'
  },
  {
    id: 3,
    name: 'Electrical Systems',
    nameAr: 'الأنظمة الكهربائية',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    slug: 'electrical',
    description: 'Batteries, alternators, starters, and all electrical components.',
    descriptionAr: 'البطاريات والمولدات وبادئات التشغيل وجميع المكونات الكهربائية.'
  },
  {
    id: 4,
    name: 'Body Parts',
    nameAr: 'قطع غيار الهيكل',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    slug: 'body',
    description: 'Exterior body panels, mirrors, lights, and aesthetic components.',
    descriptionAr: 'ألواح الهيكل الخارجية والمرايا والأضواء والمكونات الجمالية.'
  },
  {
    id: 5,
    name: 'Interior Accessories',
    nameAr: 'اكسسوارات داخلية',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    slug: 'interior',
    description: 'Floor mats, seat covers, steering wheel covers, and other interior items.',
    descriptionAr: 'دواسات الأرضية وأغطية المقاعد وأغطية عجلة القيادة وغيرها من العناصر الداخلية.'
  },
  {
    id: 6,
    name: 'Filters & Fluids',
    nameAr: 'المرشحات والسوائل',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    slug: 'filters',
    description: 'Oil filters, air filters, cabin filters, and all automotive fluids.',
    descriptionAr: 'فلاتر الزيت وفلاتر الهواء وفلاتر المقصورة وجميع سوائل السيارات.'
  },
  {
    id: 7,
    name: 'Wheels & Tires',
    nameAr: 'العجلات والإطارات',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    slug: 'wheels',
    description: 'Alloy wheels, steel wheels, tires, and wheel accessories.',
    descriptionAr: 'عجلات السبائك وعجلات الصلب والإطارات واكسسوارات العجلات.'
  },
  {
    id: 8,
    name: 'Transmission & Drivetrain',
    nameAr: 'ناقل الحركة ومجموعة نقل الحركة',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    slug: 'transmission',
    description: 'Transmission components, clutches, differentials, and drive shafts.',
    descriptionAr: 'مكونات ناقل الحركة والقوابض والتروس التفاضلية وأعمدة القيادة.'
  }
];

const CategoriesPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('nav.categories')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => {
            const displayName = language === 'ar' && category.nameAr ? category.nameAr : category.name;
            const displayDescription = language === 'ar' && category.descriptionAr ? category.descriptionAr : category.description;
            
            return (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={displayName} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{displayName}</h2>
                  <p className="text-gray-600 line-clamp-2">{displayDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
