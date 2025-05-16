import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    // Header
    'site.name': 'Qitaf Auto Parts',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.account': 'My Account',
    'nav.search': 'Search products...',
    'language.switch': 'العربية',
    
    // Homepage
    'home.hero.title': 'Quality Auto Parts for Every Vehicle',
    'home.hero.subtitle': 'Find the right parts for your car at the best prices',
    'home.hero.button': 'Shop Now',
    'home.hero.explore': 'Explore Categories',
    'home.hero.new': 'New Collection',
    'home.featured': 'Featured Products',
    'home.categories': 'Browse Categories',
    'home.brands': 'Top Brands',
    'home.offers': 'Special Offers',
    'home.topRated.title': 'Top Rated Products',
    'home.topRated.subtitle': 'Highly rated by our customers',
    'home.viewAll': 'View All',
    
    // Benefits section
    'home.benefits.title': 'Why Choose Qitaf',
    'home.benefits.subtitle': 'We offer premium auto parts with excellent service',
    
    // Blog section
    'home.blog.title': 'Latest Articles',
    'home.blog.subtitle': 'Read our latest automotive tips and insights',
    'home.blog.readMore': 'Read More',
    
    // Testimonials
    'home.testimonials.title': 'What Our Customers Say',
    'home.testimonials.subtitle': 'Hear from our satisfied customers',
    
    // CTA section
    'home.cta.title': 'Ready to Find the Perfect Parts?',
    'home.cta.subtitle': 'Visit our store or shop online for the best auto parts',
    'home.cta.shopNow': 'Shop Now',
    'home.cta.contactUs': 'Contact Us',
    
    // Newsletter
    'newsletter.title': 'Stay Updated with Our Newsletter',
    'newsletter.subtitle': 'Subscribe to receive updates on new products, special offers, and automotive tips',
    'newsletter.emailPlaceholder': 'Enter your email address',
    'newsletter.subscribe': 'Subscribe',
    'newsletter.subscribing': 'Subscribing...',
    'newsletter.success': 'Thank you for subscribing to our newsletter!',
    'newsletter.error': 'Failed to subscribe. Please try again later.',
    
    // Product
    'product.addToCart': 'Add to Cart',
    'product.outOfStock': 'Out of Stock',
    'product.price': 'Price',
    'product.original': 'Original',
    'product.quantity': 'Quantity',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.related': 'Related Products',
    'product.reviews': 'reviews',
    'product.viewDetails': 'View Details',
    'product.noProducts': 'No products available',
    
    // Categories
    'category.all': 'All Categories',
    'category.engine': 'Engine Components',
    'category.brakes': 'Brakes & Suspension',
    'category.electrical': 'Electrical Systems',
    'category.body': 'Body Parts',
    'category.interior': 'Interior Accessories',
    'category.filters': 'Filters & Fluids',
    'category.wheels': 'Wheels & Tires',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continue': 'Continue Shopping',
    'cart.checkout': 'Proceed to Checkout',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.tax': 'Tax',
    'cart.shipping': 'Shipping',
    'cart.remove': 'Remove',
    
    // Authentication
    'auth.login': 'Login to Your Account',
    'auth.adminLogin': 'Admin Login',
    'auth.register': 'Create an Account',
    'auth.email': 'Email',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.name': 'Full Name',
    'auth.submit': 'Submit',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.loginSuccess': 'Login successful!',
    'auth.loginError': 'Login failed. Please check your credentials.',
    'auth.logoutSuccess': 'You have been logged out successfully.',
    'auth.logoutError': 'Failed to logout. Please try again.',
    'auth.notAuthorized': 'You are not authorized to access the admin panel.',
    'auth.loggingIn': 'Logging in...',
    
    // Footer
    'footer.rights': 'All Rights Reserved',
    'footer.about': 'About Us',
    'footer.contact': 'Contact Us',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.shipping': 'Shipping Policy',
    'footer.returns': 'Returns & Refunds',
    
    // Error messages
    'error.loading': 'Failed to load data. Please try again.',
    'error.network': 'Network error. Please check your connection.',
    'error.server': 'Server error. Please try again later.',
    'error.unexpected': 'An unexpected error occurred.',
    'error.auth': 'Authentication failed. Please log in again.',
  },
  ar: {
    // Header
    'site.name': 'قطاف لقطع غيار السيارات',
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.categories': 'الفئات',
    'nav.cart': 'عربة التسوق',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.account': 'حسابي',
    'nav.search': 'البحث عن منتجات...',
    'language.switch': 'English',
    
    // Homepage
    'home.hero.title': 'قطع غيار عالية الجودة لكل سيارة',
    'home.hero.subtitle': 'اعثر على القطع المناسبة لسيارتك بأفضل الأسعار',
    'home.hero.button': 'تسوق الآن',
    'home.hero.explore': 'استكشف الفئات',
    'home.hero.new': 'مجموعة جديدة',
    'home.featured': 'منتجات مميزة',
    'home.categories': 'تصفح الفئات',
    'home.brands': 'أفضل العلامات التجارية',
    'home.offers': 'عروض خاصة',
    'home.topRated.title': 'المنتجات الأعلى تقييمًا',
    'home.topRated.subtitle': 'مقيمة بشكل عالٍ من قبل عملائنا',
    'home.viewAll': 'عرض الكل',
    
    // Benefits section
    'home.benefits.title': 'لماذا تختار قطاف',
    'home.benefits.subtitle': 'نقدم قطع غيار سيارات متميزة مع خدمة ممتازة',
    
    // Blog section
    'home.blog.title': 'أحدث المقالات',
    'home.blog.subtitle': 'اقرأ أحدث نصائح ورؤى السيارات لدينا',
    'home.blog.readMore': 'قراءة المزيد',
    
    // Testimonials
    'home.testimonials.title': 'ماذا يقول عملاؤنا',
    'home.testimonials.subtitle': 'استمع إلى عملائنا الراضين',
    
    // CTA section
    'home.cta.title': 'هل أنت مستعد للعثور على القطع المثالية؟',
    'home.cta.subtitle': 'قم بزيارة متجرنا أو تسوق عبر الإنترنت للحصول على أفضل قطع غيار السيارات',
    'home.cta.shopNow': 'تسوق الآن',
    'home.cta.contactUs': 'اتصل بنا',
    
    // Newsletter
    'newsletter.title': 'ابق على اطلاع من خلال نشرتنا الإخبارية',
    'newsletter.subtitle': 'اشترك للحصول على تحديثات حول المنتجات الجديدة والعروض الخاصة ونصائح السيارات',
    'newsletter.emailPlaceholder': 'أدخل عنوان بريدك الإلكتروني',
    'newsletter.subscribe': 'اشترك',
    'newsletter.subscribing': 'جاري الاشتراك...',
    'newsletter.success': 'شكرًا لاشتراكك في نشرتنا الإخبارية!',
    'newsletter.error': 'فشل الاشتراك. يرجى المحاولة مرة أخرى لاحقًا.',
    
    // Product
    'product.addToCart': 'أضف إلى السلة',
    'product.outOfStock': 'غير متوفر',
    'product.price': 'السعر',
    'product.original': 'أصلي',
    'product.quantity': 'الكمية',
    'product.description': 'الوصف',
    'product.specifications': 'المواصفات',
    'product.related': 'منتجات ذات صلة',
    'product.reviews': 'تقييمات',
    'product.viewDetails': 'عرض التفاصيل',
    'product.noProducts': 'لا توجد منتجات متاحة',
    
    // Categories
    'category.all': 'جميع الفئات',
    'category.engine': 'مكونات المحرك',
    'category.brakes': 'الفرامل والتعليق',
    'category.electrical': 'الأنظمة الكهربائية',
    'category.body': 'قطع غيار الهيكل',
    'category.interior': 'اكسسوارات داخلية',
    'category.filters': 'المرشحات والسوائل',
    'category.wheels': 'العجلات والإطارات',
    
    // Cart
    'cart.title': 'عربة التسوق',
    'cart.empty': 'عربة التسوق فارغة',
    'cart.continue': 'متابعة التسوق',
    'cart.checkout': 'إتمام الشراء',
    'cart.total': 'المجموع',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.tax': 'الضريبة',
    'cart.shipping': 'الشحن',
    'cart.remove': 'إزالة',
    
    // Authentication
    'auth.login': 'تسجيل الدخول إلى حسابك',
    'auth.adminLogin': 'تسجيل دخول المدير',
    'auth.register': 'إنشاء حساب جديد',
    'auth.email': 'البريد الإلكتروني',
    'auth.username': 'اسم المستخدم',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.name': 'الاسم الكامل',
    'auth.submit': 'إرسال',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.loginSuccess': 'تم تسجيل الدخول بنجاح!',
    'auth.loginError': 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.',
    'auth.logoutSuccess': 'تم تسجيل الخروج بنجاح.',
    'auth.logoutError': 'فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.',
    'auth.notAuthorized': 'غير مصرح لك بالوصول إلى لوحة الإدارة.',
    'auth.loggingIn': 'جاري تسجيل الدخول...',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.about': 'من نحن',
    'footer.contact': 'اتصل بنا',
    'footer.terms': 'الشروط والأحكام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.shipping': 'سياسة الشحن',
    'footer.returns': 'الإرجاع والاسترداد',
    
    // Error messages
    'error.loading': 'فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.',
    'error.network': 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
    'error.server': 'خطأ في الخادم. يرجى المحاولة لاحقًا.',
    'error.unexpected': 'حدث خطأ غير متوقع.',
    'error.auth': 'فشل في المصادقة. يرجى تسجيل الدخول مرة أخرى.',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  dir: 'ltr'
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check if user has previously selected a language
    const savedLanguage = localStorage.getItem('language') as Language;
    return (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) ? savedLanguage : 'en';
  });
  const [dir, setDir] = useState<'ltr' | 'rtl'>(language === 'ar' ? 'rtl' : 'ltr');

  useEffect(() => {
    // Update direction when language changes
    setDir(language === 'ar' ? 'rtl' : 'ltr');
    
    // Save language preference
    localStorage.setItem('language', language);
    
    // Update HTML dir attribute and lang
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update body class for RTL specific styling
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
